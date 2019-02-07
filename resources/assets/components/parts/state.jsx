import React, { Fragment } from "react";

import { PITCH_STATES } from "../../constants";

class State extends React.Component {
  render() {
    const status = PITCH_STATES[this.props.id];

    return (
      <div className={`uk-badge uk-text-nowrap ${status.className}`}>
        {status.text}
      </div>
    );
  }
}

export default State;
