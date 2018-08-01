import React from "react";
import { render } from "react-dom";

/**
 * @see https://reacttraining.com/react-router/web/guides/scroll-restoration
 */
class ScrollToTopOnMount extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}

export default ScrollToTopOnMount;
