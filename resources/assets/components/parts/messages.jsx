import React, { Fragment } from "react";
import { render } from "react-dom";
import gql from "graphql-tag";

import { client } from "../app";
import Spinner from "./spinner";
import Message from "./message";
import MessageForm from "./message-form";
import { MESSAGE_REFRESH_RATE } from "../../constants.js";

const MESSAGES_QUERY = gql`
  query getMessages($pitchId: Int) {
    messages(pitchId: $pitchId) {
      id
      user {
        id
        firstName
      }
      text
      created
    }
  }
`;

const DELETE_MESSAGE_MUTATION = gql`
  mutation deleteMessageMutation($id: Int!) {
    deleteMessage(id: $id)
  }
`;

class Messages extends React.Component {
  constructor(props) {
    super(props);

    this.getMessages = this.getMessages.bind(this);

    this.state = {
      messages: null
    };

    this.getMessages();
  }

  render() {
    const messages = this.state.messages;
    const user = this.props.user;

    if (messages === null || user === null) {
      return <Spinner />;
    }

    return (
      <Fragment>
        <h2>Let’s discuss</h2>
        <div className="uk-width-xxlarge@m uk-flex uk-flex-column" uk-margin="">
          {messages.map(message => {
            return (
              <Message
                key={`message_${message.id}`}
                message={message}
                user={user}
                onDelete={() => this.deleteMessage(message.id)}
              />
            );
          })}
          <MessageForm
            pitchId={this.props.pitchId}
            onMessageCreated={this.onMessageCreated.bind(this)}
          />
        </div>
      </Fragment>
    );
  }

  async deleteMessage(id) {
    // Just in case something goes wrong
    const messagesOld = this.state.messages.slice();
    const messages = this.state.messages.filter(message => message.id !== id);

    this.setState({
      messages: messages
    });

    try {
      const response = await client.mutate({
        mutation: DELETE_MESSAGE_MUTATION,
        variables: {
          id: id
        }
      });

      if (response.errors === undefined) {
        UIkit.notification({
          message: "Message was deleted.",
          status: "success"
        });
      }
    } catch (err) {
      if (err.networkError) {
        return;
      }
      this.setState({
        messages: messagesOld
      });
      UIkit.notification({
        message: "Error deleting message.",
        status: "danger"
      });
    }
  }

  async getMessages() {
    try {
      const response = await client.query({
        query: MESSAGES_QUERY,
        variables: {
          pitchId: this.props.pitchId
        }
      });

      if (Array.isArray(response.errors) && response.errors.length > 0) {
        UIkit.notification({
          message:
            "Error reading messages profile. Please make sure to use only allowed values.",
          status: "danger"
        });
      } else {
        this.setState({ messages: response.data.messages });
      }
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting messages.",
        status: "danger"
      });
    }
    // Do it again in xxx seconds
    setTimeout(this.getMessages, MESSAGE_REFRESH_RATE);
  }

  onMessageCreated() {
    this.getMessages();
  }
}

export default Messages;
