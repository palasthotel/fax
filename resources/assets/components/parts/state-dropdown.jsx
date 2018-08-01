import React from "react";

import { PITCH_STATES, ROLE_EDITOR, ROLE_FREELANCER } from "../../constants";

class StateDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reachableStatus: this.calculateReachableStatus(
        this.props.id,
        this.props.userRoles
      )
    };
  }

  calculateReachableStatus(currentState, userRoles) {
    const reachableStatus = [];

    if (userRoles.includes(ROLE_FREELANCER)) {
      if (currentState === "work in progress") {
        reachableStatus.push(PITCH_STATES["approval"]);
      } else {
        return null;
      }
    }

    // Two ifs here, because we have user's who are both editor and freelancer

    if (userRoles.includes(ROLE_EDITOR)) {
      switch (currentState) {
        case "new":
          reachableStatus.push(
            PITCH_STATES["rejected"],
            PITCH_STATES["work in progress"]
          );
          break;

        case "reject":
          break;

        case "work in progress":
          return null;

        case "approval":
          reachableStatus.push(
            PITCH_STATES["work in progress"],
            PITCH_STATES["published"],
            PITCH_STATES["canceled"]
          );
          break;
      }
    }

    return reachableStatus;
  }

  onClickState(status) {
    if (typeof this.props.onClickState === "function") {
      this.props.onClickState(status);
    }
  }

  render() {
    const reachableStatus = this.state.reachableStatus;

    return (
      <div
        uk-dropdown="mode: click;
                     pos: bottom-left;
                     animation: uk-animation-slide-top-small;
                     duration: 500"
      >
        <ul className="uk-list uk-list-divider">
          {!reachableStatus && <li>No change of status possible.</li>}
          {reachableStatus &&
            reachableStatus.map(status => {
              return (
                <li
                  key={status.id}
                  style={{ cursor: "pointer" }}
                  onClick={this.onClickState.bind(this, status)}
                >
                  {status.text}
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}

export default StateDropdown;
