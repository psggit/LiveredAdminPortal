import { POST, GET } from 'Utils/fetch'
//const ipAddress = "192.168.43.10"
//const ipAddress = "183.82.32.28"
const ottp = "https://b1dcaf93.ngrok.io"
const dso = "https://f53d207e.ngrok.io"
// const rule = ""
// const consumer = ""
// const credit = ""

export function fetchAllOttps(payload) {
  return POST({
    api: `${ottp}/livered/ottp/allOttps`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function fetchDSOList(payload) {
  return POST({
    api: `${dso}/livered/dso/listDso`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function fetchStateAndCitiesList(payload) {
  return GET({
    api: `${ottp}/livered/ottp/getCityAndStates`,
    handleError: true,
    prependBaseUrl: false,
    //data: payload
  })
}

