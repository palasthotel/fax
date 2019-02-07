import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const matches = props.location.search.match(/origin=([^&]*)/);
      const originEncoded = matches
        ? matches[1]
        : encodeURIComponent(props.location.pathname);

      return isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to={`/logout?origin=${originEncoded}`} />
      );
    }}
  />
);

export default PrivateRoute;
