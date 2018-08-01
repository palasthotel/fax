import React, { Fragment } from "react";
import { render } from "react-dom";
import gql from "graphql-tag";
import json2csv from "json2csv";

import { client } from "../app";
import Pagination from "./pagination";
import Spinner from "./spinner";
import UserListItem from "./users-list-item";

const FREELANCERS_QUERY = gql`
  query getFreelancersQuery(
    $expertises: [Int]
    $locations: [Int]
    $limit: Int
    $offset: Int
    $order: String
  ) {
    freelancers(
      expertises: $expertises
      locations: $locations
      limit: $limit
      offset: $offset
      order: $order
    ) {
      id
      firstName
      lastName
      profileImage {
        id
        url
        text
      }
      expertises {
        id
        name
      }
      locations {
        id
        name
      }
    }
    freelancersCount(expertises: $expertises, locations: $locations)
  }
`;

const ALL_FREELANCERS_QUERY = gql`
  query getAllFreelancersQuery {
    freelancers {
      firstName
      lastName
      email
      phone
      website
      facebook
      twitter
      instagram
    }
  }
`;

const EXPERTISES_QUERY = gql`
  query {
    expertises {
      id
      name
    }
  }
`;

const LOCATIONS_QUERY = gql`
  query {
    locations {
      id
      name
    }
  }
`;

const ORDER_STATES = [
  { id: "users.created.desc", text: "Sort by created date desc." },
  { id: "users.created.asc", text: "Sort by created date asc." },
  { id: "users.firstName.desc", text: "Sort by first name desc." },
  { id: "users.firstName.asc", text: "Sort by first name asc." },
  { id: "users.lastName.desc", text: "Sort by last name desc." },
  { id: "users.lastName.asc", text: "Sort by last name asc." }
];

