import React from "react"
import { getQueryObjByName } from "Utils/url-utils"
import "Sass/navbar.scss"
import { NavLink } from "react-router-dom"
import { dsoNavbarItems } from "./../../constants/nav-items"
import { checkActiveClass } from "Utils/helpers"

// const checkActiveClass = (value) => {
//   const url = location.href
//   if (url.indexOf(value) !== -1) {
//     return 'active'
//   }
//   return ''
// }

const DsoNavbar = (props) => {

  // const handleClick = (route) => {
  //   if (props.navbarItems) {
  //     location.href = route
  //   } else {
  //     location.href = `${route}?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`
  //   }
  // }

  return (
    <div className="main-header">
      {
        !props.navbarItems
          ? dsoNavbarItems.map((item, i) => (
            // <a key={i} onClick={() => handleClick(item.path)} className={`${checkActiveClass(item.value)}`}>{item.label}</a>
            <NavLink
              className={`nav-link ${checkActiveClass(item.value)}`}
              to={`${item.path}?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`}
            >
              {item.label}
            </NavLink>
          ))
          : props.navbarItems.map((item, i) => (
            // <a key={i} onClick={() => handleClick(item.path)} className={`${checkActiveClass(item.value)}`}>{item.label}</a>
            <NavLink className={`nav-link ${checkActiveClass(item.value)}`} to={item.path}>{item.label}</NavLink>
          ))
      }
    </div >
  )
}

export default DsoNavbar