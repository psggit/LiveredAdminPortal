import React from "react"
import Label from "../label"
import Select from "../select"

const deliveryStatus = [
  { text: 'Enabled', value: 1 },
  { text: 'Disabled', value: 2 },
]

class DeliveryStatus extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      deliveryStatus: {
        filterby: "",
        value: "",
        idx: props && props.selectedDeliveryStatusIdx ? props.selectedDeliveryStatusIdx : ""
      }
    }

    this.handleChange = this.handleChange.bind(this)
    this.getData = this.getData.bind(this)
  }

  getData() {
    return this.state
  }

  handleChange(e) {
    const value = e.target.value
    this.setState({
      deliveryStatus: {
        filterby: e.target.name,
        idx: e.target.value,
        value: deliveryStatus.find(item => item.value === parseInt(value)).text === "Active"
          ? "true"
          : "false"
      }
    })
  }

  render() {
    return (
      <div className="delivery-status input-field">
        <Label>
          Delivery Status
        </Label>
        <Select
          options={deliveryStatus}
          name="Delivery Status"
          placeholder="Delivery Status"
          onChange={e => this.handleChange(e)}
          value={this.state.deliveryStatus.idx}
        />
      </div>
    )
  }
}

export default DeliveryStatus