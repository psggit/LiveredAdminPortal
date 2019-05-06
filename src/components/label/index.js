import React from 'react'
import './label.scss'
import Icon from './../icon'

const Label = ({ children, color, icon, tooltipText }) => {
  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <p className="label" style={{marginRight: '10px'}}>
        { children }
      </p>
      {
        icon 
        ?
          <span className="info"  style={{ position: "relative" }}>
            <Icon name={icon} /> 
            <span className="tooltip-text">
              {tooltipText}
            </span>
          </span>
        : ''
      }
    </div>
  )
}

export default Label
