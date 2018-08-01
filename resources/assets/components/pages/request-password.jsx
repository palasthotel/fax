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
  ERROR: Symbol("error"),
  SUCCESS: Symbol("success")
});

const REQUEST_PASSWORD_QUERY = gql`
  query RequestPasswordQuery($email: String!) {
    requestPassword(email: $email)
  }
`;

class RequestPassword extends React.Component {
  constructor(props) {
    super(props);

    // Search for email query string to prefill the email input.
    const matches = this.props.location.search.match(/email=([^&]*)/);
    this.state = {
      email: matches ? decodeURIComponent(matches[1]) : "",
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
        <h1 className="uk-margin-remove-top">
          <span className="uk-logo uk-text-primary">
            Request password reset
          </span>
        </h1>
        <p>
          Please enter your email address. You will receive an email containing
          a link, which will route you to the password reset form.
        </p>
        {this.state.alertState === ALERT_STATES.ERROR &&
          errorMessagesFormatted && (
            <div uk-alert="" className="uk-alert-danger">
              <ul>{errorMessagesFormatted}</ul>
            </div>
          )}
        {this.state.alertState === ALERT_STATES.SUCCESS && (
          <div uk-alert="" className="uk-alert-success">
            An email was sent, please check your inbox.
          </div>
        )}
        <form
          className="uk-form-stacked"
          onSubmit={event => this.onRequestPassword(event)}
        >
          <div className="uk-margin">
            <div className="uk-panel">
              <span
                className="uk-form-icon uk-form-icon-flip"
                uk-icon="icon: user"
              />
              <input
                className={`uk-input uk-form-large${
                  this.state.alertState === ALERT_STATES.ERROR &&
                  (errorMessagesFormatted || this.state.email.length === 0)
                    ? " uk-form-danger uk-animation-shake"
                    : ""
                }`}
                type="email"
                placeholder="Email Address"
                value={this.state.email}
                {...disabled}
                autoFocus
                onChange={e => {
                  this.setState({ email: e.target.value });
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
                Request password reset
              </button>
            )}
            {this.state.networkState === NETWORK_STATES.REQUESTING && (
              <button
                type="submit"
                className="uk-button uk-button-primary uk-width-1-1"
                disabled
              >
                Requesting password reset…{" "}
                <div className="uk-margin-small-left" uk-spinner="ratio: 0.5" />
              </button>
            )}
          </div>
        </form>
        <p className="uk-margin-medium-top">
          <Link to="/login" className="uk-link-muted">
            Log in
          </Link>
        </p>
      </LayoutAnonymous>
    );
  }

  async onRequestPassword(event) {
    event.preventDefault();

    this.setState({
      networkState: NETWORK_STATES.REQUESTING
    });

    try {
      await authClient.query({
        query: REQUEST_PASSWORD_QUERY,
        variables: {
          email: this.state.email
        }
      });

      this.setState({
        alertState: ALERT_STATES.SUCCESS,
        networkState: NETWORK_STATES.IDLE,
        errorMessages: null
      });
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

export default RequestPassword;
