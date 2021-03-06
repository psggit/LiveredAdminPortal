import React from "react"
import './sidemenu.scss'
import Icon from "./../icon"

const Sidemenu = ({ currentRoute, menuItems, history }) => {

  const checkActiveClass = (value) => {
    console.log("value", value, "current route", currentRoute, currentRoute.indexOf(value))
    if (value.indexOf(currentRoute) !== -1) {
      return 'active'
    }
    return ''
  }

  const handleChangeRoute = (e, currentRoute) => {
    e.preventDefault()
    history.push(`/home/${currentRoute}`)
  }

  return (
    <div id="sidemenu">
      <div className="side-menu">
        {
          menuItems.map((item, i) => (
            <div key={i} className={`side-menu__item ${checkActiveClass(item.value)}`}>
              {
                <React.Fragment>
                  <a
                    href={`/home/${item.value}`}
                    onClick={(e) => { handleChangeRoute(e, item.value) }}
                  >
                    <span>
                      <Icon name={item.icon} />
                    </span>
                    <p className="tooltip-text">
                      {item.label}
                    </p>
                    <div className="highlight"></div>
                  </a>
                </React.Fragment>
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Sidemenu