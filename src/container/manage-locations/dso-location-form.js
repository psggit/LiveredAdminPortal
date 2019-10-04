import React from "react"
import TitleBarAndSave from "Components/titlebarAndSave"
import Label from "Components/label"
import DataTable from "Components/table/custom-table"
import Icon from "Components/icon"
import Button from "Components/button"
import Select from "Components/select"
import MultiSelect from "Components/multiselect"
import { fetchStateAndCitiesList } from "./../../api"
import TextInput from "Components/textInput"
import { getQueryObjByName } from "Utils/url-utils"
import * as Api from "../../api"

class DsoLocationForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dsoLocationDetails: [],
      stateList: [],
      cityList: [],
      stateMap: {},
      deliverableCityList: [],
      selectedStateIdx: -1,
      selectedCityIdx: -1,
      selectedRegionalCityIdx: -1,
      regionalOfficeCity: "",
      regionalOfficeAddress: "",
      deliveryStatus: true,
      editLocation: false,
      name: "",
      email: "",
      phone: "",
      subTitle: "Add State to DSO",
      showAddStateToDsoForm: false
    }

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
    this.getData = this.getData.bind(this)
    this.setShowAddLocation = this.setShowAddLocation.bind(this)
    this.formatResponse = this.formatResponse.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
    this.handleCityChange = this.handleCityChange.bind(this)
    this.handleRowClick = this.handleRowClick.bind(this)
    this.handleRegionalOfficeCityChange = this.handleRegionalOfficeCityChange.bind(this)
    this.updateCityList = this.updateCityList.bind(this)
    this.toggleDeliveryStatus = this.toggleDeliveryStatus.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    if (this.props.enableEdit) {
      this.fetchCityAndStates()
    }

    if (this.props.action !== "create") {
      this.fetchDsoDetails({
        dso_id: getQueryObjByName("id")
      })
    }
  }

  fetchDsoDetails(payload) {
    Api.fetchDsoDetails(payload)
      .then((response) => {
        this.setState({
          dsoLocationDetails: response.dso.state_details,
        })
      })
      .catch((err) => {
        console.log("Error in fetching dso details", err)
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
    this.setState({ cityList, selectedRegionalCityIdx: cityList[0].value })
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
      stateMap: response.stateCity,
      selectedStateIdx: stateList[0].value
    })
    this.updateCityList(parseInt(stateList[0].value))
  }

  getData() {
    return this
  }

  handleRegionalOfficeCityChange(e) {
    this.setState({
      selectedRegionalCityIdx: parseInt(e.target.value)
    })
  }

  handleStateChange(e) {
    this.setState({
      selectedStateIdx: parseInt(e.target.value)
    })
    this.updateCityList(parseInt(e.target.value))
  }

  handleCityChange(e) {
    this.setState({
      selectedCityIdx: parseInt(e.target.value)
    })
  }

  toggleDeliveryStatus() {
    this.setState({
      deliveryStatus: !this.state.deliveryStatus
    })
  }

  handleSave() {
    // if (this.props.enableEdit) {
    //   this.setState({
    //     regionalOfficeCity: this.state.selectedRegionalCityIdx,
    //     name: this.name.state.value,
    //     email: this.email.state.value,
    //     phone: this.phone.state.value
    //   }, () => {
    //     this.props.handleClick()
    //   })
    // } else {
    // console.log("hand props", this.props)
    if (!this.state.editLocation) {
      this.props.handleClick()
    } else {
      this.props.handleUpdate()
    }
    //}
  }

  handleSubmit(e) {
    e.preventDefault()
    this.handleSave()
    //this.props.handleClick()
  }

  handleRowClick(item) {
    this.setState({
      subTitle: "Edit Location",
      showAddStateToDsoForm: true,
      editLocation: true,
      selectedStateIdx: parseInt(item.state_id),
      selectedRegionalCityIdx: item.reg_office_city_id,
      deliveryStatus: item.service_status,
      regionalOfficeCity: item.reg_office_city,
      regionalOfficeAddress: item.reg_office_address,
      name: item.reg_office_contact_name,
      email: item.reg_office_contact_email,
      phone: item.reg_office_contact_phone,
      cityList: this.state.stateMap[item.state_id].cities.map((item) => { return { text: item.city_name, value: item.city_id } }),
      deliverableCityList: item.city_list ? item.city_list.trim().length > 0 ? item.city_list.trim().substring(0, item.city_list.length - 2).split(",").map((item) => item.trim()) : "" : ""
    })
  }

  handleTextFieldChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  setShowAddLocation() {
    this.setState({
      showAddStateToDsoForm: true
    })
  }

  render() {
    const { showAddStateToDsoForm, subTitle, editLocation } = this.state
    return (
      <React.Fragment>
        <div style={{ marginTop: '50px' }}>
          <DataTable
            loadingData={false}
            message="No states added"
            headings={[
              { title: "State", icon: "", tooltipText: "" },
              { title: "Cities", icon: "", tooltipText: "" },
              { title: "Regional Office (City)", icon: "", tooltipText: "" },
              { title: "Address", icon: "", tooltipText: "" },
              { title: "Primary Contact", icon: "", tooltipText: "" },
              { title: "", icon: "", tooltipText: "" },
            ]}
          >
            {
              this.state.dsoLocationDetails.length > 0 &&
              this.state.dsoLocationDetails.map((item, i) => {
                return (
                  <tr
                    key={i}
                    className={`${this.props.enableEdit ? 'clickable' : undefined} ${this.state.selectedStateIdx === item.state_id ? 'highlight' : ''}`}
                    onClick={this.props.action === "edit" ? () => this.handleRowClick(item) : () => { }}
                  >
                    <td>{item.state_name}</td>
                    <td>{item.city_list ? item.city_list.substring(0, (item.city_list.length - 1)) : ""}</td>
                    <td>{item.reg_office_city}</td>
                    <td>{item.reg_office_address}</td>
                    <td>{item.reg_office_contact_phone}</td>
                    <td>
                      {this.props.enableEdit ? <a>Edit</a> : ""}
                    </td>
                  </tr>
                )
              })
            }
          </DataTable>

          <form onSubmit={this.handleSubmit}>
            <TitleBarAndSave
              title={this.props.action !== "view"
                ? this.props.action === "create" ? "Add Location Details" : "Edit Location Details"
                : "Location Details"}
              enableEdit={this.props.enableEdit}
              handleCancel={this.props.handleCancel}
              disableBtn={this.props.updatingDsoLocationDetails || this.props.creatingDsoLocationDetails}
            />
            {
              this.props.enableEdit &&
              <React.Fragment>
                <div className="item" style={{ borderBottom: showAddStateToDsoForm ? '1px solid #e2e5e8' : undefined }}>
                  <div className="item" style={{ cursor: 'pointer' }} onClick={this.setShowAddLocation}>
                    <div className="icon">
                      {
                        this.state.deliverableCityList.length === 0 &&
                        <span><Icon name="addIcon" /></span>
                      }
                      <Label>{subTitle}</Label>
                    </div>
                  </div>
                  {
                    showAddStateToDsoForm &&
                    <React.Fragment>
                      <Select
                        options={this.state.stateList}
                        name="State"
                        placeholder="state"
                        onChange={e => this.handleStateChange(e)}
                        value={this.state.selectedStateIdx}
                        disabled={this.state.deliverableCityList.length > 0}
                      />
                      <div className="item">
                        <Label
                          icon="info"
                          tooltipText="Minimum legal age limit to place an order"
                        >
                          Delivery Status
                        </Label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {
                            this.state.deliveryStatus
                              ? <span style={{ marginRight: '10px' }} onClick={this.props.enableEdit ? () => this.toggleDeliveryStatus() : () => { }}>
                                <Icon name="toggleGreen" />
                              </span>
                              : <span style={{ marginRight: '10px' }} onClick={this.props.enableEdit ? () => this.toggleDeliveryStatus() : () => { }}>
                                <Icon name="toggleRed" />
                              </span>
                          }
                          <span
                            onClick={this.props.enableEdit ? () => this.toggleDeliveryStatus() : () => { }}
                            style={{ cursor: this.props.enableEdit ? 'pointer' : 'default' }}
                          >
                            {this.state.deliveryStatus ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: '50%' }}>
                          <p className="header">Regional Office</p>
                          <div className="item">
                            <Label>City</Label>
                            <Select
                              options={this.state.cityList}
                              name="regionalOfficeCity"
                              placeholder="city"
                              onChange={e => this.handleRegionalOfficeCityChange(e)}
                              value={this.state.selectedRegionalCityIdx}
                              disabled={!this.props.enableEdit}
                            />
                          </div>
                          <div className="item">
                            <Label>Address</Label>
                            <textarea
                              name="regionalOfficeAddress"
                              style={{ width: '260px' }}
                              rows={4}
                              value={this.state.regionalOfficeAddress}
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
                              placeholder="name"
                              defaultValue={this.state.name}
                              disabled={!this.props.enableEdit}
                              errorMessage="Name is invalid"
                              emptyMessage="Name is required"
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
                              disabled={!this.props.enableEdit}
                              errorMessage="Email is invalid"
                              emptyMessage="Email is required"
                            />
                          </div>
                          <div className="item">
                            <Label>Phone</Label>
                            <TextInput
                              ref={input => (this.phone = input)}
                              name="phone"
                              pattern="[0-9]*"
                              maxLength={10}
                              isRequired={true}
                              placeholder="phone"
                              defaultValue={this.state.phone}
                              disabled={!this.props.enableEdit}
                              errorMessage="Phone is invalid"
                              emptyMessage="Phone is required"
                            />
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  }
                </div>
                {
                  showAddStateToDsoForm &&
                  <React.Fragment>
                    <div className="item">
                      <div className="icon">
                        <span><Icon name="addIcon" /></span>
                        <Label>Add/Edit cities</Label>
                      </div>
                      <MultiSelect
                        options={this.state.cityList}
                        name="City"
                        multiple
                        placeholder="Please choose city"
                        selectedValues={this.state.deliverableCityList}
                        onChange={e => this.handleCityChange(e)}
                        //value={this.state.selectedCityIdx}
                        addOption={this.props.addCityToDso}
                        removeOption={this.props.removeCityToDso}
                      />
                    </div>
                    {/* <div style={{ marginTop: '20px' }}>
                      <Button
                        secondary
                        onClick={() => this.handleSave()}
                        disabled={this.props.updatingDsoLocationDetails || this.props.creatingDsoLocationDetails}
                      >
                        {
                          editLocation ? 'Update' : 'Add State'
                        }
                      </Button>
                    </div> */}
                  </React.Fragment>
                }
              </React.Fragment>
            }
          </form>
        </div>
      </React.Fragment>
    )
  }
}

export default DsoLocationForm