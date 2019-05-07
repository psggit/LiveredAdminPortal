import React from "react"
import Label from "../label"
import Select from "../select"

class DeliveryOperator extends React.Component {
  constructor() {
    super()

    this.state = {
      dso: {
        filterby: "",
        value: "",
        idx: ""
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
      dso: {
        filterby: e.target.name,
        value: this.props.dsoList.find(item => item.value === parseInt(value)).text,
        idx: e.target.value
      }
    })
  }

  render() {
    console.log("selected dso index", this.props.selectedDsoIdx)
    return(
      <div className="delivery-operator input-field">
        <Label>
          Delivery Operator
        </Label>
        <Select 
          options={this.props.dsoList}
          name="Delivery Operator" 
          onChange={e => this.handleChange(e)} 
          value={this.props.selectedDsoIdx}
        />
      </div>
    )
  }
}

export default DeliveryOperator