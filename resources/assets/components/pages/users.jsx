import React from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";

import LayoutAuthenticated from "../parts/layout-authenticated";
import UsersList from "../parts/users-list";
import { client } from "../app";
import Spinner from "../parts/spinner";
import { ME_QUERY } from "../../constants";
import { userIsEditor } from "../helper";

class Users extends React.Component {
  constructor(props) {
    super(props);

    // `created` query parameter set (coming from submit user)?
    this.usersCreated =
      this.props.location.search.indexOf("created-user=true") !== -1;

    this.state = {
      me: null
    };

    this.getMe();
  }

  render() {
    if (this.state.me === null) {
      return (
        <LayoutAuthenticated>
          <Spinner />
        </LayoutAuthenticated>
      );
    }

    if (!userIsEditor(this.state.me)) {
      return (
        <LayoutAuthenticated>
          <p>Sorry, you are not allowed to see this page.</p>
        </LayoutAuthenticated>
      );
    }

    return (
      <LayoutAuthenticated>
        <h1>Users</h1>
        {this.usersCreated && (
          <div uk-alert="" className="uk-alert-success">
            The freelancer account was created successfully. An email was sent
            to the given email address.
          </div>
        )}
        <UsersList />
        <footer className="uk-margin-large-top">
          <Link to="/" className="uk-text-primary">
            <span uk-icon="icon: arrow-left" /> Back to dashboard
          </Link>
        </footer>
      </LayoutAuthenticated>
    );
  }

  async getMe() {
    try {
      const response = await client.query({
        query: ME_QUERY,
        variables: null
      });

      this.setState({ me: response.data.user });
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
}

export default Users;
