import React from "react"
import Button from "Components/button"
import "./titlebar-and-save.scss"

const Titlebar = ({ title, enableEdit, handleClick, handleCancel, disableBtn, handleSubmit }) => {
  return (
    <div className="title-section">
      <div>
        <p>{title}</p>
      </div>
      {
        !enableEdit &&
        <Button custom
          icon="editIcon"
          onClick={handleClick}
        >
          Edit
        </Button>
      }
      {
        enableEdit &&
        <div className="button">
          <span style={{ marginRight: '10px' }}>
            <Button
              primary
              onClick={handleClick}
              disabled={disableBtn ? disableBtn : false}
            >
              Save
            </Button>
          </span>
          <span>
            <Button
              secondary
              disabled={disableBtn ? disableBtn : false}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </span>
        </div>
      }
    </div>
  )
}

export default Titlebar
