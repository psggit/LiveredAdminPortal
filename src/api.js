import { POST, GET } from 'Utils/fetch'

const ipAddress = "192.168.5.84"

export function fetchAllOttps (payload) {
  return POST({
      api: `http://${ipAddress}:3000/livered/ottp/allOttps`,
      handleError: true,
      prependBaseUrl: false,
      data: payload
  })
}

export function fetchDSOList (payload) {
  return POST({
      api: `http://${ipAddress}:3002/livered/dso/listDso`,
      handleError: true,
      prependBaseUrl: false,
      data: payload
  })
}

export function fetchStateAndCitiesList (payload) {
  return GET({
      api: `http://${ipAddress}:3000/livered/ottp/getCityAndStates`,
      handleError: true,
      prependBaseUrl: false,
      //data: payload
  })
}

