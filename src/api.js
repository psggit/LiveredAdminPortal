import { POST, GET } from 'Utils/fetch'
//const ipAddress = "192.168.43.10"
//const ipAddress = "183.82.32.28"
const ottp = "https://a5080078.ngrok.io"
const dso = "https://ba23a0fe.ngrok.io"
const credit = "https://a0ac223a.ngrok.io"
const rule = "https://5b16684d.ngrok.io"
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

export function generateCreditReport(payload) {
  return POST({
    api: `${credit}/livered/credits/creditReports`,
    handleError: true,
    prependBaseUrl: false,
    data: payload,
    parseType: "text"
  })
}

export function generateOttpReport(payload) {
  return POST({
    api: `${ottp}/livered/ottp/ottpReports`,
    handleError: true,
    prependBaseUrl: false,
    data: payload,
    parseType: "text"
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

export function addCityToDso(payload) {
  return POST({
    api: `${dso}/livered/dso/addCityToDso`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function deleteCityToDso(payload) {
  return POST({
    api: `${dso}/livered/dso/deleteCityFromDso`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function fetchExciseList(payload) {
  return POST({
    api: `${dso}/livered/dso/listExcise`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function editDsoLocationDetails(payload) {
  return POST({
    api: `${dso}/livered/dso/updateDsoStateDetails`,
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

export function fetchCreditsList(payload) {
  return POST({
    api: `${credit}/livered/credits/getDsoCreditLog`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function fetchRules(payload) {
  return POST({
    api: `${rule}/livered/rules/listRules`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function addDsoStateDetails(payload) {
  return POST({
    api: `${dso}/livered/dso/addDsoStateDetails`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function createDsoDetails(payload) {
  return POST({
    api: `${dso}/livered/dso/createDso`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function creatingDsoLocationDetails(payload) {
  return POST({
    api: `${dso}/livered/dso/addDsoStateDetails`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function updateDsoDetails(payload) {
  return POST({
    api: `${dso}/livered/dso/updateDsoDetails`,
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

export function addDsoCredits(payload) {
  return POST({
    api: `${credit}/livered/credits/addCredit`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function toggleDeliveryStatus(payload) {
  return POST({
    api: `${dso}/livered/dso/changeDsoStatus`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function toggleStateServiceStatus(payload) {
  return POST({
    api: `${dso}/livered/dso/updateStateDeliveryStatus`,
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

