import React from "react"
import Label from "../label"
import Select from "../select"

class State extends React.Component {
  constructor() {
    super()

    this.state = {
      stateObj: {
        filterby: "",
        value: "",
        idx: "",
        stateName: ""
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
      stateObj: {
        filterby: e.target.name,
        value: e.target.value,
        idx: e.target.value,
        stateName: this.props.stateList.find(item => item.value === parseInt(value)).text
      }
    })
  }

  render() {
    return (
      <div className="state input-field">
        <Label>
          State
        </Label>
        <Select
          options={this.props.stateList}
          name="State"
          onChange={e => this.handleChange(e)}
          value={this.props.selectedStateIdx}
        />
      </div>
    )
  }
}

export default State