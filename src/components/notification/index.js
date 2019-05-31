import React from "react"
import { render } from "react-dom"
import Notification from "./notification"
import './notification.scss'

const Notify = (message, type = "default") => {

  const className = "notification-container"

  const el = document.querySelector(`.${className}`)
  
  if (el) {
    el.parentNode.removeChild(el)
  }

  const container = document.createElement("div")
  container.setAttribute("class", className)
  document.body.appendChild(container)

  render(
    <Notification
      message={message}
      type={type}
    />, container
  )

}

export default Notify