class UsersList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
      usersAll: null,
      usersCount: null,
      expertises: null,
      locations: null,
      locationsFilter: 0,
      expertisesFilter: 0,
      page: 1,
      order: ORDER_STATES[0].id
    };

    this.getUsers(
      this.state.expertisesFilter,
      this.state.locationsFilter,
      this.props.numberItems,
      1,
      this.state.order
    );

    if (this.props.showFilter) {
      this.getExpertises();
      this.getLocations();
    }
  }

  render() {
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

    const downloadCSVButton = (
      <div className="uk-margin-small-top uk-margin-auto-left uk-form-controls">
        <button
          className="uk-button uk-button-default"
          onClick={event => this.downloadCSV(event)}
        >
          <span uk-icon="icon: download" className="uk-margin-small-right" />{" "}
          Download all users as CSV
        </button>
        <a id="download-helper" className="uk-hidden" />
      </div>
    );

    const filter = (
      <form className="uk-flex uk-flex-wrap">
        {this.renderLocationsFilter()}
        {this.renderExpertisesFilter()}
        {filterOrder}
        {downloadCSVButton}
      </form>
    );

    return (
      <Fragment>
        {this.props.showFilter === true ? filter : ""}
        {this.renderUsers()}
      </Fragment>
    );
  }

  async downloadCSV(event) {
    event.preventDefault();
    await this.getAllUsers();
    const csvData = json2csv.parse(this.state.usersAll);

    // @see https://stackoverflow.com/a/44661948
    const file = new Blob([csvData], { type: "text/csv" });
    const helperLinkElement = document.getElementById("download-helper");
    if (!helperLinkElement) {
      return;
    }
    helperLinkElement.href = URL.createObjectURL(file);
    helperLinkElement.download = `fax-users-${Date.now()}.csv`;
    helperLinkElement.click();
  }

  renderUsers() {
    const users = this.state.users;
    const showPagination = this.props.showPagination;
    const count = this.state.usersCount;
    const page = this.state.page;
    const perPage = this.props.numberItems;

    if (!users) {
      return <Spinner />;
    }

    return (
      <div>
        <table className="uk-table uk-table-striped uk-table-responsive uk-margin-medium-top">
          <thead>
            <tr>
              <th>Name</th>
              <th>Expertise</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {users.length < 1 ? (
              <tr>
                <td colSpan={3}>Sorry, no users found.</td>
              </tr>
            ) : null}
            {users.map(user => (
              <UserListItem key={`user_list_item_${user.id}`} user={user} />
            ))}
          </tbody>
        </table>
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

  renderLocationsFilter() {
    if (!this.state.locations) {
      return <Spinner />;
    }

    return (
      <div className="uk-margin-small-top uk-margin-small-right uk-form-controls">
        <select
          className="uk-select"
          id="form-stacked-select"
          value={this.state.locationsFilter}
          onChange={event => this.onChangeLocationsFilter(event)}
        >
          <option key={`filter_option_location_0`} value={0}>
            All locations
          </option>
          {this.state.locations.map(location => {
            return (
              <option
                key={`filter_option_location_${location.id}`}
                value={location.id}
              >
                {location.name}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  renderExpertisesFilter() {
    if (!this.state.expertises) {
      return <Spinner />;
    }

    return (
      <div className="uk-margin-small-top uk-margin-small-right uk-form-controls">
        <select
          className="uk-select"
          id="form-stacked-select"
          value={this.state.expertisesFilter}
          onChange={event => this.onChangeExpertisesFilter(event)}
        >
          <option key={`filter_option_expertise_0`} value={0}>
            All expertises
          </option>
          {this.state.expertises.map(expertise => {
            return (
              <option
                key={`filter_option_expertise_${expertise.id}`}
                value={expertise.id}
              >
                {expertise.name}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  async getUsers(expertisesFilter, locationsFilter, numberItems, page, order) {
    const variables = {};
    if (expertisesFilter) {
      variables.expertises = [expertisesFilter];
    }
    if (locationsFilter) {
      variables.locations = [locationsFilter];
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
        query: FREELANCERS_QUERY,
        variables: variables
      });

      this.setState({
        users: response.data.freelancers,
        usersCount: response.data.freelancersCount
      });
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting users data.",
        status: "danger"
      });
    }
  }

  async getAllUsers() {
    try {
      const response = await client.query({
        query: ALL_FREELANCERS_QUERY
      });

      this.setState({
        usersAll: response.data.freelancers
      });
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting all users data.",
        status: "danger"
      });
    }
  }

  async getExpertises() {
    try {
      const response = await client.query({
        query: EXPERTISES_QUERY
      });

      this.setState({ expertises: response.data.expertises });
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting users expertise.",
        status: "danger"
      });
    }
  }

  async getLocations() {
    try {
      const response = await client.query({
        query: LOCATIONS_QUERY
      });

      this.setState({ locations: response.data.locations });
    } catch (err) {
      if (err.networkError) {
        return;
      }
      UIkit.notification({
        message: "Error requesting users expertise.",
        status: "danger"
      });
    }
  }

  onChangeLocationsFilter(event) {
    this.setState({ locationsFilter: parseInt(event.target.value) });
    this.getUsers(
      this.state.expertisesFilter,
      parseInt(event.target.value),
      this.props.numberItems,
      this.state.page,
      this.state.order
    );
  }

  onChangeExpertisesFilter(event) {
    this.setState({ expertisesFilter: parseInt(event.target.value) });
    this.getUsers(
      parseInt(event.target.value),
      this.state.locationsFilter,
      this.props.numberItems,
      this.state.page,
      this.state.order
    );
  }

  onClickPage(newPage) {
    this.setState({ page: newPage, users: null });
    this.getUsers(
      this.state.expertisesFilter,
      this.state.locationsFilter,
      this.props.numberItems,
      newPage,
      this.state.order
    );
  }

  changeOrder(event) {
    this.setState({ order: event.target.value });
    this.getUsers(
      this.state.expertisesFilter,
      this.state.locationsFilter,
      this.props.numberItems,
      this.state.page,
      event.target.value
    );
  }
}

UsersList.defaultProps = {
  numberItems: 20,
  showFilter: true,
  showPagination: true
};

export default UsersList;
