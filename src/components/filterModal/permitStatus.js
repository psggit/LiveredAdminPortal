import React from "react"
import Label from "../label"
import Select from "../select"

class PermitStatus extends React.Component {
  constructor() {
    super()

    this.state = {
      permitStatus: {
        filterby: "",
        value: ""
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
    console.log("target", e.target.value, "permitStatus", this.props.permitStatus)
    this.setState({
      permitStatus: {
        filterby: e.target.name,
        value: this.props.permitStatus.find(item => item.value === parseInt(value)).text
      }
    })
  }

  render() {
    return (
      <div className="permit-status input-field">
        <Label>
          Permit Status
        </Label>
        <Select
          options={this.props.permitStatus}
          name="Permit Status"
          onChange={e => this.handleChange(e)}
        />
      </div>
    )
  }
}

export default PermitStatus