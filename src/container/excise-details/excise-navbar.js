import React from "react"
import { getQueryObjByName } from "Utils/url-utils"
import "Sass/navbar.scss"
import { exciseNavbarItems } from "./../../constants/nav-items"

const checkActiveClass = (value) => {
  const url = location.href
  if (url.indexOf(value) !== -1) {
    return 'active'
  }
  return ''
}

const ExciseNavbar = (props) => {

  const handleClick = (route) => {
    if (props.navbarItems) {
      location.href = route
    } else {
      location.href = `${route}?stateId=${getQueryObjByName("stateId")}&name=${getQueryObjByName("name")}`
    }
  }

  return (
    <div className="main-header">
      {
        !props.navbarItems
          ? exciseNavbarItems.map((item, i) => (
            <a key={i} onClick={() => handleClick(item.path)} className={`${checkActiveClass(item.value)}`}>{item.label}</a>
          ))
          : props.navbarItems.map((item, i) => (
            <a key={i} onClick={() => handleClick(item.path)} className={`${checkActiveClass(item.value)}`}>{item.label}</a>
          ))
      }
    </div >
  )
}

export default ExciseNavbar