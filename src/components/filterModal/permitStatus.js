import React from "react"
import Label from "../label"
import Select from "../select"

const permitStatus = [
  { text: 'ONGOING', value: 1 },
  { text: 'CLOSED', value: 2 },
]

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
    console.log("target", e.target.value, "permitStatus", permitStatus)
    this.setState({
      permitStatus: {
        filterby: e.target.name,
        idx: e.target.value,
        value: permitStatus.find(item => item.value === parseInt(value)).text
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
          options={permitStatus}
          name="Permit Status"
          onChange={e => this.handleChange(e)}
        />
      </div>
    )
  }
}

export default PermitStatus