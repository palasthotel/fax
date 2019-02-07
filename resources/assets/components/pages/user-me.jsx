import React, { Fragment } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

import LayoutAuthenticated from "../parts/layout-authenticated";
import { client } from "../app";
import ScrollToTopOnMount from "../scroll-to-top-on-mount";
import Spinner from "../parts/spinner";
import UserMeImage from "../parts/user-me-image";
import { errorToStringArray } from "../helper";

// Using Symbols for state machine
// @see https://stackoverflow.com/questions/44447847/enums-in-javascript-with-es6
const NETWORK_STATES = Object.freeze({
  IDLE: Symbol("idle"),
  REQUESTING: Symbol("requesting")
});

const ALERT_STATES = Object.freeze({
  NONE: Symbol("none"),
  ERROR: Symbol("error"),
  SUCCESS: Symbol("success")
});

const USER_QUERY = gql`
  query {
    user {
      id
      firstName
      lastName
      email
      phone
      website
      facebook
      twitter
      instagram
      expertises {
        id
      }
      locations {
        id
      }
      profileImage {
        id
        url
      }
    }
  }
`;

const LOCATIONS_QUERY = gql`
  query {
    locations {
      id
      name
    }
  }
`;

const EXPERTISES_QUERY = gql`
  query {
    expertises {
      id
      name
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation updateUser(
    $id: Int!
    $firstName: String!
    $lastName: String!
    $phone: String!
    $website: String
    $facebook: String
    $twitter: String
    $instagram: String
    $expertises: [Int]!
    $locations: [Int]!
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      website: $website
      facebook: $facebook
      twitter: $twitter
      instagram: $instagram
      expertises: $expertises
      locations: $locations
    ) {
      id
    }
  }
`;

