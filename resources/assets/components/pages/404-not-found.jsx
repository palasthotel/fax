import React from "react";
import { Link } from "react-router-dom";

import LayoutAnonymous from "../parts/layout-anonymous";

const NotFound = () => (
  <LayoutAnonymous>
    <h1>404 Not Found</h1>
    <p>
      You’ve taken the wrong route! Let’s go back to <Link to="/">start</Link>.
    </p>
  </LayoutAnonymous>
);

export default NotFound;
