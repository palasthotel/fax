import React from "react";
import {render} from "react-dom";
import gql from "graphql-tag";

import {client} from "../app";

// Using Symbols for state machine
// @see https://stackoverflow.com/questions/44447847/enums-in-javascript-with-es6
const NETWORK_STATES = Object.freeze({
  IDLE: Symbol("idle"),
  REQUESTING: Symbol("requesting")
});

const DELETE_ARTICLE_IMAGE_MUTATION = gql`
  mutation deleteArticleImage($id: Int!) {
    deleteArticleImage(id: $id)
  }
`;

const UPLOAD_ARTICLE_IMAGE_MUTATION = gql`
  mutation uploadArticleImage($file: Upload!, $articleId: Int!, $text: String) {
    uploadArticleImage(file: $file, articleId: $articleId, text: $text) {
      id
      url
      text
    }
  }
`;

class ArticleImagesForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      networkState: NETWORK_STATES.IDLE,
      fileToUpload: null,
      fileToUploadText: "",
    };
  }

  render() {
    const images = this.props.images;

    if (!Array.isArray(images) || images.length < 1) {
      return (
        <div className="uk-margin-medium uk-margin-medium-bottom" uk-grid="">
          <div className="uk-width-1-4@m">No images yet.</div>
          <div className="uk-width-1-1">{this.renderAddImageButton()}</div>
        </div>
      );
    }

    return (
      <div className="uk-margin-medium uk-margin-medium-bottom" uk-grid="">
        {images.map(image => {
          return (
            <div className="uk-width-1-4@m" key={`article_image_${image.id}`}>
              <img src={image.url} className="uk-box-shadow-small"/>
              {typeof image.text !== undefined && image.text != "" && (
                <p className="uk-margin-small">{image.text}</p>
              )}
              <button
                className="uk-button uk-button-link uk-margin-small-top"
                onClick={this.onClickDeleteImage.bind(this, image.id)}
              >
                <span uk-icon="icon: trash" className="uk-margin-small-right"/>
                Delete
              </button>
            </div>
          );
        })}
        <div className="uk-width-1-1">{this.renderAddImageButton()}</div>
      </div>
    );
  }

  renderAddImageButton() {
    return (
      <form onSubmit={event => this.onSubmitImageForm(event)}>
        <h3>New Image</h3>
        <div className="js-upload" uk-form-custom="true">
          <input type="file" onChange={event => this.onClickAddImage(event)}/>
          {this.state.fileToUpload === null && (
            <button className="uk-button uk-button-secondary">
              <span uk-icon="icon: upload" className="uk-margin-small-right"/>
              Add Image
            </button>
          )}
          {this.state.fileToUpload !== null && (
            <button className="uk-button uk-button-secondary">
              <span uk-icon="icon: upload" className="uk-margin-small-right"/>
              {this.state.fileToUpload.name}
            </button>
          )}
          <p className="uk-text-meta">
            We prefer horizontal pictures in 1920x1080px.
          </p>
        </div>
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="description">Caption / Credits</label>
          <div className="uk-form-controls">
            <textarea
              className="uk-textarea uk-form-width-large"
              onChange={this.onChangeImageText.bind(this)}
              rows="4"
              value={this.state.fileToUploadText}/>
          </div>
        </div>
        <div className="uk-form-controls uk-margin">
          {this.state.networkState === NETWORK_STATES.REQUESTING && (
            <button type="Submit" className="uk-button uk-button-primary" disabled>Uploading...</button>
          )}
          {this.state.networkState === NETWORK_STATES.IDLE && (
            <button type="Submit" className="uk-button uk-button-primary">Submit</button>
          )}
        </div>
      </form>
    );
  }

  /**
   * ###### GraphQL Queries ######
   */

  async deleteImage(imageId) {
    try {
      const response = await client.mutate({
        mutation: DELETE_ARTICLE_IMAGE_MUTATION,
        variables: {id: imageId}
      });

      // Check for error in json
      if (
        Array.isArray(response.data.errors) &&
        response.data.errors.length > 0
      ) {
        UIkit.notification({
          message: "Error deleting image. Please make sure to use only allowed values and have correct access rights.",
          status: "danger"
        });
      } else {
        // Call parent function
        if (typeof this.props.onImageDeleted === "function") {
          this.props.onImageDeleted(imageId);
        }
      }
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error deleting image.",
        status: "danger"
      });
    }
  }

  async addImage() {
    const variables = {
      file: this.state.fileToUpload,
      articleId: this.props.articleId,
      text: this.state.fileToUploadText,
    };

    try {
      const response = await client.mutate({
        mutation: UPLOAD_ARTICLE_IMAGE_MUTATION,
        variables: variables
      });

      // Check for error in json
      if (Array.isArray(response.errors) && response.errors.length > 0) {
        UIkit.notification({
          message: "Error saving article image. Please make sure to use only allowed files.",
          status: "danger"
        });
      }

      this.setState({networkState: NETWORK_STATES.IDLE, fileToUpload: null, fileToUploadText: ""});

      // Call parent function
      if (typeof this.props.onImageUploaded === "function") {
        const image = response.data.uploadArticleImage;
        this.props.onImageUploaded(image);
      }
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error while saving profile.",
        status: "danger"
      });
    }
  }

  /**
   * ###### Event Listeners ######
   */

  onClickDeleteImage(imageId) {
    const confirmed = confirm("Are you sure you want to delete this image?");
    if (confirmed) {
      this.deleteImage(imageId);
    }
  }

  onClickAddImage(event) {
    this.setState({fileToUpload: event.target.files[0]});
  }

  onChangeImageText(event) {
    this.setState({fileToUploadText: event.target.value});
  }

  onSubmitImageForm(event) {
    event.preventDefault();
    if (this.state.fileToUpload !== null) {
      this.setState({networkState: NETWORK_STATES.REQUESTING});
      this.addImage();
    }
  }
}

export default ArticleImagesForm;
