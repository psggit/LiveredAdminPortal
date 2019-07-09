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

class DsoDetailsForm extends React.Component {
  constructor() {
    super()
    this.state = {
      dsoName: "",
      entityType: "",
      licenseType: "",
      licenseStatus: "",
      licenseExpiry: "",
      selectedCityIdx: -1,
      cityList: [],
      headOfficeAddress: "",
      name: "",
      email: "",
      phone: "",
      deliveryStatus: true,
      isValidated: false,
      isNotValidated: false,
      //dsoDetailsData: {}
    }

    this.setLicenseStatus = this.setLicenseStatus.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getData = this.getData.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.fetchCityAndStates = this.fetchCityAndStates.bind(this)
    this.toggleDeliveryStatus = this.toggleDeliveryStatus.bind(this)
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
  }

  componentDidMount() {
    // const data = this.props.data
    // if (this.props.data) {
    //   this.setState({
    //     deliveryStatus: data.is_active,
    //     licenseStatus: data.license_status,
    //     licenseExpiry: data.license_expiry.slice(0, 10),
    //     selectedCityIdx: data.head_office.city_id,
    //     headOfficeAddress: data.head_office.address,
    //     isValidated: data.license_status ? true : false,
    //     isNotValidated: !data.license_status ? true : false
    //   })
    // }
    if (this.props.action !== "create") {
      this.fetchDsoDetails({
        dso_id: getQueryObjByName("id")
      })
    }
    this.fetchCityAndStates()
  }

  fetchDsoDetails(payload) {
    Api.fetchDsoDetails(payload)
      .then((response) => {
        const data = response.dso
        this.setState({
          dsoName: data.dso_name,
          entityType: data.entity_type,
          licenseType: data.license_type,
          deliveryStatus: data.is_active,
          licenseStatus: data.license_status,
          licenseExpiry: data.license_expiry.slice(0, 10),
          selectedCityIdx: data.head_office.city_id,
          headOfficeAddress: data.head_office.address,
          isValidated: data.license_status ? true : false,
          isNotValidated: !data.license_status ? true : false,
          name: data.head_office.contact.name,
          email: data.head_office.contact.email,
          phone: data.head_office.contact.phone
        })
      })
      .catch((err) => {
        console.log("Error in fetching dso details", err)
      })
  }

  fetchCityAndStates() {
    fetchStateAndCitiesList()
      .then((response) => {
        const cityList = response.cities.map((item) => {
          return {
            text: item.city_name,
            value: item.id
          }
        })
        this.setState({ cityList })
        if (this.state.selectedCityIdx === -1) {
          this.setState({
            selectedCityIdx: cityList[0].value
          })
        }
      })
      .catch((err) => {
        console.log("Error in fetching state and cities")
      })
  }

  setLicenseStatus(status) {
    console.log("license status", status, this.props.enableEdit)
    if (status === "validated") {
      this.setState({ isValidated: !this.state.isValidated, licenseStatus: true, isNotValidated: false })
    } else {
      this.setState({ isNotValidated: !this.state.isNotValidated, licenseStatus: false, isValidated: false })
    }
  }

  toggleDeliveryStatus() {
    this.setState({
      deliveryStatus: !this.state.deliveryStatus
    })
  }

  handleChange(e) {
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
    return this
  }

  handleSubmit(e) {
    e.preventDefault()
    this.handleSave()
  }

  handleSave() {
    // if (location.pathname.indexOf("create-details") !== -1) {
    //   this.setState({
    //     dsoName: this.dsoName.state.value,
    //     entityType: this.entityType.state.value,
    //     licenseType: this.licenseType.state.value,
    //     name: this.name.state.value,
    //     email: this.email.state.value,
    //     phone: this.phone.state.value
    //   }, () => {
    //     this.props.handleClick()
    //   })
    // } else {
    this.props.handleClick()
    //}
  }

