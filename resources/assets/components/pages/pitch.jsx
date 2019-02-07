import React, { Fragment } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

import LayoutAuthenticated from "../parts/layout-authenticated";
import Spinner from "../parts/spinner";
import State from "../parts/state";
import StateDropdown from "../parts/state-dropdown";
import { client } from "../app";
import {
  getHumanReadableDateTime,
  getHumanReadableFromNowDateTime,
  userIsEditor,
  getUserProfile
} from "../helper";
import Messages from "../parts/messages";
import ProfileImage from "../parts/profile-image";
import UserDropdown from "../parts/user-dropdown";
import {
  ROLE_EDITOR,
  PITCH_FIELDS_QUERY_PART,
  GUIDELINES_URL
} from "../../constants";

const PITCH_QUERY = gql`
  query pitch($id: Int) {
    pitch(id: $id) {
      id
      title
      description
      updated
      created
      state
      deadline
      user {
        id
        firstName
        lastName
        profileImage {
          id
          url
        }
      }
      assignee {
        id
        firstName
        lastName
        profileImage {
          id
          url
        }
      }
      article {
        id
      }
    }
  }
`;

const UPDATE_PITCH_MUTATION = gql`
  mutation updatePitch($id: Int!, $title: String!, $description: String!, $deadline: String!, $assignee: Int) {
  updatePitch(id: $id, 
    title: $title, 
    assignee: $assignee,
    description: $description,
    deadline: $deadline) {
      ${PITCH_FIELDS_QUERY_PART}
    }
  }
`;

const UPDATE_PITCH_STATE_MUTATION = gql`
  mutation updatePitchState(
    $id: Int!,
    $state: String!
  ) {
    updatePitchState(id: $id, state: $state) {
      ${PITCH_FIELDS_QUERY_PART}
    }
  }
`;

export const CREATE_ARTICLE_MUTATION = gql`
  mutation createArticle($pitchId: Int!) {
    createArticle(
      pitchId: $pitchId
      title: "New Article"
      text: "Please enter your article text here."
    ) {
      id
    }
  }
`;

export const GET_EDITORS_QUERY = gql`
  query editors{
    users(roles: ["${ROLE_EDITOR}"]) {
      id
      firstName
      lastName
      profileImage {
        id
        url
      }
    }
  }
`;

class Pitch extends React.Component {
  constructor(props) {
    super(props);

    this.pitchId = this.props.match.params.pitchId;
    this.getPitchData = this.getPitchData.bind(this);

    this.state = {
      pitch: null,
      user: null,
      editors: null
    };

    this.getPitchData();
    this.getUser();
  }

  render() {
    if (this.state.pitch !== null && this.state.user !== null) {
      return this.renderPitchView();
    } else {
      // We don't have data yet, so we show we're loading.
      return (
        <LayoutAuthenticated>
          <Spinner />
        </LayoutAuthenticated>
      );
    }
  }

  renderPitchView() {
    const pitch = this.state.pitch;
    const user = this.state.user;
    const deadlinePassed = Date.now() > new Date(pitch.deadline);

    return (
      <LayoutAuthenticated>
        <article uk-grid="">
          <div className="uk-width-expand@m">
            <h1>{pitch.title}</h1>
            <p className="uk-width-xxlarge@m fx-pre-line">
              {pitch.description}
            </p>
            <Messages pitchId={pitch.id} user={user} />
          </div>
          <aside className="uk-width-medium@m">
            <dl className="uk-margin-top uk-description-list uk-description-list-divider">
              <dt>State</dt>
              <dd className="uk-margin-small-top uk-flex uk-flex-middle uk-flex-between">
                <State id={pitch.state} />
                <button
                  className="uk-button uk-button-link"
                  type="button"
                  uk-icon="icon: pencil"
                  uk-tooltip="Change state"
                />
                <StateDropdown
                  id={pitch.state}
                  userRoles={user.roles}
                  onClickState={this.changePitchState.bind(this)}
                />
              </dd>
              <dt>Submitted by</dt>
              <dd className="uk-margin-small-top uk-flex uk-flex-middle">
                <ProfileImage user={pitch.user} size={40} />
                <Link
                  className="uk-margin-small-left"
                  to={`/user/${pitch.user.id}`}
                >
                  {pitch.user.firstName} {pitch.user.lastName}
                </Link>
              </dd>
              <dt>Editor</dt>
              <dd className="uk-margin-small-top uk-flex uk-flex-middle uk-flex-between">
                <div className="uk-flex uk-flex-middle">
                  {pitch.assignee && (
                    <Fragment>
                      <ProfileImage user={pitch.assignee} size={40} />
                      <Link
                        className="uk-margin-small-left"
                        to={`/user/${pitch.assignee.id}`}
                      >
                        {pitch.assignee.firstName} {pitch.assignee.lastName}
                      </Link>
                    </Fragment>
                  )}
                  {!pitch.assignee && "Not assigned yet."}
                </div>
                {userIsEditor(user) && (
                  <UserDropdown
                    users={this.state.editors}
                    onClickUser={this.changeAssignee.bind(this)}
                  />
                )}
              </dd>
              <dt>Submitted</dt>
              <dd>
                <span title={getHumanReadableDateTime(pitch.created)}>
                  {getHumanReadableFromNowDateTime(pitch.created)}
                </span>
              </dd>
              <dt>Deadline</dt>
              <dd>
                <span
                  title={getHumanReadableDateTime(pitch.deadline)}
                  className={deadlinePassed ? "uk-text-danger" : ""}
                >
                  {getHumanReadableFromNowDateTime(pitch.deadline)}
                </span>
              </dd>
              <dt>Article</dt>
              <dd>
                <div className="uk-margin-small-top">
                  {!pitch.article && (
                    <button
                      className="uk-button uk-button-default"
                      onClick={this.createArticle.bind(this)}
                    >
                      Create Article
                    </button>
                  )}
                  {pitch.article && (
                    <Link to={`/article/${pitch.article.id}`}>
                      <strong>Current draft</strong>
                    </Link>
                  )}
                </div>
              </dd>
              {GUIDELINES_URL && <dt>Guidelines</dt>}
              {GUIDELINES_URL && (
                <dd>
                  <ul className="uk-margin-small-top uk-list uk-list-bullet">
                    <li>
                      <a href={GUIDELINES_URL} target="_blank" download>
                        Handbook for Freelancers
                      </a>
                    </li>
                  </ul>
                </dd>
              )}
            </dl>
          </aside>
        </article>
        <footer className="uk-margin-large-top">
          <Link to="/" className="uk-text-primary">
            <span uk-icon="icon: arrow-left" /> Back to dashboard
          </Link>
        </footer>
      </LayoutAuthenticated>
    );
  }

