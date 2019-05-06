/**
 * utility methods for constructing `Fetch` API
 */

import "whatwg-fetch"
// import Session from "./../session"
import { Api } from "./../config"
/**
 * Helper methods to create window.fetch instance
 */

const getToken = () => ({
  // "Authorization": `Bearer ${localStorage.getItem('auth-token')}`,
  "x-hasura-role": `${localStorage.getItem('x-hasura-role')}`,
  "hasura-id": `${localStorage.getItem('hasura-id')}`
})

function getHeaders(type) {
  const json_headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  switch (type) {
    case "FormData":
      return getToken()
    case "Public":
      return Object.assign({}, json_headers)
    case 'RSS':
      return Object.assign({}, {'Accept': 'application/xml', 'Content-Type': 'application/xml'})
    default:
      return Object.assign({}, json_headers, getToken())
  }
}


/**
 * fetch data constructor(s)
 */
function constructBody({ type, data }) {
  switch (type) {
    case "FormData":
      return data

    default:
      return JSON.stringify(data)
  }
}

/**
 * Error handling helpers
 */
export function checkStatus(response) {
  if (response.status >= 200 && response.status < 305) {
    return response
  } else {
    // console.log(response.statusText);
    var error = new Error(response.statusText)
    //console.log("res", response)
    //var error = new Error(response.error)
    error.response = response
    throw error
  }
}

/**
 * constructFetchUtility - return a window.fetch instance
 * @param {Object} options
 */
export function constructFetchUtility(options) {
  const { api, data, method, type, cors, prependBaseUrl = true, apiBase } = options

  // construct request url
  const url = prependBaseUrl ? `${Api[apiBase]}${api}` : api

  // construct options for creating `window.fetch` instance
  let fetchOptions = {
    method,
    credentials: 'include',
    headers: getHeaders(type),
  }

  if(cors) fetchOptions.mode = 'cors'
  // add data to request
  if (data && method !== "GET") {
    fetchOptions.body = constructBody({type, data})
  }

  return (options.handleError)
    ? fetch(url, fetchOptions)
      .then(checkStatus)
      .then(parseJSON)
    : fetch(url, fetchOptions)
      .then(parseJSON)
}

function parseJSON(response) {
  return response.json()
}
