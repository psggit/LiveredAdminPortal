import { emailRegex } from './regex'

export function validateTextField({ fieldName, fieldValue }) {
  //console.log("name", fieldName, "vale", fieldValue)
  if (!fieldValue.length) {
    return {
      status: true,
      value: `${fieldName} is required`
    }
  }
  return {
    status: false,
    value: ''
  }
}

export function validateEmail({ fieldName, fieldValue }) {
  if (!fieldValue.length) {
    return {
      status: true,
      value: `${fieldName} is required`
    }
  } else if (!emailRegex.test(fieldValue)) {
    return {
      status: true,
      value: `${fieldName} is invalid`
    }
  }
  return {
    status: false,
    value: ''
  }
}

export function validatePhone(phone) {
  if (!phone.length) {
    return {
      status: true,
      value: 'Mobile number is required'
    }
  } else if (isNaN(phone) || phone.length !== 10) {
    return {
      status: true,
      value: 'Mobile number is invalid'
    }
  }

  return {
    status: false,
    value: ''
  }
}
