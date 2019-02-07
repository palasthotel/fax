import React, { Fragment } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

import authClient from "../apollo-client-auth";
import LayoutAnonymous from "../parts/layout-anonymous";
import { errorToStringArray } from "../helper";

// Using Symbols for state machine
// @see https://stackoverflow.com/questions/44447847/enums-in-javascript-with-es6
const NETWORK_STATES = Object.freeze({
  IDLE: Symbol("idle"),
  REQUESTING: Symbol("requesting")
});

const ALERT_STATES = Object.freeze({
  NONE: Symbol("none"),
  ERROR: Symbol("error")
});

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation(
    $email: String!
    $newPassword: String!
    $token: String!
  ) {
    resetPassword(email: $email, newPassword: $newPassword, token: $token)
  }
`;

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    // Search for token in query string.
    const matches = this.props.location.search.match(
      /token=([^&]*).*?email=([^&]*)/
    );
    this.token = matches ? decodeURIComponent(matches[1]) : "";
    this.email = matches ? decodeURIComponent(matches[2]) : "";

    this.state = {
      newPassword: "",
      passwordVisible: false,
      alertState: ALERT_STATES.NONE,
      networkState: NETWORK_STATES.IDLE,
      errorMessages: null
    };
  }

  render() {
    const errorMessagesFormatted =
      this.state.alertState === ALERT_STATES.ERROR && this.state.errorMessages
        ? this.state.errorMessages.map((item, i) => <li key={i}>{item}</li>)
        : "";
    const disabled =
      this.state.networkState === NETWORK_STATES.REQUESTING
        ? { disabled: "disabled" }
        : {};

    return (
      <LayoutAnonymous>
        {!(this.token && this.email) && (
          <Fragment>
            <div uk-alert="" className="uk-alert-danger">
              Please open the link we’ve sent you via email.
            </div>
          </Fragment>
        )}
        {this.token &&
          this.email && (
            <Fragment>
              <h1 className="uk-margin-remove-top">
                <span className="uk-logo uk-text-primary">Reset password</span>
              </h1>
              <p>
                Resetting password for<br />
                <strong>{this.email}</strong>
              </p>
              <p>
                Please enter your new password with a minimum of 10 characters.
                We recommend to choose a password that is easy to remember. Take
                a look at{" "}
                <a href="https://xkcd.com/936/" target="_blank">
                  https://xkcd.com/936/
                </a>
              </p>
              {this.state.alertState === ALERT_STATES.ERROR &&
                errorMessagesFormatted && (
                  <div uk-alert="" className="uk-alert-danger">
                    <ul>{errorMessagesFormatted}</ul>
                  </div>
                )}
              <form
                className="uk-form-stacked"
                onSubmit={event => this.onResetPassword(event)}
              >
                <div className="uk-margin">
                  <div className="uk-panel">
                    <a
                      uk-tooltip="Show/hide password"
                      href=""
                      className="uk-form-icon uk-form-icon-flip"
                      uk-icon={
                        this.state.passwordVisible
                          ? "icon: unlock"
                          : "icon: lock"
                      }
                      onClick={e => {
                        e.preventDefault();
                        this.setState({
                          passwordVisible: !this.state.passwordVisible
                        });
                      }}
                    />
                    <input
                      className="uk-input uk-form-large"
                      type={this.state.passwordVisible ? "text" : "password"}
                      value={this.state.newPassword}
                      {...disabled}
                      autoFocus
                      onChange={e => {
                        this.setState({ newPassword: e.target.value });
                      }}
                    />
                  </div>
                </div>
                <div className="uk-margin">
                  {this.state.networkState !== NETWORK_STATES.REQUESTING && (
                    <button
                      type="submit"
                      className="uk-button uk-button-primary uk-width-1-1"
                    >
                      Reset password
                    </button>
                  )}
                  {this.state.networkState === NETWORK_STATES.REQUESTING && (
                    <button
                      type="submit"
                      className="uk-button uk-button-primary uk-width-1-1"
                      disabled
                    >
                      Resetting password…{" "}
                      <div
                        className="uk-margin-small-left"
                        uk-spinner="ratio: 0.5"
                      />
                    </button>
                  )}
                </div>
              </form>
            </Fragment>
          )}
        <p className="uk-margin-medium-top">
          <Link to="/login" className="uk-link-muted">
            Log in
          </Link>
        </p>
      </LayoutAnonymous>
    );
  }

  async onResetPassword(event) {
    event.preventDefault();

    this.setState({
      networkState: NETWORK_STATES.REQUESTING
    });

    try {
      await authClient.mutate({
        mutation: RESET_PASSWORD_MUTATION,
        variables: {
          email: this.email,
          newPassword: this.state.newPassword,
          token: this.token
        }
      });

      // Redirect to login.
      this.props.history.push("/login?password-reset=true");
    } catch (err) {
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

export default ResetPassword;
