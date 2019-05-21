import React from "react"
import Button from "Components/button"
import "./titlebar.scss"

const Titlebar = ({ title, enableEdit, handleClick, handleCancel }) => {
  return (
    <div className="title-section">
      <div>
        <p>{title}</p>
      </div>
      {
        !enableEdit &&
        <Button custom icon="editIcon" onClick={handleClick}>Edit</Button>
      }
      {
        enableEdit &&
        <div className="button">
          <span style={{ marginRight: '10px' }}><Button primary onClick={handleClick}>Save</Button></span>
          <span><Button secondary onClick={handleCancel}>Cancel</Button></span>
        </div>
      }
    </div>
  )
}

export default Titlebar
