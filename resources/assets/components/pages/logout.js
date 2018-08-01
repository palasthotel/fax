import Cookies from "js-cookie";

import { AUTH_TOKEN_COOKIE_NAME } from "../../constants";

const Logout = props => {
  // Remove auth token cookie.
  Cookies.remove(AUTH_TOKEN_COOKIE_NAME);

  // Set state in app component.
  props.setAuthenticated(false);

  // Redirect to login component.
  const matches = props.location.search.match(/origin=([^&]*)/);
  if (matches) {
    props.history.push(`/login?redirected=true&origin=${matches[1]}`);
  } else {
    props.history.push(`/login?loggedout=true`);
  }

  return null;
};

export default Logout;