  changeAssignee(assignee) {
    const pitch = JSON.parse(JSON.stringify(this.state.pitch));

    if (pitch === null) {
      return;
    }

    pitch.assignee = assignee;
    this.updatePitch(pitch);
  }

  changePitchState(status) {
    const pitch = JSON.parse(JSON.stringify(this.state.pitch));

    if (pitch === null) {
      return;
    }

    pitch.state = status.id;
    this.updatePitchState(pitch);
  }

  /**
   * GraphQL Queries
   */

  async getUser() {
    const userProfile = await getUserProfile();
    if (userProfile) {
      this.setState(userProfile);
      if (userIsEditor(this.state.user)) {
        this.getEditors();
      }
    }
  }

  async getPitchData() {
    try {
      const response = await client.query({
        query: PITCH_QUERY,
        variables: {
          id: this.pitchId
        }
      });

      if (Array.isArray(response.errors) && response.errors.length > 0) {
        UIkit.notification({
          message:
            "Error reading pitch.saving profile. Please make sure to use only allowed values.",
          status: "danger"
        });
      } else {
        this.setState(response.data);
      }
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting pitch.",
        status: "danger"
      });
    }
  }

  async getEditors() {
    try {
      const response = await client.query({
        query: GET_EDITORS_QUERY,
        variables: null
      });

      if (Array.isArray(response.errors) && response.errors.length > 0) {
        UIkit.notification({
          message:
            "Error requesting editors. Please make sure to use only allowed values.",
          status: "danger"
        });
      } else {
        this.setState({ editors: response.data.users });
      }
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting editor.",
        status: "danger"
      });
    }
  }

  async updatePitch(pitch) {
    try {
      const response = await client.mutate({
        mutation: UPDATE_PITCH_MUTATION,
        variables: {
          id: pitch.id,
          title: pitch.title,
          assignee: pitch.assignee ? pitch.assignee.id : null,
          description: pitch.description,
          deadline: pitch.deadline
        }
      });

      if (Array.isArray(response.errors) && response.errors.length > 0) {
        UIkit.notification({
          message:
            "Error reading updating pitch. Please make sure to use only allowed values.",
          status: "danger"
        });
      } else {
        this.setState({ pitch: response.data.updatePitch });
      }
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error while saving pitch.",
        status: "danger"
      });
    }
  }

  async updatePitchState(pitch) {
    try {
      const response = await client.mutate({
        mutation: UPDATE_PITCH_STATE_MUTATION,
        variables: {
          id: pitch.id,
          state: pitch.state
        }
      });

      if (Array.isArray(response.errors) && response.errors.length > 0) {
        UIkit.notification({
          message:
            "Error reading updating pitch state. Please make sure to use only allowed values.",
          status: "danger"
        });
      } else {
        this.setState({
          pitch: response.data.updatePitchState
        });
      }
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error while saving pitch.",
        status: "danger"
      });
    }
  }

  async createArticle() {
    try {
      const response = await client.mutate({
        mutation: CREATE_ARTICLE_MUTATION,
        variables: {
          pitchId: this.state.pitch.id
        }
      });

      if (Array.isArray(response.errors) && response.errors.length > 0) {
        UIkit.notification({
          message:
            "Error reading creating article. Please make sure to use only allowed values.",
          status: "danger"
        });
      } else {
        this.getPitchData();
      }
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error while saving message.",
        status: "danger"
      });
    }
  }
}

export default Pitch;
