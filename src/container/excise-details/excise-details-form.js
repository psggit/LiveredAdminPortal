import React from "react"
import "Sass/wrapper.scss"
import Label from "Components/label"
import Icon from "Components/icon"
import TextInput from "Components/textInput"
import TitleBarAndSave from "Components/titlebarAndSave"
import Select from "Components/select"
import { fetchStateAndCitiesList } from "./../../api"
import { getQueryObjByName } from "Utils/url-utils"
import * as Api from "../../api"

class ExciseDetailsForm extends React.Component {
  constructor() {
    super()
    this.state = {
      exciseName: "",
      selectedCityIdx: -1,
      selectedStateIdx: -1,
      cityList: [],
      stateList: [],
      stateMap: {},
      headOfficeAddress: "",
      name: "",
      email: "",
      phone: ""
    }

    this.handleSave = this.handleSave.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getData = this.getData.bind(this)
    this.handleCityChange = this.handleCityChange.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
    this.fetchCityAndStates = this.fetchCityAndStates.bind(this)
    this.updateCityList = this.updateCityList.bind(this)
    this.formatResponse = this.formatResponse.bind(this)
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
  }

  componentDidMount() {
    // on edit/view fetch state and city list after fetching excise details
    if (this.props.action !== "create") {
      this.fetchExciseDetails({
        state_id: parseInt(getQueryObjByName("stateId"))
      })
    } else { //on create fetch state and city list
      this.fetchCityAndStates()
    }
  }

  fetchExciseDetails(payload) {
    Api.fetchExciseDetails(payload)
      .then((response) => {
        const data = response.excise
        this.setState({
          selectedCityIdx: data.head_office_city_id,
          selectedStateIdx: data.state_id,
          exciseName: data.name,
          headOfficeAddress: data.head_office_address,
          name: data.primary_contact_name,
          email: data.primary_contact_email,
          phone: data.primary_contact_phone
        })
        this.fetchCityAndStates()
      })
      .catch((err) => {
        console.log("Error in fetching excise details", err)
      })
  }

  fetchCityAndStates() {
    fetchStateAndCitiesList()
      .then((response) => {
        this.formatResponse(response)
      })
      .catch((err) => {
        console.log("Error in fetching state and cities")
      })
  }

  updateCityList(stateId) {
    let cityList = this.state.stateMap[stateId].cities
    cityList = cityList.map((item) => {
      return {
        text: item.city_name,
        value: item.city_id
      }
    })
    if (this.state.selectedCityIdx === -1) {
      this.setState({ cityList, selectedCityIdx: cityList[0].value })
    } else {
      this.setState({ cityList })
    }
  }

  formatResponse(response) {
    const stateList = response.states.map((item) => {
      return {
        text: item.state_name,
        value: item.id
      }
    })

    this.setState({
      stateList,
      stateMap: response.stateCity
    })
    if (this.state.selectedStateIdx === -1) {
      this.setState({ selectedStateIdx: stateList[0].value })
      this.updateCityList(stateList[0].value)
    } else {
      this.updateCityList(this.state.selectedStateIdx)
    }
  }

  handleStateChange(e) {
    this.setState({
      selectedStateIdx: parseInt(e.target.value),
      selectedCityIdx: -1
    }, () => {
      this.updateCityList(this.state.selectedStateIdx)
    })
  }

  handleCityChange(e) {
    this.setState({
      selectedCityIdx: parseInt(e.target.value)
    })
  }

  handleTextFieldChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  getData() {
    return this.state
  }

  handleSubmit(e) {
    e.preventDefault()
    this.handleSave()
  }

  handleSave() {
    if (location.pathname.indexOf("create-details") !== -1) {
      this.setState({
        exciseName: this.exciseName.state.value,
        name: this.name.state.value,
        email: this.email.state.value,
        phone: this.phone.state.value
      }, () => {
        this.props.handleClick()
      })
    } else {
      this.props.handleClick()
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="content-section" style={{ marginTop: '50px' }}>
          <form onSubmit={this.handleSubmit}>
            <TitleBarAndSave
              title={this.props.action !== "view"
                ? this.props.action === "create" ? "Add Details" : "Edit Details"
                : "Details"}
              enableEdit={this.props.enableEdit}
              //handleClick={this.handleSave}
              handleCancel={this.props.handleCancel}
              disableBtn={this.props.updatingExciseDetails || this.props.creatingExciseDetails}
            />
            <div>
              <div className="item">
                <Label>State</Label>
                <Select
                  options={this.state.stateList}
                  name="selectedStateIdx"
                  placeholder="state"
                  onChange={e => this.handleStateChange(e)}
                  value={this.state.selectedStateIdx}
                  disabled={this.props.action !== "create"}
                />
              </div>

              <div className="item">
                <Label>Name</Label>
                <TextInput
                  ref={input => (this.exciseName = input)}
                  name="exciseName"
                  defaultValue={this.state.exciseName}
                  pattern="^[^-\s][a-zA-Z0-9_\s-]+$"
                  isRequired={true}
                  //autoComplete={false}
                  placeholder="excise name"
                  disabled={!this.props.enableEdit}
                  errorMessage="Excise name is invalid"
                  emptyMessage="Excise name is required"
                />
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '50%' }}>
                <p className="header">Headquarters</p>
                <div className="item">
                  <Label>City</Label>
                  <Select
                    options={this.state.cityList}
                    name="headOfficeCity"
                    placeholder="city"
                    onChange={e => this.handleCityChange(e)}
                    value={this.state.selectedCityIdx}
                    disabled={!this.props.enableEdit}
                  />
                </div>
                <div className="item">
                  <Label>Address</Label>
                  <textarea
                    name="headOfficeAddress"
                    style={{ width: '300px' }}
                    rows={4}
                    value={this.state.headOfficeAddress}
                    onChange={this.handleTextFieldChange}
                    disabled={!this.props.enableEdit}
                  />
                </div>
              </div>
              <div style={{ width: '50%' }}>
                <p className="header">Primary Contact</p>
                <div className="item">
                  <Label>Name</Label>
                  <TextInput
                    ref={input => (this.name = input)}
                    name="name"
                    pattern="^[^-\s][a-zA-Z0-9_\s-]+$"
                    isRequired={true}
                    defaultValue={this.state.name}
                    placeholder="name"
                    errorMessage="Name is invalid"
                    emptyMessage="Name is required"
                    disabled={!this.props.enableEdit}
                  />
                </div>
                <div className="item">
                  <Label>Email Address</Label>
                  <TextInput
                    ref={input => (this.email = input)}
                    name="email"
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    isRequired={true}
                    placeholder="email"
                    defaultValue={this.state.email}
                    errorMessage="Email is invalid"
                    emptyMessage="Email is required"
                    disabled={!this.props.enableEdit}
                  />
                </div>
                <div className="item">
                  <Label>Phone</Label>
                  <TextInput
                    ref={input => (this.phone = input)}
                    name="phone"
                    pattern="[0-9]*"
                    isRequired={true}
                    placeholder="phone"
                    defaultValue={this.state.phone}
                    disabled={!this.props.enableEdit}
                    maxLength={10}
                    errorMessage="Phone is invalid"
                    emptyMessage="Phone is required"
                    disabled={!this.props.enableEdit}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    )
  }
}

export default ExciseDetailsForm