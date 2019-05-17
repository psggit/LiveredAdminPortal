import React, { useState } from "react"
import Button from "Components/button"
import Dialog from "Components/dialog"
import * as Api from "./../../api"

const consumerDetails = ({ orderStatus, ottpId, name, dob, address, isVerified }) => {

  const [showResendOtpModal, setShowResendOtpModal] = useState(false)
  const [showSuccessOtpModal, setShowSuccessOtpModal] = useState(false)
  const [resendingOtp, setResendingOtp] = useState(false)

  const mountModal = (modalName) => {
    const showModalFn = eval(`setShow${modalName}Modal`)
    showModalFn(true)
  }

  const unmountModal = (modalName) => {
    const showModalFn = eval(`setShow${modalName}Modal`)
    showModalFn(false)
  }

  const resendOtp = () => {
    setResendingOtp(true)
    Api.resendOtp({
      ottp_id: ottpId
    })
      .then((response) => {
        setShowResendOtpModal(false)
        setShowSuccessOtpModal(true)
        setResendingOtp(false)
        // window.location = location.href
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
          {
            orderStatus === "ongoing" &&
            <Button primary onClick={() => mountModal("ResendOtp")}>Resend OTP</Button>
          }
        </div>
      </div>
      {
        showResendOtpModal &&
        <Dialog
          title="Are you sure to resend OTP?"
          onClick={() => unmountModal("ResendOtp")}
          actions={[
            <Button onClick={() => unmountModal("ResendOtp")} secondary>
              No
            </Button>,
            <Button onClick={resendOtp} disabled={resendingOtp} primary>
              Yes
            </Button>
          ]}
        />
      }
      {
        showSuccessOtpModal &&
        <Dialog
          title="OTP has been resent successfully"
          onClick={() => unmountModal("SuccessOtp")}
          actions={[
            <Button onClick={() => unmountModal("SuccessOtp")} primary>
              Done
            </Button>
          ]}
        />
      }
    </React.Fragment>
  )
}

export default consumerDetails