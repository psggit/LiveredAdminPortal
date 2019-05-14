import React, { useState } from "react"
import Button from "Components/button"
import Dialog from "Components/dialog"
import * as Api from "./../../api"

const consumerDetails = ({ ottpId, name, dob, address, isVerified }) => {

  const [showModal, setShowModal] = useState(false)

  const mountModal = () => {
    setShowModal(true)
  }

  const unmountModal = () => {
    setShowModal(false)
  }

  const resendOtp = () => {
    setShowModal(false)
    Api.resendOtp({
      ottp_id: ottpId
    })
      .then((response) => {
        window.location = location.href
      })
      .catch((err) => {
        console.log("Error in resending otp", err)
      })
  }
  return (
    <React.Fragment>
      <div className="card">
        <h4>Consumer Details</h4>
        <div className="item">
          <p className="label">Name</p>
          <p className="value">{name}</p>
        </div>
        <div className="item">
          <p className="label">Date of Birth</p>
          <p className="value">{dob}</p>
        </div>
        <div className="item">
          <p className="label">Address</p>
          <p className="value">{address}</p>
        </div>
        <div className="row">
          <div className="item">
            <p className="label">OTP Status</p>
            <p className="value">Sent | {isVerified ? "Verified" : "Verification Pending"}</p>
          </div>
          <Button danger onClick={mountModal}>Resend OTP</Button>
        </div>
      </div>
      {
        showModal &&
        <Dialog
          title="Are you sure to resend OTP?"
          onClick={unmountModal}
          actions={[
            <Button onClick={unmountModal} secondary>
              No
            </Button>,
            <Button onClick={resendOtp} primary>
              Yes
            </Button>
          ]}
        />
      }
    </React.Fragment>
  )
}

export default consumerDetails