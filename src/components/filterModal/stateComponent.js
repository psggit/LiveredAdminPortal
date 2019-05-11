import React from "react"
import Label from "../label"
import Select from "../select"
import * as Api from "./../../api"

class State extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      stateObj: {
        filterby: "",
        value: "",
        idx: props && props.selectedStateIdx ? props.selectedStateIdx : "",
        stateName: ""
      },
      stateList: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.getData = this.getData.bind(this)
    this.fetchStateAndCitiesList = this.fetchStateAndCitiesList.bind(this)
    this.formatResponse = this.formatResponse.bind(this)
  }

  componentDidMount() {
    this.fetchStateAndCitiesList()
  }

  fetchStateAndCitiesList() {
    Api.fetchStateAndCitiesList({})
      .then((response) => {
        this.formatResponse(response)
      })
      .catch((err) => {
        console.log("Error in fetching state and city list", err)
      })
  }

  formatResponse(response) {
    let stateList = response.states.map((item) => {
      return {
        text: item.state_name,
        value: item.id
      }
    })
    stateList = [...stateList, { text: "All", value: stateList.length + 1 }]

    this.setState({ stateList })
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
        stateName: this.state.stateList.find(item => item.value === parseInt(value)).text
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
          options={this.state.stateList ? this.state.stateList : []}
          name="State"
          onChange={e => this.handleChange(e)}
          value={this.state.stateObj.idx}
        />
      </div>
    )
  }
}

export default State