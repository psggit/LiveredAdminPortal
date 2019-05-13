import React from "react"

const deliveryAgentDetails = (deliveryAgentDetails) => {
  return (
    <div className="card">
      <h4>Delivery Agent Details</h4>
      <div className="item">
        <p className="label">Name</p>
        <p className="value">{deliveryAgentDetails.name}</p>
      </div>
      <div className="item">
        <p className="label">Phone Number</p>
        <p className="value">{deliveryAgentDetails.phoneNumber}</p>
      </div>
      <div className="item">
        <p className="label">Verified With</p>
        <p className="value">{deliveryAgentDetails.verificationDoc}</p>
      </div>
      <div className="item">
        <p className="label">Vehicle License Number</p>
        <p className="value">{deliveryAgentDetails.vehicleNumber}</p>
      </div>
      <div className="item">
        <p className="label">Driver's License Number</p>
        <p className="value">{deliveryAgentDetails.licenseNumber}</p>
      </div>
    </div>
  )
}

export default deliveryAgentDetails