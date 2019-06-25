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
        idx: props && props.selectedDeliveryStatusIdx ? props.selectedDeliveryStatusIdx : -1
      }
    }

    this.handleChange = this.handleChange.bind(this)
    this.getData = this.getData.bind(this)
    this.reset = this.reset.bind(this)
    this.setDefaultValue = this.setDefaultValue.bind(this)
  }

  getData() {
    return this.state
  }

  reset() {
    this.setState({ deliveryStatus: { ...this.state.deliveryStatus, idx: -1 } })
  }

  handleChange(e) {
    const value = e.target.value
    this.setState({
      deliveryStatus: {
        filterby: e.target.name,
        idx: e.target.value,
        value: deliveryStatus.find(item => item.value === parseInt(value)).text === "Enabled"
          ? "true"
          : "false"
      }
    })
  }

  setDefaultValue(value) {
    console.log("value", value)
    this.setState({
      deliveryStatus: { ...this.state.deliveryStatus, idx: value }
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