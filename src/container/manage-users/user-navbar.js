import React from "react"
import { getQueryObjByName } from "Utils/url-utils"
import "Sass/navbar.scss"
import { NavLink } from "react-router-dom"
import { userNavbarItems } from "../../constants/nav-items"
import { checkActiveClass } from "Utils/helpers"
import Button from "Components/button"

const UserNavbar = (props) => {
  return (
    <div className="main-header">
      <div>
        {
          userNavbarItems.map((item, i) => (
            <NavLink
              key={i}
              className={`nav-link ${checkActiveClass(item.value)}`}
              to={`${item.path}`}
            >
              {item.label}
            </NavLink>
          ))
        }
      </div>
      <div>
        <Button custom
          icon="addWhiteIcon"
          onClick={props.addNewUser}
        >
          Add new
        </Button>
      </div>
    </div >
  )
}

export default UserNavbar