  render() {
    const { dsoDetailsData } = this.state
    return (
      <React.Fragment>
        <div className="content-section" style={{ marginTop: '50px' }}>
          <form onSubmit={this.handleSubmit}>
            <TitleBarAndSave
              title={this.props.action !== "view"
                ? this.props.action === "create" ? "Add New Details" : "Edit Basic Details"
                : "Basic Details"}
              enableEdit={this.props.enableEdit}
              //handleClick={this.handleSave}
              handleCancel={this.props.handleCancel}
              disableBtn={this.props.updatingDsoDetails || this.props.creatingDsoDetails}
            />
            <div style={{ borderBottom: '1px solid #e2e5e8' }}>
              <div className="item">
                <Label>DSO</Label>
                <TextInput
                  ref={input => (this.dsoName = input)}
                  name="dsoName"
                  defaultValue={this.state.dsoName}
                  pattern="^[^-\s][a-zA-Z0-9_\s-]+$"
                  isRequired={true}
                  //autoComplete={false}
                  placeholder="dso name"
                  disabled={!this.props.enableEdit}
                  errorMessage="Dso name is invalid"
                  emptyMessage="Dso name is required"
                />
              </div>
              <div className="item">
                <Label>
                  Entity Type
                </Label>
                <TextInput
                  ref={input => (this.entityType = input)}
                  name="entityType"
                  pattern="^[^-\s][a-zA-Z0-9_\s-]+$"
                  isRequired={true}
                  defaultValue={this.state.entityType}
                  disabled={!this.props.enableEdit}
                  placeholder="entity type"
                  errorMessage="Entity type is invalid"
                  emptyMessage="Entity type is required"
                />
              </div>
              <div className="item">
                <Label
                  icon="info"
                  tooltipText="Type of License for a delivery operator"
                >
                  License Type
                </Label>
                <TextInput
                  ref={input => (this.licenseType = input)}
                  name="licenseType"
                  pattern="^[^-\s][a-zA-Z0-9_\s-]+$"
                  isRequired={true}
                  defaultValue={this.state.licenseType}
                  disabled={!this.props.enableEdit}
                  placeholder="license type"
                  errorMessage="License type is invalid"
                  emptyMessage="License type is required"
                />
              </div>
              <div className="item">
                <Label
                  icon="info"
                  tooltipText="Current status of delivery operator’s license to deliver liquor"
                >
                  License Status
                </Label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    onClick={this.props.enableEdit ? () => this.setLicenseStatus('validated') : () => { }}
                    className="circle"
                    style={{ marginRight: '10px', cursor: this.props.enableEdit ? 'pointer' : 'default' }}
                  >
                    {
                      !this.state.isValidated
                        ? <Icon name="circle" />
                        : <Icon name="filledCircle" />
                    }
                  </span>
                  <span
                    onClick={this.props.enableEdit ? () => this.setLicenseStatus('validated') : () => { }}
                    className="value"
                    style={{ marginRight: '20px', cursor: this.props.enableEdit ? 'pointer' : 'default' }}
                  >
                    Active
                </span>
                  <span
                    onClick={this.props.enableEdit ? () => this.setLicenseStatus('notValidated') : () => { }}
                    className="circle"
                    style={{ marginRight: '10px', cursor: this.props.enableEdit ? 'pointer' : 'default' }}
                  >
                    {
                      !this.state.isNotValidated
                        ? <Icon name="circle" />
                        : <Icon name="filledCircle" />
                    }
                  </span>
                  <span
                    className="value"
                    style={{ marginRight: '10px', cursor: this.props.enableEdit ? 'pointer' : 'default' }}
                    onClick={this.props.enableEdit ? () => this.setLicenseStatus('notValidated') : () => { }}
                  >
                    Inactive
                </span>
                </div>
              </div>
              <div className="item">
                <Label
                  icon="info"
                  tooltipText="Expiry date of delivery operator’s license to delivery liquor"
                >
                  License Expiry
                </Label>
                {/* <input
                  type="date"
                  name="licenseExpiry"
                  defaultValue={this.state.licenseExpiry}
                  disabled={!this.props.enableEdit}
                  required
                  onChange={this.handleTextFieldChange}
                /> */}
                <div style={{ position: 'relative' }} className="input-field">
                  <span className="calendar-icon">
                    <Icon name="calendar" />
                  </span>
                  <input
                    type="date"
                    max="9999-12-31"
                    name="licenseExpiry"
                    defaultValue={this.state.licenseExpiry}
                    disabled={!this.props.enableEdit}
                    required
                    onChange={this.handleTextFieldChange}
                  />
                </div>
              </div>
              <div className="item">
                <Label
                  icon="info"
                  tooltipText="Current status of delivery operations for a delivery operator. Exceptions prevail for specific cities based on special restrictions"
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
                    onChange={e => this.handleChange(e)}
                    value={this.state.selectedCityIdx}
                    disabled={!this.props.enableEdit}
                  />
                </div>
                <div className="item">
                  <Label>Address</Label>
                  <textarea
                    name="headOfficeAddress"
                    style={{ width: '260px' }}
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
                    maxLength={10}
                    isRequired={true}
                    placeholder="phone"
                    defaultValue={this.state.phone}
                    disabled={!this.props.enableEdit}
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

export default DsoDetailsForm