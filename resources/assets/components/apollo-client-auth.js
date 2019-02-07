import { ApolloClient } from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import { AUTH_ENDPOINT } from "../constants";

const httpLink = createHttpLink({
  uri: AUTH_ENDPOINT
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache"
  },
  query: {
    fetchPolicy: "no-cache"
  }
};

// Create new client for auth endpoint.
const authClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions
});

export default authClient;
