import React from "react"
import Button from "Components/button"
import "./titlebar.scss"

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
            {
              handleSubmit == undefined &&
              <Button
              primary
              onClick={handleClick}
              disabled={disableBtn ? disableBtn : false}
            >
              Save
            </Button>
            }
            {
              handleSubmit !== undefined &&
              <Button
              primary
              disabled={disableBtn ? disableBtn : false}
            >
              Save
            </Button>
            }
          </span>
          <span><Button secondary onClick={handleCancel}>Cancel</Button></span>
        </div>
      }
    </div>
  )
}

export default Titlebar
