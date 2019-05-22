import React from "react"
import Icon from "Components/icon"

const RuleHeader = ({ title, tooltipText, children }) => {
  return (
    <React.Fragment>
      <div className="rule--header">
        <div style={{ display: 'flex' }}>
          <p>
            {title}
          </p>
          <span className="info" style={{ position: 'relative', top: '1px', marginLeft: '12px', display: 'inline-block' }}>
            <Icon name="info" />
            <span className="tooltip-text" style={{ top: '45px' }}>
              {tooltipText}
            </span>
          </span>
        </div>
      </div>
      <div className="rule--body">
        {children}
      </div>
    </React.Fragment>
  )
}

export default RuleHeader