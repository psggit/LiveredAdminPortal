import React from 'react'
import './button.scss'
import Icon from "./../icon"

function getClassName(props) {

  let className = 'btn-default'

  if (props.primary) {
    className = 'btn-primary'
  } else if (props.secondary) {
    className = 'btn-secondary'
  } else if (props.danger) {
    className = 'btn-danger'
  } else if (props.custom) {
    className = "btn-custom"
  }
  return className
}

const Button = (props) => {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={`btn ${getClassName(props)}`}
    >
      {
        props.icon &&
        <span><Icon name={props.icon} /></span>
      }
      {props.children}
    </button>
  )
}

export default Button