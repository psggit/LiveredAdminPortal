import React from "react"
import { getQueryObjByName } from "Utils/url-utils"
import "./dso-navbar.scss"
import { dsoNavbarItems } from "./../../constants/nav-items"

const checkActiveClass = (value) => {
  const url = location.href
  if (url.indexOf(value) !== -1) {
    return 'active'
  }
  return ''
}

const DsoNavbar = (props) => {

  const handleClick = (route) => {
    if (props.navbarItems) {
      location.href = route
    } else {
      location.href = `${route}?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`
    }
  }

  return (
    <div className="main-header">
      {
        !props.navbarItems
          ? dsoNavbarItems.map((item, i) => (
            <a onClick={() => handleClick(item.path)} className={`${checkActiveClass(item.value)}`}>{item.label}</a>
          ))
          : props.navbarItems.map((item, i) => (
            <a onClick={() => handleClick(item.path)} className={`${checkActiveClass(item.value)}`}>{item.label}</a>
          ))
      }
    </div >
  )
}

export default DsoNavbar