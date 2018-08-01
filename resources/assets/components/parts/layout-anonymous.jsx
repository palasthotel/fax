import React, { Fragment } from "react";
import { render } from "react-dom";

import ScrollToTopOnMount from "../scroll-to-top-on-mount";
import Footer from "./footer";

class LayoutAnonymous extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <ScrollToTopOnMount />
        <div
          className="uk-margin-large uk-margin-large-top"
          uk-height-viewport="expand: true"
        >
          <div className="uk-container uk-width-large@s">
            <div className="uk-margin-small">
              <img
                className="uk-logo uk-width-small uk-height-auto"
                src="/images/fax-logo.svg"
                alt="fax logo"
              />
            </div>
            {this.props.children}
          </div>
        </div>
        <Footer />
      </Fragment>
    );
  }
}

export default LayoutAnonymous;
