import React, { Fragment } from "react";
import { render } from "react-dom";
import { Link, Redirect } from "react-router-dom";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import LayoutAuthenticated from "../parts/layout-authenticated";
import { errorToStringArray } from "../helper";

const CREATE_USER = gql`
  mutation CreateUserMutation(
    $email: String!
    $firstName: String!
    $lastName: String!
  ) {
    createUser(email: $email, firstName: $firstName, lastName: $lastName) {
      id
    }
  }
`;

class CreateUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      firstName: "",
      lastName: ""
    };
  }

  render() {
    return (
      <LayoutAuthenticated>
        <h1>Create a new freelancer account</h1>
        <Mutation mutation={CREATE_USER}>
          {(createUser, { loading, error, data }) => {
            if (!error && data) {
              // Redirect to users list with newly created user.
              return <Redirect to="/users?created-user=true" />;
            }

            const errorMessages = errorToStringArray(error);
            const errorMessagesFormatted = errorMessages.map((item, i) => (
              <li key={i}>{item}</li>
            ));
            const disabled = loading ? { disabled: "disabled" } : {};

            return (
              <Fragment>
                {error &&
                  errorMessagesFormatted && (
                    <div uk-alert="" className="uk-alert-danger">
                      <ul>{errorMessagesFormatted}</ul>
                    </div>
                  )}
                <form
                  className="uk-form-stacked"
                  onSubmit={e => {
                    e.preventDefault();
                    createUser({
                      variables: {
                        email: this.state.email,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName
                      }
                    });
                  }}
                >
                  <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="title">
                      Email address
                    </label>
                    <div className="uk-form-controls">
                      <input
                        className={`uk-input uk-form-width-large${
                          error && this.state.email.length === 0
                            ? " uk-form-danger uk-animation-shake"
                            : ""
                        }`}
                        type="email"
                        placeholder="e.g. myaddress@example.com"
                        autoFocus
                        value={this.state.email}
                        onChange={e => {
                          this.setState({ email: e.target.value });
                        }}
                        {...disabled}
                      />
                    </div>
                  </div>
                  <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="title">
                      First name
                    </label>
                    <div className="uk-form-controls">
                      <input
                        className={`uk-input uk-form-width-large${
                          error && this.state.firstName.length === 0
                            ? " uk-form-danger uk-animation-shake"
                            : ""
                        }`}
                        type="text"
                        value={this.state.firstName}
                        onChange={e => {
                          this.setState({ firstName: e.target.value });
                        }}
                        {...disabled}
                      />
                    </div>
                  </div>
                  <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="title">
                      Last name
                    </label>
                    <div className="uk-form-controls">
                      <input
                        className={`uk-input uk-form-width-large${
                          error && this.state.lastName.length === 0
                            ? " uk-form-danger uk-animation-shake"
                            : ""
                        }`}
                        type="text"
                        value={this.state.lastName}
                        onChange={e => {
                          this.setState({ lastName: e.target.value });
                        }}
                        {...disabled}
                      />
                    </div>
                  </div>
                  <p>
                    An email will be sent to the given email address containing
                    a link to a password generation page.
                  </p>
                  <div className="uk-margin">
                    {!loading && (
                      <button
                        type="submit"
                        className="uk-button uk-button-primary"
                      >
                        Create freelancer account
                      </button>
                    )}
                    {loading && (
                      <button
                        type="submit"
                        className="uk-button uk-button-primary"
                        disabled
                      >
                        Creating freelancer account…{" "}
                        <div
                          className="uk-margin-small-left"
                          uk-spinner="ratio: 0.5"
                        />
                      </button>
                    )}
                  </div>
                </form>
              </Fragment>
            );
          }}
        </Mutation>
        <footer className="uk-margin-large-top">
          <Link to="/" className="uk-text-primary">
            <span uk-icon="icon: arrow-left" /> Back to dashboard
          </Link>
        </footer>
      </LayoutAuthenticated>
    );
  }
}

export default CreateUser;
