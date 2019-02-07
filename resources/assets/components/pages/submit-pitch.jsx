import React, { Fragment } from "react";
import { render } from "react-dom";
import { Link, Redirect } from "react-router-dom";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import LayoutAuthenticated from "../parts/layout-authenticated";
import { errorToStringArray } from "../helper";

const CREATE_PITCH_MUTATION = gql`
  mutation CreatePitchMutation(
    $title: String!
    $description: String!
    $deadline: String!
  ) {
    createPitch(title: $title, description: $description, deadline: $deadline) {
      id
    }
  }
`;

class SubmitPitch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      description: "",
      deadline: ""
    };
  }

  render() {
    return (
      <LayoutAuthenticated>
        <h1>Send us your awesome pitch!</h1>
        <Mutation mutation={CREATE_PITCH_MUTATION}>
          {(createPitch, { loading, error, data }) => {
            if (!error && data) {
              // Redirect to pitches list with newly created pitch.
              return <Redirect to="/pitches?created-pitch=true" />;
            }

            const errorMessages = errorToStringArray(error);
            const errorMessagesFormatted = errorMessages.map((item, i) => (
              <li key={i}>{item}</li>
            ));
            const disabled = loading ? { disabled: "disabled" } : {};

            return (
              <Fragment>
                {error &&
                  errorMessagesFormatted && (
                    <div uk-alert="" className="uk-alert-danger">
                      <ul>{errorMessagesFormatted}</ul>
                    </div>
                  )}
                <form
                  className="uk-form-stacked"
                  onSubmit={e => {
                    e.preventDefault();
                    createPitch({
                      variables: {
                        title: this.state.title,
                        description: this.state.description,
                        deadline: this.state.deadline
                      }
                    });
                  }}
                >
                  <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="title">
                      The topic of your article as a headline
                    </label>
                    <div className="uk-form-controls">
                      <input
                        className={`uk-input uk-form-width-large${
                          error && this.state.title.length === 0
                            ? " uk-form-danger uk-animation-shake"
                            : ""
                        }`}
                        type="text"
                        placeholder="e.g. How to pitch articles to editors"
                        autoFocus
                        value={this.state.title}
                        onChange={e => {
                          this.setState({ title: e.target.value });
                        }}
                        {...disabled}
                      />
                    </div>
                  </div>
                  <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="description">
                      Please outline the special idea of your proposal, short
                      and snappy
                    </label>
                    <div className="uk-form-controls">
                      <textarea
                        className={`uk-textarea uk-form-width-large${
                          error && this.state.description.length === 0
                            ? " uk-form-danger uk-animation-shake"
                            : ""
                        }`}
                        rows="8"
                        placeholder="e.g. Pitching freelance stories is tough! But there is a certain strategy that’ll always work. In my article I want to explain how to sum up the significance of my topic and how to briefly give context and background. Experts from both sides (freelancers and editors) will give their advice, too. I can provide portrait photographs of all the protagonists. Got hooked?"
                        value={this.state.description}
                        onChange={e => {
                          this.setState({ description: e.target.value });
                        }}
                        {...disabled}
                      />
                    </div>
                  </div>
                  <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="deadline">
                      When can you deliver?
                    </label>
                    <div className="uk-form-controls">
                      <input
                        className={`uk-input uk-form-width-medium${
                          error && this.state.deadline.length === 0
                            ? " uk-form-danger uk-animation-shake"
                            : ""
                        }`}
                        type="date"
                        id="deadline"
                        value={this.state.deadline}
                        onChange={e => {
                          this.setState({ deadline: e.target.value });
                        }}
                        {...disabled}
                      />
                    </div>
                  </div>
                  <div className="uk-margin">
                    {!loading && (
                      <button
                        type="submit"
                        className="uk-button uk-button-primary"
                      >
                        Submit pitch
                      </button>
                    )}
                    {loading && (
                      <button
                        type="submit"
                        className="uk-button uk-button-primary"
                        disabled
                      >
                        Submitting pitch…{" "}
                        <div
                          className="uk-margin-small-left"
                          uk-spinner="ratio: 0.5"
                        />
                      </button>
                    )}
                  </div>
                </form>
              </Fragment>
            );
          }}
        </Mutation>
        <footer className="uk-margin-large-top">
          <Link to="/" className="uk-text-primary">
            <span uk-icon="icon: arrow-left" /> Back to dashboard
          </Link>
        </footer>
      </LayoutAuthenticated>
    );
  }
}

export default SubmitPitch;
