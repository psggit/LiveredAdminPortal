import React from "react"

const dsoDetails = (data) => {
  return (
    <div className="card">
      <div className="item">
        <p className="label">DSO Name</p>
        <p className="value">{data.name}</p>
      </div>
    </div>
  )
}

export default dsoDetails