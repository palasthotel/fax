import React, { Fragment } from "react";
import { render } from "react-dom";
import ProfileImage from "./profile-image";

class UserDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const users = this.props.users;

    if (!Array.isArray(users) || users.length < 1) {
      // todo fallback
      return null;
    }

    return (
      <Fragment>
        <button
          className="uk-button uk-button-link"
          type="button"
          uk-icon="icon: pencil"
          uk-tooltip="Change editor"
        />
        <div
          uk-dropdown="mode: click;
                          pos: bottom-left;
                          animation: uk-animation-slide-top-small;
                          duration: 500"
        >
          <ul className="uk-list uk-list-divider">
            <li
              key={`user_0`}
              style={{ cursor: "pointer" }}
              onClick={this.onClickUser.bind(this, null)}
            >
              Remove assignee
            </li>
            {users.map(user => {
              return (
                <li
                  key={`user_${user.id}`}
                  style={{ cursor: "pointer" }}
                  onClick={this.onClickUser.bind(this, user)}
                >
                  <div className="uk-flex uk-flex-middle">
                    <ProfileImage user={user} />
                    <span className="uk-margin-small-left">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Fragment>
    );
  }

  onClickUser(user) {
    if (typeof this.props.onClickUser === "function") {
      this.props.onClickUser(user);
    }
  }
}

UserDropdown.defaultProps = {
  users: []
};

export default UserDropdown;
