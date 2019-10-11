import React from "react"
import Label from "../label"
import Select from "./../select"
import * as Api from "./../../api"

class City extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      city: {
        filterby: "",
        value: "",
        cityName: "",
        idx: props && props.selectedCityIdx ? props.selectedCityIdx : -1
      },
      cityList: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.getData = this.getData.bind(this)
    this.fetchStateAndCitiesList = this.fetchStateAndCitiesList.bind(this)
    this.formatResponse = this.formatResponse.bind(this)
    this.reset = this.reset.bind(this)
    this.setDefaultValue = this.setDefaultValue.bind(this)
  }

  componentDidMount() {
    this.fetchStateAndCitiesList()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedCityIdx !== this.props.selectedCityIdx) {
      this.setState({
        city: { ...this.state.city, idx: this.props.selectedCityIdx ? this.props.selectedCityIdx : 0 }
      })
    }
  }

  reset() {
    this.setState({ city: { ...this.state.city, idx: -1 } })
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
    let cityList = response.cities.map((item) => {
      return {
        text: item.city_name,
        value: item.city_id,
        stateId: item.StateId
      }
    })
    cityList = [...cityList, { text: "All", value: cityList.length + 1 }]
    this.setState({ cityList })
  }

  setDefaultValue(value) {
    this.setState({
      city: { ...this.state.city, idx: value }
    })
  }

  getData() {
    return this.state
  }

  handleChange(e) {
    const value = e.target.value
    this.setState({
      city: {
        filterby: e.target.name,
        value: this.state.cityList.find(item => item.value === parseInt(value)).text,
        idx: (e.target.value),
        cityName: this.state.cityList.find(item => item.value === parseInt(value)).text
      }
    })
  }

  render() {
    return (
      <div className="city input-field">
        <Label>
          City/Town
        </Label>
        <Select
          options={this.state.cityList ? this.state.cityList : []}
          name="City"
          placeholder="City"
          onChange={this.handleChange}
          value={this.state.city.idx ? parseInt(this.state.city.idx) : ""}
        />
      </div>
    )
  }
}

export default City