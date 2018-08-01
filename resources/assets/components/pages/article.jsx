import React from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

import Spinner from "../parts/spinner";
import Rating from "../parts/rating";
import { client } from "../app";
import LayoutAuthenticated from "../parts/layout-authenticated";
import ArticleImages from "../parts/article-images";
import ArticleImagesForm from "../parts/article-images-form";
import {
  getHumanReadableDateTime,
  getHumanReadableFromNowDateTime,
  userIsEditor,
  getUserProfile
} from "../helper";

const ARTICLE_QUERY = gql`
  query article($id: Int) {
    article(id: $id) {
      id
      pitch {
        id
      }
      title
      lead
      text
      note
      images {
        id
        url
        text
      }
      updated
      rating
    }
  }
`;

const UPDATE_ARTICLE_MUTATION = gql`
  mutation article(
    $id: Int!
    $title: String
    $text: String
    $lead: String
    $note: String
  ) {
    updateArticle(
      id: $id
      title: $title
      text: $text
      lead: $lead
      note: $note
    ) {
      id
    }
  }
`;

class Article extends React.Component {
  constructor(props) {
    super(props);

    this.articleId = this.props.match.params.articleId;
    this.state = {
      article: null,
      user: null
    };

    this.getArticleData();
    this.getUser();
  }

  setArticleToState(data) {
    const article = {
      id: data.article.id,
      title: data.article.title,
      lead: data.article.lead,
      text: data.article.text,
      updated: data.article.updated,
      note: data.article.note,
      pitch: {
        id: data.article.pitch.id
      },
      rating: data.article.rating ? data.article.rating : 0,
      images: data.article.images
    };
    this.setState({ article: article });
  }

  setUserToState(data) {
    const user = {
      roles: data.user.roles
    };
    this.setState({ user: user });
  }

  render() {
    if (this.state.article !== null) {
      if (userIsEditor(this.state.user)) {
        return this.renderArticleView();
      } else {
        return this.renderArticleForm();
      }
    } else {
      // We don't have data yet, so we show we're loading.
      return (
        <LayoutAuthenticated>
          <Spinner />
        </LayoutAuthenticated>
      );
    }
  }

  renderArticleView() {
    const article = this.state.article;
    const pitch = article.pitch;

    return (
      <LayoutAuthenticated>
        <header className="uk-margin-large-bottom">
          <Link to={`/pitch/${pitch.id}`} className="uk-text-primary">
            <span uk-icon="icon: arrow-left" /> Back to related pitch
          </Link>
        </header>

        <article className="uk-article">
          <h1 className="uk-article-title">{article.title}</h1>
          <Rating value={article.rating} id={article.id} />
          <p className="uk-article-meta">
            Created{" "}
            <span title={getHumanReadableDateTime(article.updated)}>
              {getHumanReadableFromNowDateTime(article.updated)}
            </span>
          </p>
          <p className="uk-text-lead">{article.lead}</p>
          <p className="fx-pre-line">{article.text}</p>
          <hr className="uk-article-divider" />
          <h2>Note</h2>
          <p className="fx-pre-line">{article.note}</p>
          <hr className="uk-article-divider" />
          <h2>Images</h2>
          <ArticleImages user={this.state.user} images={article.images} />
        </article>
      </LayoutAuthenticated>
    );
  }

  renderArticleForm() {
    const article = this.state.article;
    const pitch = article.pitch;

    return (
      <LayoutAuthenticated>
        <header className="uk-margin-large-bottom">
          <Link to={`/pitch/${pitch.id}`} className="uk-text-primary">
            <span uk-icon="icon: arrow-left" /> Back to related pitch
          </Link>
        </header>
        <form className="uk-form-stacked" onSubmit={this.onSubmit.bind(this)}>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="title">
              The Title
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-input uk-form-width-large"
                id="title"
                type="text"
                placeholder="e.g. Why Cats are the most lovely pets"
                value={article.title}
                onChange={this.onChange.bind(this, "title")}
              />
            </div>
          </div>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="description">
              Lead Text
            </label>
            <div className="uk-form-controls">
              <textarea
                rows="4"
                className="uk-textarea uk-form-width-large"
                id="description"
                placeholder="e.g. There are two types of people: cat-people and dog-people. Here is why you should be a cat-person."
                value={article.lead}
                onChange={this.onChange.bind(this, "lead")}
              />
            </div>
          </div>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="description">
              Text
            </label>
            <div className="uk-form-controls">
              <textarea
                rows="12"
                className="uk-textarea"
                id="description"
                placeholder="e.g. Cats are so fluffy and sweet. You just have to love them."
                value={article.text}
                onChange={this.onChange.bind(this, "text")}
              />
            </div>
          </div>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="description">
              Note
            </label>
            <div className="uk-form-controls">
              <textarea
                rows="4"
                className="uk-textarea uk-form-width-large"
                id="description"
                placeholder="e.g. Please don't shorten the quote, because my interview partner approved it like this."
                value={article.note}
                onChange={this.onChange.bind(this, "note")}
              />
            </div>
          </div>
          <div className="uk-margin">
            <button type="submit" className="uk-button uk-button-primary">
              Save article
            </button>
          </div>
        </form>
        <div className="uk-margin-large">
          <h2>Images</h2>
          <ArticleImagesForm
            images={article.images}
            articleId={article.id}
            onImageUploaded={articleImage => this.onImageUploaded(articleImage)}
            onImageDeleted={imageId => this.onImageDeleted(imageId)}
          />
        </div>
      </LayoutAuthenticated>
    );
  }

  /**
   * ###### GraphQL Queries ######
   */
  async getUser() {
    const userProfile = await getUserProfile();
    if (userProfile) {
      this.setState(userProfile);
    }
  }

  async getArticleData() {
    try {
      const response = await client.query({
        query: ARTICLE_QUERY,
        variables: { id: this.articleId }
      });

      this.setArticleToState(response.data);
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting article.",
        status: "danger"
      });
    }
  }

  async saveArticle() {
    const article = this.state.article;
    try {
      await client.mutate({
        mutation: UPDATE_ARTICLE_MUTATION,
        variables: {
          id: article.id,
          title: article.title,
          text: article.text,
          lead: article.lead,
          note: article.note
        }
      });

      // Show saved message
      UIkit.notification({ message: "Article saved.", status: "success" });
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error while saving article.",
        status: "danger"
      });
    }
  }

  /**
   * ###### Event Listeners ######
   */

  onChange(attr, event) {
    const article = this.state.article;
    article[attr] = event.target.value;
    this.setState({ article: article });
  }

  onSubmit(event) {
    event.preventDefault();
    this.saveArticle();
  }

  onImageUploaded(articleImage) {
    // Add image to user in state
    let article = this.state.article;
    if (article !== null) {
      article = JSON.parse(JSON.stringify(article));
      article.images.push(articleImage);
      this.setState({ article: article });
    }
  }

  onImageDeleted(imageId) {
    // Remove image from user in state
    const article = this.state.article;
    if (article !== null) {
      const images = JSON.parse(JSON.stringify(article.images));
      const imageIndexToDelete = images.findIndex(
        image => image.id === imageId
      );
      images.splice(imageIndexToDelete, 1);
      article.images = images;
      this.setState({ article: article });
    }
  }
}

export default Article;
