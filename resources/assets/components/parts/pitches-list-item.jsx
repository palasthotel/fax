import React, { Fragment } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";

import {
  getHumanReadableDateTime,
  getHumanReadableFromNowDateTime
} from "../helper";
import State from "./state";
import ProfileImage from "./profile-image";

class PitchesListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const pitch = this.props.pitch;

    if (pitch === undefined) {
      return null;
    }

    return (
      <li key={pitch.id}>
        <div className="uk-flex uk-flex-middle uk-flex-wrap uk-flex-between">
          <div className="uk-margin-small-right uk-flex uk-flex-wrap uk-width-auto@s">
            <Link
              className="uk-width-1-1 uk-width-auto@s uk-margin-small-right"
              to={`/pitch/${pitch.id}`}
            >
              {pitch.title}
            </Link>
            <div className="uk-text-muted">
              <span className="uk-text-small">
                {"opened "}
                <span title={getHumanReadableDateTime(pitch.created)}>
                  {getHumanReadableFromNowDateTime(pitch.created)}
                </span>
                {" by "}
                <Link to={`/user/${pitch.user.id}`} className="uk-link-muted">
                  {pitch.user.firstName} {pitch.user.lastName}
                </Link>
              </span>
            </div>
          </div>
          <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-auto@s">
            <div className="uk-margin-small-right uk-flex uk-flex-middle">
              <State id={pitch.state} />
            </div>
            <div
              className="uk-flex uk-flex-middle"
              title={
                pitch.assignee
                  ? `Editor: ${pitch.assignee.firstName} ${
                      pitch.assignee.lastName
                    }`
                  : "No editor assigned"
              }
            >
              <ProfileImage user={pitch.assignee} />
            </div>
          </div>
        </div>
      </li>
    );
  }

  renderUser(pitch) {
    const user = pitch.user;

    return (
      <Link className="uk-flex-1" to={`/user/${user.id}`}>
        {this.renderUserImage(user)}
      </Link>
    );
  }

  renderAssignee(pitch) {
    const assignee = pitch.assignee;

    if (assignee == null) {
      return (
        <div
          className="uk-margin-medium-right uk-margin-small-left"
          style={{ height: 22 + "px", width: 22 + "px" }}
        >
          {" "}
          -{" "}
        </div>
      );
    }

    return (
      <Link className="uk-flex-1" to={`/user/${assignee.id}`}>
        {this.renderUserImage(assignee)}
      </Link>
    );
  }

  renderUserImage(user) {
    if (user.profileImage == null) {
      return (
        <div
          className="uk-background-primary uk-border-circle uk-margin-medium-right uk-margin-small-left"
          style={{ height: 22 + "px", width: 22 + "px" }}
        />
      );
    }

    return (
      <img
        className="uk-border-circle uk-margin-small-right"
        width="22"
        height="22"
        src={user.profileImage.url}
        title={`${user.firstname} ${user.lastname}`}
      />
    );
  }
}

export default PitchesListItem;