class UserMe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      expertises: null,
      locations: null,
      alertState: ALERT_STATES.NONE,
      networkState: NETWORK_STATES.IDLE,
      errorMessages: null
    };

    this.getUser();
    this.getExpertises();
    this.getLocations();
  }

  /**
   * ###### Render-Function ######
   */

  render() {
    const user = this.state.user;

    if (user === null) {
      return (
        <LayoutAuthenticated>
          <Spinner />
        </LayoutAuthenticated>
      );
    }

    const errorMessagesFormatted =
      this.state.alertState === ALERT_STATES.ERROR && this.state.errorMessages
        ? this.state.errorMessages.map((item, i) => <li key={i}>{item}</li>)
        : "";
    const disabled =
      this.state.networkState === NETWORK_STATES.REQUESTING
        ? { disabled: "disabled" }
        : {};

    return (
      <LayoutAuthenticated>
        <h1>Your Profile</h1>
        {this.state.alertState === ALERT_STATES.ERROR &&
          errorMessagesFormatted && (
            <div uk-alert="" className="uk-alert-danger">
              <ul>{errorMessagesFormatted}</ul>
            </div>
          )}
        {this.state.alertState === ALERT_STATES.SUCCESS && (
          <div uk-alert="" className="uk-alert-success">
            Your user profile was updated successfully.
          </div>
        )}
        <form className="uk-form-stacked" onSubmit={this.saveUser.bind(this)}>
          <UserMeImage
            user={user}
            onImageUploaded={this.onImageUploaded.bind(this)}
            onImageDeleted={this.onImageDeleted.bind(this)}
          />
          <div className="uk-margin">
            <h3 className="uk-margin-medium-top">Personal information</h3>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="firstname">
                First name
                <span className="uk-text-danger" uk-tooltip="mandatory field">
                  {" "}
                  *{" "}
                </span>
              </label>
              <div className="uk-form-controls">
                <input
                  className={`uk-input uk-form-width-large${
                    this.state.alertState === ALERT_STATES.ERROR &&
                    user.firstName.length === 0
                      ? " uk-form-danger uk-animation-shake"
                      : ""
                  }`}
                  id="firstname"
                  type="text"
                  value={user.firstName}
                  onChange={this.onChangeInput.bind(this, "firstName")}
                  {...disabled}
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="lastname">
                Last name
                <span className="uk-text-danger" uk-tooltip="mandatory field">
                  {" "}
                  *{" "}
                </span>
              </label>
              <div className="uk-form-controls">
                <input
                  className={`uk-input uk-form-width-large${
                    this.state.alertState === ALERT_STATES.ERROR &&
                    user.lastName.length === 0
                      ? " uk-form-danger uk-animation-shake"
                      : ""
                  }`}
                  id="lastname"
                  type="text"
                  value={user.lastName}
                  onChange={this.onChangeInput.bind(this, "lastName")}
                  {...disabled}
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="email">
                Email address
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-width-large"
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="phone">
                Phone
                <span className="uk-text-danger" uk-tooltip="mandatory field">
                  {" "}
                  *{" "}
                </span>
              </label>
              <div className="uk-form-controls">
                <input
                  className={`uk-input uk-form-width-large${
                    this.state.alertState === ALERT_STATES.ERROR &&
                    user.phone.length === 0
                      ? " uk-form-danger uk-animation-shake"
                      : ""
                  }`}
                  id="phone"
                  type="tel"
                  value={user.phone}
                  onChange={this.onChangeInput.bind(this, "phone")}
                  {...disabled}
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="website">
                Website
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-width-large"
                  id="website"
                  type="url"
                  value={user.website}
                  onChange={this.onChangeInput.bind(this, "website")}
                  {...disabled}
                />
              </div>
            </div>
          </div>
          <div className="uk-margin">
            <h3 className="uk-margin-medium-top">Social media</h3>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="twitter">
                Twitter URL
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-width-large"
                  id="twitter"
                  type="text"
                  value={user.twitter}
                  onChange={this.onChangeInput.bind(this, "twitter")}
                  {...disabled}
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="instagram">
                Instagram URL
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-width-large"
                  id="instagram"
                  type="text"
                  value={user.instagram}
                  onChange={this.onChangeInput.bind(this, "instagram")}
                  {...disabled}
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="facebook">
                Facebook URL
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-width-large"
                  id="facebook"
                  type="text"
                  value={user.facebook}
                  onChange={this.onChangeInput.bind(this, "facebook")}
                  {...disabled}
                />
              </div>
            </div>
          </div>
          <div className="uk-margin">
            <h3 className="uk-margin-medium-top">
              Locations
              <span className="uk-text-danger" uk-tooltip="mandatory field">
                {" "}
                *{" "}
              </span>
            </h3>
            {this.renderLocations()}
          </div>
          <div className="uk-margin">
            <h3 className="uk-margin-medium-top">
              Expertises
              <span className="uk-text-danger" uk-tooltip="mandatory field">
                {" "}
                *{" "}
              </span>
            </h3>
            {this.renderExpertises()}
          </div>
          <div className="uk-margin-medium">
            {this.state.networkState !== NETWORK_STATES.REQUESTING && (
              <Fragment>
                <ScrollToTopOnMount />
                <button type="submit" className="uk-button uk-button-primary">
                  Update profile
                </button>
              </Fragment>
            )}
            {this.state.networkState === NETWORK_STATES.REQUESTING && (
              <button
                type="submit"
                className="uk-button uk-button-primary"
                disabled
              >
                Updating profile…
                <span
                  className="uk-margin-small-left"
                  uk-spinner="ratio: 0.5"
                />
              </button>
            )}
          </div>
        </form>
        <footer className="uk-margin-large-top">
          <Link to="/" className="uk-text-primary">
            <span uk-icon="icon: arrow-left" /> Back to dashboard
          </Link>
        </footer>
      </LayoutAuthenticated>
    );
  }

  renderExpertises() {
    const expertises = this.state.expertises;
    const disabled =
      this.state.networkState === NETWORK_STATES.REQUESTING
        ? { disabled: "disabled" }
        : {};

    if (expertises === null || this.state.user === null) {
      return <Spinner />;
    }

    const userExpertisesIds = this.state.user.expertises.map(
      expertise => expertise.id
    );

    return (
      <div className="uk-margin uk-flex uk-flex-column">
        {expertises.map(expertise => {
          const checked = userExpertisesIds.indexOf(expertise.id) > -1;
          return (
            <label key={`expertise_${expertise.id}`}>
              <input
                className="uk-checkbox uk-margin-small-right"
                type="checkbox"
                checked={checked}
                onChange={this.onChangeExpertise.bind(this, expertise)}
                {...disabled}
              />
              {expertise.name}
            </label>
          );
        })}
      </div>
    );
  }

  renderLocations() {
    const locations = this.state.locations;
    const disabled =
      this.state.networkState === NETWORK_STATES.REQUESTING
        ? { disabled: "disabled" }
        : {};

    if (locations === null || this.state.user === null) {
      return <Spinner />;
    }

    const userLocationsIds = this.state.user.locations.map(
      location => location.id
    );

    return (
      <div className="uk-margin uk-flex uk-flex-column">
        {locations.map(location => {
          const checked = userLocationsIds.indexOf(location.id) > -1;
          return (
            <label key={`location_${location.id}`}>
              <input
                className="uk-checkbox uk-margin-small-right"
                type="checkbox"
                checked={checked}
                onChange={this.onChangeLocation.bind(this, location)}
                {...disabled}
              />
              {location.name}
            </label>
          );
        })}
      </div>
    );
  }

  /**
   * ###### Event-Listener ######
   */

  onChangeInput(type, ev) {
    const value = ev.target.value;
    const user = JSON.parse(JSON.stringify(this.state.user));
    user[type] = value;
    this.setState({ user: user });
  }

  onChangeExpertise(expertise, ev) {
    const checked = ev.target.checked;
    const user = JSON.parse(JSON.stringify(this.state.user));
    const userExpertises = user.expertises;

    if (!checked) {
      // Remove from users expertise list
      const expertiseIndex = userExpertises.findIndex(
        expertiseTmp => expertiseTmp.id === expertise.id
      );
      if (expertiseIndex > -1) {
        userExpertises.splice(expertiseIndex, 1);
      }
    } else {
      // Add to expertises list
      userExpertises.push(expertise);
    }
    user.expertises = userExpertises;
    this.setState({ user: user });
  }

  onChangeLocation(location, ev) {
    const checked = ev.target.checked;
    const user = JSON.parse(JSON.stringify(this.state.user));
    const userLocations = user.locations;

    if (!checked) {
      // Remove from users expertise list
      const locationIndex = userLocations.findIndex(
        locationTmp => locationTmp.id === location.id
      );
      if (locationIndex > -1) {
        userLocations.splice(locationIndex, 1);
      }
    } else {
      // Add to expertises list
      userLocations.push(location);
    }
    user.locations = userLocations;
    this.setState({ user: user });
  }

  onImageUploaded(profileImage) {
    // Add image to user in state
    let user = this.state.user;
    if (user != null) {
      user = JSON.parse(JSON.stringify(user));
      user.profileImage = profileImage;
      this.setState({ user: user });
    }
  }

  onImageDeleted() {
    // Remove image from user in state
    let user = this.state.user;
    if (user != null) {
      user = JSON.parse(JSON.stringify(user));
      user.profileImage = null;
      this.setState({ user: user });
    }
  }

  /**
   * ###### GraphQL Queries & Mutations ######
   */

  async getUser() {
    const userId = this.props.match.params.userId;
    const variables = {
      id: userId
    };

    try {
      const response = await client.query({
        query: USER_QUERY,
        variables: variables
      });

      const user = response.data.user;

      // Set user to false if there is no user
      if (user === null) {
        this.setState({ user: false });
        return;
      }

      this.setState({ user: user });
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting users data.",
        status: "danger"
      });
    }
  }

  async getExpertises() {
    try {
      const response = await client.query({
        query: EXPERTISES_QUERY,
        variables: null
      });

      this.setState({ expertises: response.data.expertises });
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting users expertise.",
        status: "danger"
      });
    }
  }

  async getLocations() {
    try {
      const response = await client.query({
        query: LOCATIONS_QUERY,
        variables: null
      });

      this.setState({ locations: response.data.locations });
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting users expertise.",
        status: "danger"
      });
    }
  }

  async saveUser(e) {
    e.preventDefault();

    this.setState({
      networkState: NETWORK_STATES.REQUESTING
    });

    const user = this.state.user;

    const variables = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      website: user.website,
      facebook: user.facebook,
      twitter: user.twitter,
      instagram: user.instagram,
      expertises: user.expertises.map(expertise => expertise.id),
      locations: user.locations.map(location => location.id)
    };

    try {
      await client.mutate({
        mutation: UPDATE_USER_MUTATION,
        variables: variables
      });

      this.setState({
        alertState: ALERT_STATES.SUCCESS,
        networkState: NETWORK_STATES.IDLE,
        errorMessages: null
      });
    } catch (err) {
      if (err.networkError) {
        return;
      }

      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        this.setState({
          errorMessages: errorToStringArray(err)
        });
      } else {
        this.setState({
          errorMessages: [
            "An unexpected error occurred. Maybe try reloading your browser?"
          ]
        });
      }
      this.setState({
        networkState: NETWORK_STATES.IDLE,
        alertState: ALERT_STATES.ERROR
      });
    }
  }
}

export default UserMe;
