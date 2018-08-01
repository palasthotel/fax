import React from "react";
import { render } from "react-dom";

import LayoutAuthenticated from "../parts/layout-authenticated";

class TempPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LayoutAuthenticated>
        <p>I am a temporary page!</p>
      </LayoutAuthenticated>
    );
  }
}

export default TempPage;
