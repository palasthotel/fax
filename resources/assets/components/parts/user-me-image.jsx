import React from "react";
import { render } from "react-dom";
import gql from "graphql-tag";

import { client } from "../app";
import ProfileImage from "../parts/profile-image";

// Using Symbols for state machine
// @see https://stackoverflow.com/questions/44447847/enums-in-javascript-with-es6
const NETWORK_STATES = Object.freeze({
  IDLE: Symbol("idle"),
  REQUESTING: Symbol("requesting")
});

const UPLOAD_IMAGE_MUTATION = gql`
  mutation uploadProfileImage($file: Upload!) {
    uploadProfileImage(file: $file) {
      id
      url
    }
  }
`;

const DELETE_IMAGE_MUTATION = gql`
  mutation deleteProfileImage {
    deleteProfileImage
  }
`;

class UserMeImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      networkState: NETWORK_STATES.IDLE
    };
  }

  /**
   * ###### Render-Function ######
   */

  render() {
    const user = this.props.user;

    if (user === null) {
      return null;
    }

    return (
      <div className="uk-margin uk-flex uk-flex-column uk-flex-top">
        <ProfileImage user={user} size={200} link={false} />
        <div className="uk-flex uk-flex-wrap uk-margin">
          <div className="js-upload uk-margin-right" uk-form-custom="true">
            <input
              type="file"
              onChange={event => this.onClickAddImage(event)}
            />
            {this.state.networkState === NETWORK_STATES.IDLE && (
              <button className="uk-button uk-button-link">
                <span
                  uk-icon="icon: upload"
                  className="uk-margin-small-right"
                />
                Upload picture
              </button>
            )}
            {this.state.networkState === NETWORK_STATES.REQUESTING && (
              <button className="uk-button uk-button-link" disabled>
                <span
                  uk-icon="icon: upload"
                  className="uk-margin-small-right"
                />
                Uploading picture...
                <div className="uk-margin-small-left" uk-spinner="ratio: 0.5" />
              </button>
            )}
          </div>
          {user.profileImage &&
            user.profileImage != null && (
              <button
                className="uk-button uk-button-link"
                onClick={event => this.onClickDeleteImage(event)}
              >
                <span uk-icon="icon: trash" className="uk-margin-small-right" />
                Delete picture
              </button>
            )}
        </div>
      </div>
    );
  }

  /**
   * ###### Event-Listener ######
   */

  onClickAddImage(event) {
    this.setState({ networkState: NETWORK_STATES.REQUESTING });
    this.uploadImage(event.target.files[0]);
  }

  onClickDeleteImage(event) {
    event.preventDefault();
    const confirmed = confirm(
      "Are you sure you want to delete your profile image?"
    );
    if (confirmed) {
      this.deleteImage();
    }
  }

  /**
   * ###### GraphQL Queries & Mutations ######
   */

  async uploadImage(file) {
    const variables = {
      file: file
    };

    try {
      const response = await client.mutate({
        mutation: UPLOAD_IMAGE_MUTATION,
        variables: variables
      });

      // Dheck for error in json
      if (Array.isArray(response.errors) && response.errors.length > 0) {
        UIkit.notification({
          message:
            "Error saving profile image. Please make sure to use only allowed files.",
          status: "danger"
        });
      }

      this.setState({ networkState: NETWORK_STATES.IDLE });

      // Call parent function
      if (typeof this.props.onImageUploaded === "function") {
        const profileImage = response.data.uploadProfileImage;
        this.props.onImageUploaded(profileImage);
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

  async deleteImage() {
    try {
      const response = await client.mutate({
        mutation: DELETE_IMAGE_MUTATION,
        variables: null
      });

      // Check for error in json
      if (Array.isArray(response.errors) && response.errors.length > 0) {
        UIkit.notification({
          message: "Error deleting profile image.",
          status: "danger"
        });
      }

      // Call parent function
      if (typeof this.props.onImageDeleted === "function") {
        this.props.onImageDeleted();
      }
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error while deleting profile image.",
        status: "danger"
      });
    }
  }
}

export default UserMeImage;
