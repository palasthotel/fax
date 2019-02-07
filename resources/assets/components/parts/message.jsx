import React from "react";
import { render } from "react-dom";

import {
  getHumanReadableDateTime,
  getHumanReadableFromNowDateTime
} from "../helper";

class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const message = this.props.message;
    const user = this.props.user;

    if (message === null || user === null) {
      return null;
    }

    const messageFromMe = message.user.id === user.id;

    // Different styling if message is from me
    let classNames =
      "uk-card uk-card-small uk-card-default uk-card-body uk-width-5-6";

    if (messageFromMe) {
      // User == me
      classNames =
        "uk-card uk-card-small uk-card-primary uk-card-body uk-width-5-6 uk-margin-auto-left";
    }

    return (
      <article className={classNames}>
        {!messageFromMe && (
          <header className="uk-margin-small">
            <strong>{message.user.firstName}</strong>
          </header>
        )}
        <p className="uk-margin-small fx-white-space-pre-line">{message.text}</p>
        <footer>
          <p className="uk-margin-remove uk-text-meta">
            <span title={getHumanReadableDateTime(message.created)}>
              {getHumanReadableFromNowDateTime(message.created)}
            </span>
          </p>
        </footer>
      </article>
    );
  }
}

export default Message;
