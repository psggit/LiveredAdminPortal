import React from 'react'
import './button.scss'

function getClassName(props) {

  let className = 'btn-default'

  if (props.primary) {
    className = 'btn-primary'
  } else if (props.secondary) {
    className = 'btn-secondary'
  } else if (props.danger) {
    className = 'btn-danger'
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
      { props.children }
    </button>
  )
}

export default Button