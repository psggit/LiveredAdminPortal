import React from "react"

const dsoDetails = ({ dsoName, retailerName, retailerAddress }) => {
  console.log("data", dsoDetails.data)
  return (
    <div className="card">
      <h4>Delivery Service Operator Details</h4>
      <div className="item">
        <p className="label">DSO Name</p>
        <p className="value">{dsoName}</p>
      </div>
      <div className="item">
        <p className="label">Retailer Source</p>
        <p className="value">{retailerName}</p>
      </div>
      <div className="item">
        <p className="label">Retailer Source</p>
        <p className="value">{retailerAddress}</p>
      </div>
    </div>
  )
}

export default dsoDetails