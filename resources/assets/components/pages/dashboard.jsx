import React from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

import LayoutAuthenticated from "../parts/layout-authenticated";
import PitchesList from "../parts/pitches-list";
import UsersList from "../parts/users-list";
import { client } from "../app";
import { userIsEditor } from "../helper";
import Spinner from "../parts/spinner";

export const ME_QUERY = gql`
  query {
    user {
      firstName
      roles
    }
    pitchesCount
  }
`;

class Dashboard extends React.Component {
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

    return (
      <LayoutAuthenticated>
        <h1>Dashboard</h1>
        {this.renderSalutation(user)}
        <section className="uk-margin-large-top">
          <h2>
            <Link to="/pitches" className="uk-link-heading">
              Your newest pitches
            </Link>
          </h2>
          <PitchesList
            numberItems={6}
            showPagination={false}
            showFilter={false}
          />
          <footer>
            <Link to="/pitches" className="uk-text-primary">
              <span uk-icon="icon: arrow-right" /> Show all pitches
            </Link>
          </footer>
        </section>
        {this.renderUserList()}
      </LayoutAuthenticated>
    );
  }

  renderSalutation(user) {
    if (userIsEditor(user)) {
      return <p>Hi {user.firstName}!</p>;
    } else {
      return (
        <p>
          Hi {user.firstName}, you have submitted{" "}
          {user.pitchesCount !== 1
            ? `${user.pitchesCount} pitches `
            : `${user.pitchesCount} pitch `}
          so far and we’re excited to read more! {"<3"}
        </p>
      );
    }
  }

  renderUserList() {
    if (userIsEditor(this.state.user)) {
      return (
        <section className="uk-margin-large-top">
          <h2>
            <Link to="/users" className="uk-link-heading">
              Users
            </Link>
          </h2>
          <UsersList
            numberItems={6}
            showPagination={false}
            showFilter={false}
          />
          <footer>
            <Link to="/users" className="uk-text-primary">
              <span uk-icon="icon: arrow-right" /> Show all users
            </Link>
          </footer>
        </section>
      );
    }

    return null;
  }

  async getUser() {
    try {
      const response = await client.query({
        query: ME_QUERY,
        variables: null
      });

      this.setUserToState(response.data);
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting user data.",
        status: "danger"
      });
    }
  }

  setUserToState(data) {
    const user = {
      firstName: data.user.firstName,
      roles: data.user.roles,
      pitchesCount: data.pitchesCount
    };
    this.setState({ user: user });
  }
}

export default Dashboard;
