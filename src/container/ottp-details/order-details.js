import React from "react"

const orderDetails = ({ orderStatus, orders }) => {
  return (
    <div className="card">
      <h4>Order Details</h4>
      <div className="item">
        <p className="label">Order Status</p>
        <p className="value">{orderStatus}</p>
      </div>
      <div className="item">
        <p className="label">Order Log</p>
        <table>
          <thead>
            <tr>
              <td>No.</td>
              <td>Name</td>
              <td>Qty</td>
              <td>Volume (ml)</td>
              <td>Amount</td>
            </tr>
          </thead>
          <tbody>
            {
              orders.items.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.count}</td>
                    <td>{item.volume}</td>
                    <td>{item.price}</td>
                  </tr>
                )
              })
            }
            <tr>
              <td></td>
              <td>Total</td>
              <td></td>
              <td>{orders.total_volume}</td>
              <td>{orders.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default orderDetails