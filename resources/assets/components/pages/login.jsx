import React, { Fragment } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import Cookies from "js-cookie";

import authClient from "../apollo-client-auth";
import LayoutAnonymous from "../parts/layout-anonymous";
import { AUTH_TOKEN_COOKIE_NAME } from "../../constants";

// Using Symbols for state machine
// @see https://stackoverflow.com/questions/44447847/enums-in-javascript-with-es6
const NETWORK_STATES = Object.freeze({
  IDLE: Symbol("idle"),
  REQUESTING: Symbol("requesting")
});

const ALERT_STATES = Object.freeze({
  NONE: Symbol("none"),
  ERROR: Symbol("error"),
  ERROR_TYPING: Symbol("errorTyping"),
  LOGGED_OUT: Symbol("loggedOut"),
  REDIRECTED: Symbol("redirected"),
  PASSWORD_RESET: Symbol("password-reset")
});

const LOGIN_QUERY = gql`
  query LoginQuery($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      keepLoggedIn: false,
      networkState: NETWORK_STATES.IDLE,
      errorMessages: null,
      passwordVisible: false
    };

    if (this.props.location.search.indexOf("loggedout=true") !== -1) {
      this.state.alertState = ALERT_STATES.LOGGED_OUT;
    } else if (this.props.location.search.indexOf("redirected=true") !== -1) {
      this.state.alertState = ALERT_STATES.REDIRECTED;
    } else if (
      this.props.location.search.indexOf("password-reset=true") !== -1
    ) {
      this.state.alertState = ALERT_STATES.PASSWORD_RESET;
    } else {
      this.state.alertState = ALERT_STATES.NONE;
    }

    // `origin` query parameter set?
    const matches = this.props.location.search.match(/origin=([^&]*)/);
    this.origin = matches ? decodeURIComponent(matches[1]) : "/";
  }

  render() {
    const disabled =
      this.state.networkState === NETWORK_STATES.REQUESTING
        ? { disabled: "disabled" }
        : {};
    const errorClasses =
      this.state.alertState === ALERT_STATES.ERROR
        ? "uk-form-danger uk-animation-shake"
        : "";
    return (
      <LayoutAnonymous>
        {this.state.alertState === ALERT_STATES.LOGGED_OUT && (
          <div uk-alert="" className="uk-alert-success">
            Everything’s cleaned up, you are now logged out. Start over again?
          </div>
        )}
        {this.state.alertState === ALERT_STATES.REDIRECTED && (
          <div uk-alert="" className="uk-alert-warning">
            Not so fast, please log in first.
          </div>
        )}
        {this.state.alertState === ALERT_STATES.PASSWORD_RESET && (
          <div uk-alert="" className="uk-alert-success">
            Your password has been successfully reset. Now let’s get back to
            work!
          </div>
        )}
        {this.state.alertState === ALERT_STATES.NONE && (
          <p>Let’s get back to work!</p>
        )}
        {(this.state.alertState === ALERT_STATES.ERROR ||
          this.state.alertState === ALERT_STATES.ERROR_TYPING) &&
          this.state.errorMessages !== null && (
            <div uk-alert="" className="uk-alert-danger">
              {this.state.errorMessages.map((message, i) => (
                <p key={i}>{message}</p>
              ))}
            </div>
          )}
        <form
          className="uk-form-stacked"
          onSubmit={event => this.onLoginSubmit(event)}
        >
          <div className="uk-margin">
            <div className="uk-panel">
              <span
                className="uk-form-icon uk-form-icon-flip"
                uk-icon="icon: user"
              />
              <input
                className={`uk-input uk-form-large ${errorClasses}`}
                type="email"
                placeholder="Email Address"
                autoFocus
                value={this.state.email}
                onChange={e => {
                  if (this.state.alertState === ALERT_STATES.ERROR) {
                    this.setState({ alertState: ALERT_STATES.ERROR_TYPING });
                  }
                  this.setState({ email: e.target.value });
                }}
                {...disabled}
              />
            </div>
          </div>
          <div className="uk-margin">
            <div className="uk-panel">
              <a
                uk-tooltip="Show/hide password"
                href=""
                className="uk-form-icon uk-form-icon-flip"
                uk-icon={
                  this.state.passwordVisible ? "icon: unlock" : "icon: lock"
                }
                onClick={e => {
                  e.preventDefault();
                  this.setState({
                    passwordVisible: !this.state.passwordVisible
                  });
                }}
              />
              <input
                className={`uk-input uk-form-large ${errorClasses}`}
                type={this.state.passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={this.state.password}
                onChange={e => {
                  if (this.state.alertState === ALERT_STATES.ERROR) {
                    this.setState({ alertState: ALERT_STATES.ERROR_TYPING });
                  }
                  this.setState({ password: e.target.value });
                }}
                {...disabled}
              />
            </div>
          </div>
          <div className="uk-margin">
            <label>
              <input
                className="uk-checkbox uk-margin-small-right"
                type="checkbox"
                value={this.state.keepLoggedIn}
                onChange={e =>
                  this.setState({ keepLoggedIn: e.target.checked })
                }
                {...disabled}
              />
              Keep me logged in
            </label>
          </div>
          <div className="uk-margin">
            {this.state.networkState === NETWORK_STATES.IDLE && (
              <button
                type="submit"
                className="uk-button uk-button-primary uk-width-1-1"
              >
                Log In
              </button>
            )}
            {this.state.networkState === NETWORK_STATES.REQUESTING && (
              <button
                type="submit"
                className="uk-button uk-button-primary uk-width-1-1"
                disabled
              >
                Logging In…{" "}
                <div className="uk-margin-small-left" uk-spinner="ratio: 0.5" />
              </button>
            )}
          </div>
        </form>
        <p className="uk-margin-medium-top">
          <Link to="/request-password" className="uk-link-muted">
            Lost your password?
          </Link>
        </p>
      </LayoutAnonymous>
    );
  }

  async onLoginSubmit(event) {
    event.preventDefault();

    this.setState({
      networkState: NETWORK_STATES.REQUESTING
    });

    try {
      const response = await authClient.query({
        query: LOGIN_QUERY,
        variables: {
          email: this.state.email,
          password: this.state.password
        }
      });

      // Store auth token in cookie.
      Cookies.set(
        AUTH_TOKEN_COOKIE_NAME,
        response.data.login,
        this.state.keepLoggedIn ? { expires: 356 } : {}
      );

      // Set state in app component.
      this.props.setAuthenticated(true);

      // Redirect to dashboard.
      this.props.history.push(this.origin);
    } catch (err) {
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        this.setState({
          errorMessages: err.graphQLErrors.map(error => error.message)
        });
      } else {
        this.setState({
          errorMessages: [
            "An unexpected error occurred. Maybe try reloading your browser?"
          ]
        });
      }
      this.setState({
        alertState: ALERT_STATES.ERROR,
        networkState: NETWORK_STATES.IDLE
      });
    }
  }
}

export default Login;
