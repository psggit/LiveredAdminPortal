import React, { useState } from "react"
import Button from "Components/button"
import Dialog from "Components/dialog"
import Select from "Components/select"
import Icon from "Components/icon"
import * as Api from "./../../api"

const orderDetails = ({ ottpId, orderStatus, orders }) => {

  const [showModal, setShowModal] = useState(false)
  const [changingOrderStatus, setChangingOrderStatus] = useState(false)
  const [selectedOrderStatusIdx, setOrderStatus] = useState(-1)

  const orderStatusOptions = [
    { text: "Order has been delivered", value: 1 },
    { text: "Order has not been delivered", value: 2 },
    { text: "Order has been sent out for delivery", value: 3 }
  ]
  const mountModal = () => {
    setShowModal(true)
  }
  const unmountModal = () => {
    setShowModal(false)
  }
  const handleChange = (e) => {
    setOrderStatus(e.target.value)
  }

  const changeOrderStatus = () => {
    let status;
    if (parseInt(selectedOrderStatusIdx) === 1) {
      status = "closed"
    } else {
      status = "ongoing"
    }
    setChangingOrderStatus(true)
    Api.changeOrderStatus({
      ottp_info: {
        ottp_id: ottpId,
        status
      },
      changed_by: "admin",
      reason: orderStatusOptions.find((item) => item.value === parseInt(selectedOrderStatusIdx)).text
    })
      .then((response) => {
        setShowModal(false)
        setChangingOrderStatus(false)
        window.location = location.href
      })
      .catch((err) => {
        setChangingOrderStatus(false)
        console.log("Error in changing order status", err)
      })
  }
  return (
    <React.Fragment>
      <div className="card">
        <h4>Order Details</h4>
        <div className="row">
          <div className="item">
            <div className="icon">
              <span className="label"> Order Status</span>
              <span className="info" style={{ position: "relative" }}>
                <Icon name="info" />
                <span className="tooltip-text">
                  Status of the order updated by the delivery operator. Can be manually updated here if required
              </span>
              </span>
            </div>
            <p className="value">{orderStatus}</p>
          </div>
          {
            orderStatus === "ongoing" &&
            <Button danger onClick={mountModal}>Change Order Status</Button>
          }
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
      {
        showModal &&
        <Dialog
          title="Change order status"
          subtitle="Choose current order status"
          onClick={unmountModal}
          actions={[
            <Button disabled={changingOrderStatus} onClick={() => unMountModal()} secondary>
              No
              </Button>,
            <Button disabled={changingOrderStatus} onClick={() => changeOrderStatus()} primary>
              Yes
            </Button>
          ]}
        >
          <div style={{ margin: '20px 0' }}>
            <Select
              options={orderStatusOptions}
              name="orderStatus"
              large
              placeholder="order status"
              onChange={e => handleChange(e)}
              value={selectedOrderStatusIdx}
            />
          </div>
        </Dialog>
      }
    </React.Fragment>
  )
}

export default orderDetails