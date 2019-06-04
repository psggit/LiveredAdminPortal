import React from "react"
import { getQueryObjByName } from "Utils/url-utils"
import "Sass/navbar.scss"
import { NavLink } from "react-router-dom"
import { exciseNavbarItems } from "./../../constants/nav-items"
import { checkActiveClass } from "Utils/helpers"

const ExciseNavbar = (props) => {
  return (
    <div className="main-header">
      {
        !props.navbarItems
          ? exciseNavbarItems.map((item, i) => (
            <NavLink
              className={`nav-link ${checkActiveClass(item.value)}`}
              to={`${item.path}?stateId=${getQueryObjByName("stateId")}&name=${getQueryObjByName("name")}`}
            >
              {item.label}
            </NavLink>
          ))
          : props.navbarItems.map((item, i) => (
            <NavLink className={`nav-link ${checkActiveClass(item.value)}`} to={item.path}>{item.label}</NavLink>
          ))
      }
    </div >
  )
}

export default ExciseNavbar