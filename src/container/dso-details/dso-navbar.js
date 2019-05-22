import React from "react"
import { getQueryObjByName } from "Utils/url-utils"
import "./dso-navbar.scss"

const handleClick = (route) => {
  location.href = `${route}?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`
}

const checkActiveClass = (value) => {
  const url = location.href
  if (url.indexOf(value) !== -1) {
    return 'active'
  }
  return ''
}

const DsoNavbar = () => {
  return (
    <div className="main-header">
      <a onClick={() => handleClick(`/home/dso/view-details`)} className={`${checkActiveClass("details")}`}>Details</a>
      <a onClick={() => handleClick("/home/view-credits")} className={`${checkActiveClass("credits")}`}>Credits</a>
      <a>Users</a>
      <a onClick={() => handleClick("/home/view-contact")} className={`${checkActiveClass("contact")}`}>Contact</a>
    </div >
  )
}

export default DsoNavbar