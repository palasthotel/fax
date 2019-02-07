import React, { Fragment } from "react";
import { render } from "react-dom";
import gql from "graphql-tag";

import Pagination from "./pagination";
import Spinner from "./spinner";
import PitchesListItem from "./pitches-list-item";
import { client } from "../app";
import {
  ROLE_EDITOR,
  ROLE_FREELANCER,
  ME_QUERY,
  PITCH_STATES
} from "../../constants";
import { userIsEditor } from "../helper";

const PITCHES_QUERY = gql`
  query getPitchesQuery(
    $userId: Int
    $assigneeId: Int
    $state: String
    $limit: Int
    $offset: Int
    $order: String
  ) {
    pitches(
      userId: $userId
      assigneeId: $assigneeId
      state: $state
      limit: $limit
      offset: $offset
      order: $order
    ) {
      id
      title
      description
      created
      state
      user {
        id
        firstName
        lastName
        profileImage {
          id
          url
          text
        }
      }
      assignee {
        id
        firstName
        lastName
        profileImage {
          id
          url
          text
        }
      }
    }
    pitchesCount
  }
`;

const ASSIGNEES_QUERY = gql`
  query getAssigneesQuery($limit: Int, $roles: [String]) {
    users(limit: $limit, roles: $roles) {
      id
      firstName
      lastName
    }
  }
`;

const USERS_QUERY = gql`
  query getUsersQuery($limit: Int, $roles: [String]) {
    users(limit: $limit, roles: $roles) {
      id
      firstName
      lastName
    }
  }
`;

const ORDER_STATES = [
  { id: "pitches.created.asc", text: "Sort by created date asc." },
  { id: "pitches.created.desc", text: "Sort by created date desc." }
];

class PitchesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pitches: null,
      pitchesCount: null,
      stateFilter: "none",
      assigneeFilter: 0,
      assignees: null,
      userFilter: 0,
      users: null,
      page: 1,
      order: ORDER_STATES[0].id,
      me: null
    };

    this.getMe();
    this.getPitches(
      this.state.userFilter,
      this.state.assigneeFilter,
      this.state.stateFilter,
      this.props.numberItems,
      this.state.page,
      this.state.order
    );
    this.getAssignees();
    this.getUsers();
  }

  async getPitches(
    userFilter,
    assigneeFilter,
    stateFilter,
    numberItems,
    page,
    order
  ) {
    const variables = {};
    if (stateFilter !== "none") {
      variables.state = stateFilter;
    }
    if (assigneeFilter) {
      variables.assigneeId = assigneeFilter;
    }
    if (userFilter) {
      variables.userId = userFilter;
    }
    if (numberItems && page) {
      variables.limit = numberItems;
      variables.offset = (page - 1) * numberItems;
    }
    if (order) {
      variables.order = order;
    }

    try {
      const response = await client.query({
        query: PITCHES_QUERY,
        variables: variables
      });

      this.setState({
        pitches: response.data.pitches,
        pitchesCount: response.data.pitchesCount
      });
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting pitches.",
        status: "danger"
      });
    }
  }

  async getAssignees() {
    try {
      const response = await client.query({
        query: ASSIGNEES_QUERY,
        variables: { roles: [ROLE_EDITOR], limit: 1000 }
      });

      this.setState({ assignees: response.data.users });
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting assignees.",
        status: "danger"
      });
    }
  }

  async getUsers() {
    try {
      const response = await client.query({
        query: USERS_QUERY,
        variables: { roles: [ROLE_FREELANCER], limit: 1000 }
      });

      this.setState({ users: response.data.users });
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting users.",
        status: "danger"
      });
    }
  }

  render() {
    if (this.state.me === null) {
      return <Spinner />;
    }

    const renderFilterState = (
      <div className="uk-margin-small-top uk-margin-small-right uk-form-controls">
        <select
          className="uk-select"
          id="form-stacked-select"
          value={this.state.stateFilter}
          onChange={event => this.onChangeStateFilter(event)}
        >
          <option key={`filter_option_state_none`} value="none">
            All states
          </option>
          {Object.entries(PITCH_STATES).map(state => (
            <option key={state[1].id} value={state[1].id}>
              {state[1].text}
            </option>
          ))}
        </select>
      </div>
    );

    const filterOrder = (
      <div className="uk-margin-small-top uk-form-controls">
        <select
          className="uk-select"
          id="form-stacked-select"
          onChange={ev => this.changeOrder(ev)}
        >
          {ORDER_STATES.map(orderState => (
            <option key={orderState.id} value={orderState.id}>
              {orderState.text}
            </option>
          ))}
        </select>
      </div>
    );

    const filter = (
      <form className="uk-flex uk-flex-wrap">
        {renderFilterState}
        {this.renderFilterAssignee()}
        {this.renderFilterUser()}
        {filterOrder}
      </form>
    );

    return (
      <Fragment>
        {this.props.showFilter === true ? filter : ""}
        {this.renderPitches()}
      </Fragment>
    );
  }

  renderFilterAssignee() {
    const assignees = this.state.assignees;
    if (assignees == null) {
      return <Spinner />;
    }

    return (
      <div className="uk-margin-small-top uk-margin-small-right uk-form-controls">
        <select
          className="uk-select"
          id="form-stacked-select"
          value={this.state.assigneeFilter}
          onChange={event => this.onChangeAssigneeFilter(event)}
        >
          <option value={0}>All editors</option>
          {assignees.map(assignee => (
            <option key={assignee.id} value={assignee.id}>
              {assignee.firstName} {assignee.lastName}
            </option>
          ))}
        </select>
      </div>
    );
  }

  renderFilterUser() {
    if (!userIsEditor(this.state.me)) {
      return null;
    }

    const users = this.state.users;
    if (users == null) {
      return <Spinner />;
    }

    return (
      <div className="uk-margin-small-top uk-margin-small-right uk-form-controls">
        <select
          className="uk-select"
          id="form-stacked-select"
          value={this.state.userFilter}
          onChange={event => this.onChangeUserFilter(event)}
        >
          <option value={0}>All Users</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>
      </div>
    );
  }

  renderPitches() {
    const pitches = this.state.pitches;
    const showPagination = this.props.showPagination;
    const count = this.state.pitchesCount;
    const page = this.state.page;
    const perPage = this.props.numberItems;

    if (pitches === null) {
      return <Spinner />;
    }

    return (
      <div>
        <ul className="uk-list uk-list-striped uk-list-large uk-margin-medium-top">
          {pitches.length < 1 ? <li>Sorry, no pitches found.</li> : null}
          {pitches.map(pitch => {
            return (
              <PitchesListItem
                key={`pitch_list_item_${pitch.id}`}
                pitch={pitch}
              />
            );
          })}
        </ul>
        {showPagination === true ? (
          <Pagination
            count={count}
            page={page}
            perPage={perPage}
            changePage={newPage => this.onClickPage(newPage)}
          />
        ) : (
          ""
        )}
      </div>
    );
  }

  onClickPage(newPage) {
    this.setState({ page: newPage, pitches: null });
    this.getPitches(
      this.state.userFilter,
      this.state.assigneeFilter,
      this.state.stateFilter,
      this.props.numberItems,
      newPage,
      this.state.order
    );
  }

  onChangeStateFilter(event) {
    this.setState({ stateFilter: event.target.value });
    this.getPitches(
      this.state.userFilter,
      this.state.assigneeFilter,
      event.target.value,
      this.props.numberItems,
      this.state.page,
      this.state.order
    );
  }

  onChangeAssigneeFilter(event) {
    this.setState({ assigneeFilter: parseInt(event.target.value) });
    this.getPitches(
      this.state.userFilter,
      parseInt(event.target.value),
      this.state.stateFilter,
      this.props.numberItems,
      this.state.page,
      this.state.order
    );
  }

  onChangeUserFilter(event) {
    this.setState({ userFilter: parseInt(event.target.value) });
    this.getPitches(
      parseInt(event.target.value),
      this.state.assigneeFilter,
      this.state.stateFilter,
      this.props.numberItems,
      this.state.page,
      this.state.order
    );
  }

  changeOrder(event) {
    this.setState({ order: event.target.value });
    this.getPitches(
      this.state.userFilter,
      this.state.assigneeFilter,
      this.state.stateFilter,
      this.props.numberItems,
      this.state.page,
      event.target.value
    );
  }

  async getMe() {
    try {
      const response = await client.query({
        query: ME_QUERY,
        variables: null
      });

      this.setState({ me: response.data.user });
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
}

PitchesList.defaultProps = {
  numberItems: 10,
  showFilter: true,
  showPagination: true
};

export default PitchesList;
