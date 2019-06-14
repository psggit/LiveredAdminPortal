import { POST, GET } from 'Utils/fetch'
//const ipAddress = "192.168.43.10"
//const ipAddress = "183.82.32.28"

const ottp = "https://02e60307.ngrok.io"
export const dso = "https://6f258f66.ngrok.io"
const credit = "https://dc3e9629.ngrok.io"
export const consumer = "https://32fcbab7.ngrok.io"
const rule = "https://3ff20ddb.ngrok.io"

export function fetchAllOttps(payload) {
  return POST({
    api: `${ottp}/livered/ottp/allOttps`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function fetchAllOperations(payload) {
  return POST({
    api: `${dso}/livered/dso/listDsoForState`,
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
    api: `${ottp}/livered/ottp/changeOttpStatus`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function fetchUserRoles(payload) {
  return GET({
    api: `${dso}/livered/dso/listRoles`,
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

export function deleteDsoUser(payload) {
  return POST({
    api: `${dso}/livered/dso/deleteDsoUser`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function deleteExciseUser(payload) {
  return POST({
    api: `${dso}/livered/dso/deleteExciseUser`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function deleteSupportUser(payload) {
  return POST({
    api: `${dso}/livered/dso/deleteSupportUser`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function createSupportUser(payload) {
  return POST({
    api: `${dso}/livered/dso/createSupportUser`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function createExciseUser(payload) {
  return POST({
    api: `${dso}/livered/dso/createExciseUser`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function createDsoUser(payload) {
  return POST({
    api: `${dso}/livered/dso/createDsoUser`,
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

export function createExciseDetails(payload) {
  return POST({
    api: `${dso}/livered/dso/createExcise`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function createTimeRestriction(payload) {
  return POST({
    api: `${rule}/livered/rules/insertStateTimings`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function updateTimeRestriction(payload) {
  return POST({
    api: `${rule}/livered/rules/updateStateTimings`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function createLegalPurchaseAge(payload) {
  return POST({
    api: `${rule}/livered/rules/insertLegalAge`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function deactivateExciseUser(payload) {
  return POST({
    api: `${dso}/livered/dso/updateExciseUserStatus`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function deactivateDsoUser(payload) {
  return POST({
    api: `${dso}/livered/dso/updateDsoUserStatus`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function deactivateSupportUser(payload) {
  return POST({
    api: `${dso}/livered/dso/updateSupportUserStatus`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function updateLegalPurchaseAge(payload) {
  return POST({
    api: `${rule}/livered/rules/updateLegalAge`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function createDsoFee(payload) {
  return POST({
    api: `${credit}/livered/credits/insertFee`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function updateDsoFee(payload) {
  return POST({
    api: `${credit}/livered/credits/editFee`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function createPossessionLimit(payload) {
  return POST({
    api: `${rule}/livered/rules/insertPossessionLimit`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function updatePossessionLimit(payload) {
  return POST({
    api: `${rule}/livered/rules/updatePossessionLimit`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function createCitySpecialDay(payload) {
  return POST({
    api: `${rule}/livered/rules/insertCitySpecialDays`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function createStateSpecialDay(payload) {
  return POST({
    api: `${rule}/livered/rules/insertStateSpecialDays`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function deleteStateSpecialDay(payload) {
  return POST({
    api: `${rule}/livered/rules/deleteStateSpecialDays`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function deleteCitySpecialDay(payload) {
  return POST({
    api: `${rule}/livered/rules/deleteCitySpecialDays`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function changeExciseDeliveryStatus(payload) {
  return POST({
    api: `${dso}/livered/dso/editDsoLocationStatus`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function updateExciseDetails(payload) {
  return POST({
    api: `${dso}/livered/dso/updateExcise`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function fetchSupportList(payload) {
  return POST({
    api: `${dso}/livered/dso/listSupportUsers`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function fetchExciseUsers(payload) {
  return POST({
    api: `${dso}/livered/dso/listExciseUsers`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function fetchDsoUsers(payload) {
  return POST({
    api: `${dso}/livered/dso/listDsoUsers`,
    handleError: true,
    prependBaseUrl: false,
    data: payload
  })
}

export function fetchExciseDetails(payload) {
  return POST({
    api: `${dso}/livered/dso/exciseDetails`,
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

