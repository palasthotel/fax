import React, { Fragment } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

import ScrollToTopOnMount from "../scroll-to-top-on-mount";
import Footer from "./footer";
import { client } from "../app";
import { userIsEditor } from "../helper";
import ProfileImage from "./profile-image";

const USER_QUERY = gql`
  query {
    user {
      id
      roles
      profileImage {
        id
        url
        text
      }
    }
  }
`;

class LayoutAuthenticated extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null
    };

    this.getUser();
  }

  async getUser() {
    try {
      const response = await client.query({
        query: USER_QUERY,
        variables: null
      });

      this.setState({ user: response.data.user });
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting user data.",
        status: "danger"
      });
    }
  }

  render() {
    return (
      <Fragment>
        <ScrollToTopOnMount />
        <div className="uk-offcanvas-content">
          <div className="uk-navbar-container uk-navbar-transparent uk-background-primary uk-light">
            <header className="uk-container">
              <nav uk-navbar="mode: click">
                <div className="uk-navbar-left">
                  <Link to="/" className="uk-navbar-item uk-logo">
                    <img
                      className="uk-width-auto uk-height-1-1"
                      src="/images/fax-logo-white.svg"
                      alt="fax logo"
                    />
                  </Link>
                </div>
                <div className="uk-navbar-right">
                  <ul className="uk-navbar-nav uk-visible@m">
                    <li>
                      <Link to="#" className="uk-flex uk-flex-middle">
                        <ProfileImage
                          size={40}
                          user={this.state.user}
                          link={false}
                          className="fx-white-border uk-box-shadow-small"
                        />
                        <span
                          uk-icon="icon: chevron-down"
                          className="uk-margin-small-left"
                        />
                      </Link>
                      <div className="uk-navbar-dropdown">
                        <ul className="uk-nav uk-navbar-dropdown-nav">
                          <li>
                            <Link to="/me">
                              <span
                                className="uk-margin-small-right"
                                uk-icon="icon: user"
                              />{" "}
                              Profile
                            </Link>
                          </li>
                          <li>
                            <Link to="/settings">
                              <span
                                className="uk-margin-small-right"
                                uk-icon="icon: cog"
                              />{" "}
                              Settings
                            </Link>
                          </li>
                          <li>
                            <Link to="/logout">
                              <span
                                className="uk-margin-small-right"
                                uk-icon="icon: sign-out"
                              />{" "}
                              Logout
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                  {this.state.user &&
                    !userIsEditor(this.state.user) && (
                      <div className="uk-navbar-item uk-visible@m">
                        <Link
                          to="/submit-pitch"
                          className="uk-button uk-button-default uk-box-shadow-small"
                        >
                          <span
                            uk-icon="icon: plus"
                            className="uk-margin-small-right"
                          />{" "}
                          Submit Pitch
                        </Link>
                      </div>
                    )}
                  {this.state.user &&
                    userIsEditor(this.state.user) && (
                      <div className="uk-navbar-item uk-visible@m">
                        <Link
                          to="/create-user"
                          className="uk-button uk-button-default uk-box-shadow-small"
                        >
                          <span
                            uk-icon="icon: plus"
                            className="uk-margin-small-right"
                          />{" "}
                          Create User
                        </Link>
                      </div>
                    )}
                  <button
                    uk-navbar-toggle-icon=""
                    uk-toggle="target: #offcanvas-menu"
                    className="uk-navbar-toggle uk-hidden@m uk-navbar-toggle-icon uk-icon"
                  />
                </div>
              </nav>
            </header>
          </div>
          <div className="uk-margin-large" uk-height-viewport="expand: true">
            <div className="uk-container">{this.props.children}</div>
          </div>
          <Footer />
        </div>
        <div id="offcanvas-menu" uk-offcanvas="mode: slide; overlay: true">
          <div className="uk-offcanvas-bar uk-flex uk-flex-column">
            <button
              className="uk-offcanvas-close uk-close-large uk-margin-small-top"
              type="button"
              uk-close=""
            />
            <ul className="uk-nav uk-nav-primary uk-margin-auto-vertical">
              <li>
                <Link to="/submit-pitch">
                  <span
                    className="uk-margin-small-right"
                    uk-icon="icon: plus"
                  />{" "}
                  Submit Pitch
                </Link>
              </li>
              <li className="uk-nav-divider" />
              <li className="uk-active">
                <Link to="/">
                  <span
                    className="uk-margin-small-right"
                    uk-icon="icon: home"
                  />{" "}
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/user">
                  <span
                    className="uk-margin-small-right"
                    uk-icon="icon: user"
                  />{" "}
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <span className="uk-margin-small-right" uk-icon="icon: cog" />{" "}
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/logout">
                  <span
                    className="uk-margin-small-right"
                    uk-icon="icon: sign-out"
                  />{" "}
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default LayoutAuthenticated;
