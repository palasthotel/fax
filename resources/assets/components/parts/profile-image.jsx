import React from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";

class ProfileImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Shortcut
    const user = this.props.user;

    // Build wrapper classes
    const classes = [
      "uk-border-circle",
      "uk-overflow-hidden",
      "uk-display-inline-block",
      "uk-flex-none",
      "uk-text-muted",
      "uk-text-center",
      "uk-background-primary",
      "uk-background-cover",
      "uk-background-center-center",
      "uk-background-norepeat"
    ];
    classes.push(this.props.className);

    const attributes = {
      className: classes.join(" "),
      style: {
        width: this.props.size + "px",
        height: this.props.size + "px"
      }
    };

    if (!user) {
      return <div {...attributes}>–</div>;
    }

    if (user.profileImage) {
      attributes.style.backgroundImage = `url(${user.profileImage.url})`;
    }

    if (this.props.link === false) {
      return <div {...attributes} />;
    }

    return <Link to={`/user/${user.id}`} {...attributes} />;
  }
}

ProfileImage.defaultProps = {
  user: null,
  size: 22,
  link: true
};

export default ProfileImage;
