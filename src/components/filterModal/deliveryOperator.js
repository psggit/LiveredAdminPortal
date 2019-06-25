import React from "react"
import Label from "../label"
import Select from "../select"
import * as Api from "./../../api"

class DeliveryOperator extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dso: {
        filterby: "",
        value: "",
        idx: props && props.selectedDsoIdx ? props.selectedDsoIdx : -1
      }
    }

    this.handleChange = this.handleChange.bind(this)
    this.fetchDSOList = this.fetchDSOList.bind(this)
    this.getData = this.getData.bind(this)
    this.reset = this.reset.bind(this)
    this.setDefaultValue = this.setDefaultValue.bind(this)
  }

  componentDidMount() {
    this.fetchDSOList({
      limit: 10000,
      offset: 0
    })
  }

  fetchDSOList(payload) {
    Api.fetchDSOList(payload)
      .then((response) => {
        let dsoList = response.dso.map((item, i) => {
          return { text: item.dso_name, value: i, dso_id: item.dso_id }
        })
        dsoList = [...dsoList, { text: "All", value: dsoList.length }]
        this.setState({ dsoList })
      })
      .catch((err) => {
        console.log("Error in fetching dso list", err)
      })
  }


  getData() {
    return this.state
  }

  reset() {
    this.setState({ dso: { ...this.state.dso, idx: -1 } })
  }

  setDefaultValue(value) {
    console.log("value", value)
    this.setState({
      dso: { ...this.state.dso, idx: value }
    })
  }

  handleChange(e) {
    const value = e.target.value
    this.setState({
      dso: {
        filterby: e.target.name,
        value: this.state.dsoList.find(item => item.value === parseInt(value)).text,
        dso_id: this.state.dsoList.find(item => item.value === parseInt(value)).dso_id,
        idx: parseInt(this.state.dsoList.find(item => item.value === parseInt(value)).value)
      }
    })
  }

  render() {
    return (
      <div className="delivery-operator input-field">
        <Label>
          Delivery Operator
        </Label>
        {
          <Select
            options={this.state.dsoList ? this.state.dsoList : []}
            name="Delivery Operator"
            placeholder="Delivery Operator"
            onChange={e => this.handleChange(e)}
            value={this.state.dso.idx}
          />
        }
      </div>
    )
  }
}

export default DeliveryOperator