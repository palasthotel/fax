import React from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";

import LayoutAuthenticated from "../parts/layout-authenticated";
import { client } from "../app";
import gql from "graphql-tag";
import Spinner from "../parts/spinner";
import ProfileImage from "../parts/profile-image";

const USER_QUERY = gql`
  query getUserQuery($id: Int!) {
    user(id: $id) {
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
        name
      }
      locations {
        id
        name
      }
      profileImage {
        id
        url
      }
    }
  }
`;

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null
    };

    this.getUser();
  }

  render() {
    const user = this.state.user;

    if (user === null) {
      return (
        <LayoutAuthenticated>
          <Spinner />
        </LayoutAuthenticated>
      );
    }

    if (user === false) {
      return (
        <LayoutAuthenticated>
          <p>Sorry, no user found.</p>
        </LayoutAuthenticated>
      );
    }

    return (
      <LayoutAuthenticated>
        <h1>
          {user.firstName} {user.lastName}
        </h1>
        <ProfileImage user={user} size={200} link={false} />
        {this.renderEmail()}
        {this.renderPhone()}
        {this.renderSocial()}
        <h2 className="uk-margin-medium-top">Expertise</h2>
        <ul>
          {user.expertises.length === 0 && <li>No expertises</li>}
          {user.expertises.length > 0 &&
            user.expertises.map((expertise, index) => {
              return <li key={`expertise_${index}`}>{expertise.name}</li>;
            })}
        </ul>
        <h2 className="uk-margin-medium-top">Locations</h2>
        <ul>
          {user.locations.length === 0 && <li>No locations</li>}
          {user.locations.length > 0 &&
            user.locations.map((location, index) => {
              return <li key={`location_${index}`}>{location.name}</li>;
            })}
        </ul>
        <footer className="uk-margin-large-top">
          <Link to="/" className="uk-text-primary">
            <span uk-icon="icon: arrow-left" /> Back to dashboard
          </Link>
        </footer>
      </LayoutAuthenticated>
    );
  }

  renderEmail() {
    const user = this.state.user;
    if (user.email !== undefined) {
      return (
        <p>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
      );
    }

    return null;
  }

  renderPhone() {
    const user = this.state.user;
    if (user.phone !== undefined) {
      return (
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
      );
    }

    return null;
  }

  renderSocial() {
    const user = this.state.user;

    if (
      user.website === undefined &&
      user.facebook === undefined &&
      user.twitter === undefined &&
      user.instagram === undefined
    ) {
      return null;
    }

    const socials = [
      { key: "Website", value: user.website },
      { key: "Facebook", value: user.facebook },
      { key: "Twitter", value: user.twitter },
      { key: "Instagram", value: user.instagram }
    ];

    return (
      <p>
        {socials.map((social, index) => {
          if (!social.value) {
            return;
          }
          return (
            <span key={`social_${index}`}>
              {index > 0 ? ", " : ""}
              <a href={social.value}>{social.key}</a>
            </span>
          );
        })}
      </p>
    );
  }

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
}

export default User;
