import { POST, GET } from 'Utils/fetch'
//const ipAddress = "192.168.43.10"
//const ipAddress = "183.82.32.28"
const ottp = "https://54c6c808.ngrok.io"
const dso = " https://dd852f51.ngrok.io"
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

export function cancelOttp(payload) {
  return POST({
    api: `${ottp}/livered/ottp/cancelOttp`,
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

export function fetchDsoDetails(payload) {
  return POST({
    api: `${dso}/livered/dso/dsoDetails`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function changeOrderStatus(payload) {
  return POST({
    api: `${ottp}/livered/ottp/changeOttpStatus`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function resendOtp(payload) {
  return POST({
    api: `${ottp}/livered/ottp/resendOtp`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function fetchOttpDetails(payload) {
  return POST({
    api: `${ottp}/livered/ottp/ottpDetails `,
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

