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
        idx: props && props.selectedDsoIdx ? props.selectedDsoIdx : ""
      }
    }

    this.handleChange = this.handleChange.bind(this)
    this.fetchDSOList = this.fetchDSOList.bind(this)
    this.getData = this.getData.bind(this)
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

  handleChange(e) {
    const value = e.target.value
    console.log("dso", this.state.dsoList, value)
    this.setState({
      dso: {
        filterby: e.target.name,
        value: this.state.dsoList.find(item => item.value === parseInt(value)).dso_id,
        idx: this.state.dsoList.find(item => item.value === parseInt(value)).value
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