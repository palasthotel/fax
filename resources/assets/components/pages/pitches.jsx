import React from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";

import LayoutAuthenticated from "../parts/layout-authenticated";
import PitchesList from "../parts/pitches-list";

class Pitches extends React.Component {
  constructor(props) {
    super(props);

    // `created` query parameter set (coming from submit pitch)?
    this.pitchCreated =
      this.props.location.search.indexOf("created-pitch=true") !== -1;
  }

  render() {
    return (
      <LayoutAuthenticated>
        <h1>Pitches</h1>
        {this.pitchCreated && (
          <div uk-alert="" className="uk-alert-success">
            Your pitch was successfully created! An editor will get in touch
            with you soon.
          </div>
        )}
        <PitchesList />
        <footer className="uk-margin-large-top">
          <Link to="/" className="uk-text-primary">
            <span uk-icon="icon: arrow-left" /> Back to dashboard
          </Link>
        </footer>
      </LayoutAuthenticated>
    );
  }
}

export default Pitches;
