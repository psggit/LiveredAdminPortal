import React, { useEffect, useState } from "react"
import Button from "./../button"
import "./dialog.scss"
import ButtonGroup from "./../button-group"
import Icon from "./../icon"

const Dialog = ({ icon, title, subtitle, children, onClick, actions }) => {
  return (
    <div className="overlay-container">
      <div className="dialog--container">
        <div className="dialog--body">
          <div className="header">
            {
              icon &&
              <div className="column1">
                <Icon name={icon} />
              </div>
            }
            <div className={`column2 ${icon ? 'text' : undefined}`}>
              {
                title
                  ? (
                    <div className="dialog--title-bar">
                      <p>
                        {title}
                      </p>
                    </div>
                  )
                  : ''
              }
              {
                subtitle
                  ? (
                    <div className="dialog--subtitle-bar">
                      <p>
                        {subtitle}
                      </p>
                    </div>
                  )
                  : ''
              }
            </div>
          </div>
          {children}
        </div>
        {
          actions &&
          <div className="dialog--footer">
            <ButtonGroup alignment="right">
              {actions.map(item => item)}
            </ButtonGroup>
          </div>
        }
      </div>
    </div>
  )
}

export default Dialog