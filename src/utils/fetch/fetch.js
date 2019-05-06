/**
 * custom API for the `Fetch` module
 */

import * as Utils from "./utils"

export function GET(options) {
  options.method = "GET"

  return Utils.constructFetchUtility(options)
}

export function POST(options) {
  options.method = "POST"

  return Utils.constructFetchUtility(options)
}

export function PUT(options) {
  options.method = "PUT"

  return Utils.constructFetchUtility(options)
}

export function PATCH(options) {
  options.method = "PATCH"

  return Utils.constructFetchUtility(options)
}

export function DELETE(options) {
  options.method = "DELETE"

  return Utils.constructFetchUtility(options)
}
