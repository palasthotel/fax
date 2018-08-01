import React from "react";
import { render } from "react-dom";
import gql from "graphql-tag";

import { client } from "../app";

export const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage($pitchId: Int!, $text: String!) {
    createMessage(pitchId: $pitchId, text: $text) {
      id
    }
  }
`;

// Using Symbols for state machine
// @see https://stackoverflow.com/questions/44447847/enums-in-javascript-with-es6
const NETWORK_STATES = Object.freeze({
  IDLE: Symbol("idle"),
  REQUESTING: Symbol("requesting")
});

class MessageForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newMessageText: "",
      networkState: NETWORK_STATES.IDLE
    };
  }

  render() {
    return (
      <form
        className="uk-form-stacked uk-card uk-card-small uk-card-primary uk-card-body uk-width-5-6 uk-margin-auto-left"
        onSubmit={event => this.onSubmit(event)}
      >
        <div className="uk-margin-small">
          <div className="uk-form-controls">
            <textarea
              rows="3"
              className="uk-textarea uk-child-width-expand"
              id="description"
              placeholder="Some text..."
              value={this.state.newMessageText}
              onChange={event => this.onChangeText(event)}
            />
          </div>
        </div>
        <div className="uk-margin-small uk-flex uk-flex-right">
          {this.state.networkState === NETWORK_STATES.IDLE && (
            <button type="submit" className="uk-button uk-button-primary">
              Send
            </button>
          )}
          {this.state.networkState === NETWORK_STATES.REQUESTING && (
            <button
              type="submit"
              className="uk-button uk-button-primary"
              disabled
            >
              Sending...
              <div className="uk-margin-small-left" uk-spinner="ratio: 0.5" />
            </button>
          )}
        </div>
      </form>
    );
  }

  /**
   * GraphQL Queries
   */

  async createMessage() {
    try {
      const response = await client.mutate({
        mutation: CREATE_MESSAGE_MUTATION,
        variables: {
          pitchId: this.props.pitchId,
          text: this.state.newMessageText
        }
      });

      if (Array.isArray(response.errors) && response.errors.length > 0) {
        UIkit.notification({
          message:
            "Error reading saving message. Please make sure to use only allowed values.",
          status: "danger"
        });
      } else {
        this.props.onMessageCreated();
        this.setState({
          newMessageText: "",
          networkState: NETWORK_STATES.IDLE
        });
      }
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error while saving message.",
        status: "danger"
      });
    }
  }

  /**
   * Event-Listeners
   */

  onChangeText(event) {
    this.setState({ newMessageText: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({ networkState: NETWORK_STATES.REQUESTING });
    this.createMessage();
  }
}

export default MessageForm;
