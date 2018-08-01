import React from "react";
import { Switch, Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client";
import Cookies from "js-cookie";

import { API_ENDPOINT, AUTH_TOKEN_COOKIE_NAME } from "../constants";
import Dashboard from "./pages/dashboard";
import Pitches from "./pages/pitches";
import Pitch from "./pages/pitch";
import Article from "./pages/article";
import CreateUser from "./pages/create-user";
import SubmitPitch from "./pages/submit-pitch";
import User from "./pages/user";
import UserMe from "./pages/user-me";
import Users from "./pages/users";
import Login from "./pages/login";
import Logout from "./pages/logout";
import RequestPassword from "./pages/request-password";
import ResetPassword from "./pages/reset-password";
import NotFound from "./pages/404-not-found";
import PrivateRoute from "./private-route";

export let client = null;

class App extends React.Component {
  constructor(props) {
    super(props);

    // First step: Assume that an existing cookie might indicate a valid login.
    const token = Cookies.get(AUTH_TOKEN_COOKIE_NAME);
    this.state = {
      isAuthenticated: !!token
    };

    // Concat Apollo links
    // @see https://www.apollographql.com/docs/link/composition.html
    // @see https://www.apollographql.com/docs/react/recipes/authentication.html
    const authLink = setContext((_, { headers }) => {
      // Get the authentication token from cookie if it exists.
      const token = Cookies.get(AUTH_TOKEN_COOKIE_NAME);

      // Return the headers to the context so httpLink can read them.
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : null
        }
      };
    });

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) => {
          // Error messages are handled in components.
          console.error(
            `[GraphQL error]: Message: ${message}, Locations: ${locations}, Path: ${path}`
          );
        });
      }
      if (networkError) {
        console.error(
          `[Network error]: Message: ${networkError.message}, StatusCode: ${
            networkError.statusCode
          }`
        );
        if (networkError.statusCode !== 401) {
          UIkit.notification({
            message:
              "A network error occurred. Maybe try reloading your browser?",
            status: "danger"
          });
        }
      }

      // Store authenticated in state for routing.
      this.setState({
        isAuthenticated: !(networkError && networkError.statusCode === 401)
      });
    });

    const uploadLink = createUploadLink({ uri: API_ENDPOINT });
    const defaultOptions = {
      watchQuery: {
        fetchPolicy: "no-cache"
      },
      query: {
        fetchPolicy: "no-cache"
      }
    };

    client = new ApolloClient({
      link: ApolloLink.from([authLink, errorLink, uploadLink]),
      cache: new InMemoryCache(),
      defaultOptions: defaultOptions
    });
  }

  setAuthenticated(isAuthenticated) {
    this.setState({
      isAuthenticated: isAuthenticated
    });
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Switch>
          <PrivateRoute
            exact
            path="/"
            component={Dashboard}
            isAuthenticated={this.state.isAuthenticated}
          />
          <PrivateRoute
            path="/pitch/:pitchId"
            component={Pitch}
            isAuthenticated={this.state.isAuthenticated}
          />
          <PrivateRoute
            path="/pitches"
            component={Pitches}
            isAuthenticated={this.state.isAuthenticated}
          />
          <PrivateRoute
            path="/article/:articleId"
            component={Article}
            isAuthenticated={this.state.isAuthenticated}
          />
          <PrivateRoute
            path="/create-user"
            component={CreateUser}
            isAuthenticated={this.state.isAuthenticated}
          />
          <PrivateRoute
            path="/submit-pitch"
            component={SubmitPitch}
            isAuthenticated={this.state.isAuthenticated}
          />
          <PrivateRoute
            path="/me"
            component={UserMe}
            isAuthenticated={this.state.isAuthenticated}
          />
          <PrivateRoute
            path="/users"
            component={Users}
            isAuthenticated={this.state.isAuthenticated}
          />
          <PrivateRoute
            path="/user/:userId"
            component={User}
            isAuthenticated={this.state.isAuthenticated}
          />
          <Route
            path="/login"
            render={props => (
              <Login
                setAuthenticated={isAuthenticated =>
                  this.setAuthenticated(isAuthenticated)
                }
                {...props}
              />
            )}
          />
          <Route
            path="/logout"
            render={props => (
              <Logout
                setAuthenticated={isAuthenticated =>
                  this.setAuthenticated(isAuthenticated)
                }
                {...props}
              />
            )}
          />
          <Route path="/request-password" component={RequestPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route component={NotFound} />
        </Switch>
      </ApolloProvider>
    );
  }
}

export default App;
