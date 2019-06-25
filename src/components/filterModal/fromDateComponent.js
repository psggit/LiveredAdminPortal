import React from "react"
import Label from "../label"
import Icon from "../icon"
import Moment from "moment"

class FromDate extends React.Component {
  constructor() {
    super()

    this.state = {
      fromDate: {
        filterby: "",
        value: ""
      }
    }

    this.handleChange = this.handleChange.bind(this)
    this.getData = this.getData.bind(this)
    this.reset = this.reset.bind(this)
    this.setDefaultValue = this.setDefaultValue.bind(this)
  }

  setDefaultValue(value) {
    console.log("value", value)
    this.setState({
      fromDate: { ...this.state.fromDate, value }
    })
  }

  getData() {
    return this.state
  }

  reset() {
    this.setState({
      fromDate: { ...this.state.fromDate, value: "" }
    })
  }

  handleChange(e) {
    //const value = e.target.value
    this.setState({
      fromDate: {
        filterby: "From",
        value: e.target.value
      }
    })
  }

  render() {
    return (
      <div style={{ position: 'relative' }} className="input-field">
        <span className="calendar-icon">
          <Icon name="calendar" />
        </span>
        <Label>
          From
        </Label>
        <input
          type="date"
          max="9999-12-31"
          name="fromDate"
          onChange={this.handleChange}
          value={this.props.fromDate ? this.props.fromDate : this.state.fromDate.value}
        />
      </div>
    )
  }
}

export default FromDate