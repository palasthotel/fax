import gql from "graphql-tag";

export const AUTH_TOKEN_COOKIE_NAME = "auth_token";
export const API_ENDPOINT = "/graphql";
export const AUTH_ENDPOINT = "/graphql/auth";
export const GUIDELINES_URL = "/guidelines.pdf";
export const ROLE_EDITOR = "EDITOR";
export const ROLE_FREELANCER = "FREELANCER";
export const MESSAGE_REFRESH_RATE = 30000;

export const PITCH_STATES = {
  new: {
    id: "new",
    text: "New",
    className: "fx-background-orange"
  },
  rejected: {
    id: "rejected",
    text: "Rejected",
    className: "fx-background-red"
  },
  "work in progress": {
    id: "work in progress",
    text: "Work in progress",
    className: "fx-background-greenish-orange"
  },
  approval: {
    id: "approval",
    text: "approval",
    className: "fx-background-orangish-green"
  },
  published: {
    id: "published",
    text: "Published",
    className: "fx-background-green"
  },
  canceled: {
    id: "canceled",
    text: "Canceled",
    className: "fx-background-red"
  }
};

/**
 * Queries
 */
export const ME_QUERY = gql`
  query {
    user {
      id
      roles
    }
  }
`;

export const PITCH_FIELDS_QUERY_PART = `
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
        profileImage{
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
`;
