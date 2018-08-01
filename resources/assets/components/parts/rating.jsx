import React from "react";
import { render } from "react-dom";
import gql from "graphql-tag";

import { client } from "../app";

const RATING_NOT_SET = "This article needs some rating!";
const RATE_ARTICLE_MUTATION = gql`
  mutation RateArticleMutation($id: Int!, $rating: Int!) {
    rateArticle(id: $id, rating: $rating) {
      rating
      id
    }
  }
`;

class Rating extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: -1,
      value: this.props.value,
      message: this.props.value ? "" : RATING_NOT_SET
    };
  }

  render() {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const attr = {
        className: `fx-stroke-brand
                   ${this.state.value > i === i ? " fx-fill-brand" : ""}`
      };
      attr.className = `fx-stroke-brand
                       ${
                         this.state.value > i || this.state.hover >= i
                           ? " fx-fill-brand"
                           : ""
                       }
                       ${this.state.value === i + 1 ? "" : " uk-link"}`;
      attr.onMouseOver = this.onMouseOver.bind(this, i);
      attr.onMouseOut = this.onMouseOut.bind(this);
      attr.onClick = this.onClick.bind(this, i);
      stars.push(<span key={i} uk-icon="icon: star" {...attr} />);
    }

    return (
      <div className="uk-flex uk-flex-bottom">
        <div className="uk-inline-flex">{stars}</div>
        <span className="uk-margin-small-left uk-text-small uk-text-primary">
          {this.state.message}
        </span>
      </div>
    );
  }

  onMouseOver(i) {
    if (i + 1 === this.state.value) {
      return;
    }

    this.setState({
      message: `Click to set article rating to ${i + 1}`,
      hover: i
    });
  }

  onMouseOut() {
    this.setState({
      message: this.state.value ? "" : RATING_NOT_SET,
      hover: -1
    });
  }

  async onClick(i) {
    try {
      // Only change rating, if different value
      if (i + 1 === this.state.value) {
        return;
      }

      const response = await client.mutate({
        mutation: RATE_ARTICLE_MUTATION,
        variables: {
          id: this.props.id,
          rating: i + 1
        }
      });

      if (Array.isArray(response.errors) && response.errors.length > 0) {
        UIkit.notification({
          message: "Error while saving rating.",
          status: "danger"
        });

        return;
      }

      this.setState({
        value: i + 1,
        message: `Article rating set to ${i + 1}`
      });
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error while saving rating.",
        status: "danger"
      });
    }
  }
}

Rating.defaultProps = {
  id: 0,
  value: 0
};

export default Rating;
