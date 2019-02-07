import React from "react";
import { Link } from "react-router-dom";

import LayoutAnonymous from "../parts/layout-anonymous";

const AccessDenied = () => (
  <LayoutAnonymous>
    <h1>403 Access Denied</h1>
    <p>
      I’m so sorry! You’re not allowed to view this special page. :( Let’s go
      back to <Link to="/">start</Link>.
    </p>
  </LayoutAnonymous>
);

export default AccessDenied;
