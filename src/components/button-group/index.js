import React from 'react'
import './button-group.scss'

const ButtonGroup = ({ children, alignment }) => (
  <div className={`button--group button--group__${alignment}`}>
    { children }
  </div>
)

export default ButtonGroup