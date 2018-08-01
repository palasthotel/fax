import moment from "moment";

import { ROLE_EDITOR } from "../constants";
import { ME_QUERY } from "../constants";
import { client } from "./app";

/**
 * Some little helpers
 */

export function getTimestampByDateTime(dateTime) {
  return new Date(dateTime).getTime();
}

export function getHumanReadableFromNowDateTime(dateTime) {
  moment.locale();
  return moment(dateTime).fromNow();
}

export function getHumanReadableDateTime(dateTime) {
  moment.locale();
  return moment(dateTime).format("LLLL");
}

export function userIsEditor(user) {
  return (
    user != null &&
    Array.isArray(user.roles) &&
    user.roles.indexOf(ROLE_EDITOR) > -1
  );
}

export function errorToStringArray(error) {
  const errorMessages = [];

  if (!error || !error.graphQLErrors || error.graphQLErrors.length === 0) {
    return [];
  }

  for (let errorItem of error.graphQLErrors) {
    if (!errorItem.validation || errorItem.validation.length === 0) {
      errorMessages.push(errorItem.message);
      continue;
    }

    // When there is a validation error, there should be a validation object
    // with more detailed information.
    // We print those, because the error.message would just be »validation«.
    // The validation object has fieldNames as keys, which contain arrays,
    // which contain the error strings.
    for (let fieldName of Object.keys(errorItem.validation)) {
      for (let validationDescription of errorItem.validation[fieldName]) {
        errorMessages.push(validationDescription);
      }
    }
  }
  return errorMessages;
}

export async function getUserProfile() {
  try {
    const response = await client.query({
      query: ME_QUERY,
      variables: null
    });

    if (Array.isArray(response.errors) && response.errors.length > 0) {
      UIkit.notification({
        message:
          "Error reading user profile. Please make sure to use only allowed values.",
        status: "danger"
      });
      return false;
    } else {
      return response.data;
    }
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
