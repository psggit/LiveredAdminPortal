import React from "react"

const consumerDetails = ({ name, dob, address, isVerified }) => {
  return (
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
      <div className="item">
        <p className="label">OTP Status</p>
        <p className="value">Sent | {isVerified ? "Verified" : "Verification Pending"}</p>
      </div>
    </div>
  )
}

export default consumerDetails