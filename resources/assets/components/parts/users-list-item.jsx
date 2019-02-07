import React, { Fragment } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";

import ProfileImage from "./profile-image";

class UsersListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const user = this.props.user;

    if (user === undefined) {
      return null;
    }

    return (
      <tr key={user.id}>
        <td>
          <div className="uk-flex uk-flex-middle">
            <ProfileImage user={user} size={40} />
            <Link className="uk-margin-small-left" to={`/user/${user.id}`}>
              {user.firstName} {user.lastName}
            </Link>
          </div>
        </td>
        <td>
          {user.expertises.map((expertise, index) => {
            if (index === 0) {
              return `${expertise.name}`;
            }
            return ` / ${expertise.name}`;
          })}
        </td>
        <td>
          {user.locations.map((location, index) => {
            if (index === 0) {
              return `${location.name}`;
            }
            return ` / ${location.name}`;
          })}
        </td>
      </tr>
    );
  }
}

export default UsersListItem;
