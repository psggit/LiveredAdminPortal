import React from "react"
import Button from "Components/button"
import "Sass/wrapper.scss"
//import "./dso-details.scss"
import Moment from "moment"
import DataTable from "Components/table/custom-table"
import Label from "Components/label"
import Select from "Components/select"
import Icon from "Components/icon"
import { getQueryObjByName } from "Utils/url-utils"
import * as Api from "./../../api"
import Dialog from "Components/dialog"
import TextInput from "Components/textInput"
import TitleBar from "Components/titlebar"

class DsoDetailsForm extends React.Component {
  constructor() {
    super()
    this.state = {
      dsoName: "",
      entityType: "",
      licenseType: "",
      licenseStatus: "",
      licenseExpiry: "",
      headOfficeCity: "",
      headOfficeAddress: "",
      name: "",
      email: "",
      phone: "",
      deliveryStatus: true,
      isValidated: false,
      isNotValidated: false,
      //selectedStateIdx: -1,
      //enableEdit: "",
      //stateList: [],
      showDeliveryStatusModal: false,
      //showStateDeliveryStatusModal: false,
      //deliverableStateDetails: [],
      //deliverableStateMap: {}
    }

    this.setLicenseStatus = this.setLicenseStatus.bind(this)
    // this.unmountModal = this.unmountModal.bind(this)
    //this.handleChange = this.handleChange.bind(this)
    this.getData = this.getData.bind(this)
    //this.addDsoState = this.addDsoState.bind(this)
    this.toggleDeliveryStatus = this.toggleDeliveryStatus.bind(this)
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
    //this.toggleStateServiceStatus = this.toggleStateServiceStatus.bind(this)
  }

  componentDidMount() {
    const data = this.props.data
    // const deliverableStateMap = {}
    // this.props.data.state_details.map((item) => {
    //   deliverableStateMap[item.state_id] = item
    // })

    // this.setState({
    //   deliverableStateDetails: this.props.data.state_details,
    //   deliverableStateMap
    // })
    // if (this.props.enableEdit) {
    //   Api.fetchStateAndCitiesList({})
    //     .then((response) => {
    //       const stateList = response.states.map((item) => {
    //         return {
    //           text: item.state_name,
    //           value: item.id
    //         }
    //       })
    //       this.setState({
    //         stateList,
    //         selectedStateIdx: stateList[0].value
    //       })
    //     })
    //     .catch((err) => {
    //       console.log("Error in fetching states and cities")
    //     })
    // }
    if (this.props.data) {
      this.setState({
        // loadingDsoDetails: true,
        dsoName: data.dso_name,
        entityType: data.entity_type,
        licenseType: data.license_type,
        deliveryStatus: data.is_active,
        licenseStatus: data.license_status,
        licenseExpiry: data.license_expiry.slice(0, 10),
        headOfficeCity: data.head_office.city,
        headOfficeAddress: data.head_office.address,
        name: data.head_office.contact.name,
        email: data.head_office.contact.email,
        phone: data.head_office.contact.phone,
        isValidated: data.license_status ? true : false,
        isNotValidated: !data.license_status ? true : false
      })
    }
  }

  setLicenseStatus(status) {
    if (status === "validated") {
      this.setState({ isValidated: !this.state.isValidated, licenseStatus: true, isNotValidated: false })
    } else {
      this.setState({ isNotValidated: !this.state.isNotValidated, licenseStatus: false, isValidated: false })
    }
  }

  // handleChange(e) {
  //   selectedStateIdx: parseInt(e.target.value)
  // }

  toggleDeliveryStatus() {
    this.setState({
      deliveryStatus: !this.state.deliveryStatus
    })
    // Api.toggleDeliveryStatus({
    //   dso_id: getQueryObjByName("id"),
    //   is_active: !this.state.deliveryStatus
    // })
    //   .then((response) => {
    //     this.setState({
    //       deliveryStatus: !this.state.deliveryStatus
    //     })
    //     this.unmountModal("DeliveryStatus")
    //   })
    //   .catch((err) => {
    //     console.log("Error in changing delivery status", err)
    //     this.unmountModal("DeliveryStatus")
    //   })
  }

  handleTextFieldChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  // mountModal(name) {
  //   const flagName = (`show${name}Modal`)
  //   this.setState({
  //     [flagName]: true
  //   })
  // }

  // unmountModal(name) {
  //   const flagName = (`show${name}Modal`)
  //   this.setState({
  //     [flagName]: false
  //   })
  // }

  // addDsoState() {
  //   Api.addDsoStateDetails({
  //     dso_id: getQueryObjByName("id"),
  //     state_id: this.state.selectedStateIdx,
  //     service_status: true
  //   })
  //     .then((response) => {
  //       location.reload()
  //     })
  //     .catch((err) => {
  //       console.log("Error in adding dso state", err)
  //     })
  // }

  // toggleStateServiceStatus() {
  //   Api.toggleStateServiceStatus({
  //     state_id: this.stateId,
  //     dso_id: getQueryObjByName("id"),
  //     service_status: !this.serviceStatus
  //   })
  //     .then((response) => {
  //       console.log("location", location.pathname)
  //       this.unmountModal("StateDeliveryStatus")
  //       location.reload()
  //     })
  //     .catch((err) => {
  //       console.log("Error in updating state delivery status", err)
  //       this.unmountModal("StateDeliveryStatus")
  //     })
  // }

  getData() {
    return this.state
  }

  render() {
    return (
      <React.Fragment>
        <TitleBar
          title={this.props.action !== "view"
            ? this.props.action === "create" ? "Add New Details" : "Edit Basic Details"
            : "Basic Details"}
          enableEdit={this.props.enableEdit}
          handleClick={this.props.handleClick}
          handleCancel={this.props.handleCancel}
          disableBtn={this.props.updatingDsoDetails || this.props.creatingDsoDetails}
        />
        <div className="content-section">
          <div style={{ borderBottom: '1px solid #e2e5e8' }}>
            <div className="item">
              <Label>DSO</Label>
              <TextInput
                // type="text"
                // name="dsoName"
                // value={this.state.dsoName}
                // onChange={this.handleTextFieldChange}
                // disabled={!this.props.enableEdit}
                ref={input => (this.dsoName = input)}
                name="dsoName"
                pattern="[a-zA-Z]*"
                isRequired={true}
                placeholder="dso name"
                disabled={!this.props.enableEdit}
                errorMessage="Dso name is invalid"
                emptyMessage="Dso name is required"
              />
              {/* <input
                type="text"
                name="dsoName"
                value={this.state.dsoName}
                onChange={this.handleTextFieldChange}
                disabled={!this.props.enableEdit}
              /> */}
            </div>
            <div className="item">
              <Label
                icon="info"
                tooltipText="Minimum legal age limit to place an order"
              >
                Entity Type
            </Label>
              {/* <input
                type="text"
                name="entityType"
                value={this.state.entityType}
                disabled={!this.props.enableEdit}
                onChange={this.handleTextFieldChange}
              /> */}
              <TextInput
                ref={input => (this.entityType = input)}
                name="entityType"
                pattern="[a-zA-Z]*"
                isRequired={true}
                disabled={!this.props.enableEdit}
                placeholder="entity type"
                errorMessage="Entity type is invalid"
                emptyMessage="Entity type is required"
              />
            </div>
            <div className="item">
              <Label
                icon="info"
                tooltipText="Minimum legal age limit to place an order"
              >
                License Type
            </Label>
              {/* <input
                type="text"
                name="licenseType"
                value={this.state.licenseType}
                disabled={!this.props.enableEdit}
                onChange={this.handleTextFieldChange}
              /> */}
              <TextInput
                ref={input => (this.licenseType = input)}
                name="licenseType"
                pattern="[a-zA-Z]*"
                isRequired={true}
                disabled={!this.props.enableEdit}
                placeholder="license type"
                errorMessage="License type is invalid"
                emptyMessage="License type is required"
              />
            </div>
            <div className="item">
              <Label
                icon="info"
                tooltipText="Minimum legal age limit to place an order"
              >
                License Status
            </Label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  onClick={() => this.setLicenseStatus('validated')}
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
                tooltipText="Minimum legal age limit to place an order"
              >
                License Expiry
            </Label>
              <input
                type="date"
                name="licenseExpiry"
                defaultValue={this.state.licenseExpiry}
                disabled={!this.props.enableEdit}
                onChange={this.handleTextFieldChange}
              />
            </div>
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
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%' }}>
              <p className="header">Headquarters</p>
              <div className="item">
                <Label>City</Label>
                {/* <input
                  type="text"
                  name="headOfficeCity"
                  style={{ width: '300px' }}
                  value={this.state.headOfficeCity}
                  onChange={this.handleTextFieldChange}
                  disabled={!this.props.enableEdit}
                /> */}
                <TextInput
                  ref={input => (this.headOfficeCity = input)}
                  name="headOfficeCity"
                  pattern="[a-zA-Z]*"
                  isRequired={true}
                  placeholder="city"
                  disabled={!this.props.enableEdit}
                  errorMessage="City is invalid"
                  emptyMessage="City is required"
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
                {/* <input
                  type="text"
                  name="name"
                  style={{ width: '300px' }}
                  value={this.state.name}
                  onChange={this.handleTextFieldChange}
                  disabled={!this.props.enableEdit}
                /> */}
                <TextInput
                  ref={input => (this.name = input)}
                  name="name"
                  pattern="[a-zA-Z]*"
                  isRequired={true}
                  placeholder="name"
                  errorMessage="Name is invalid"
                  emptyMessage="Name is required"
                  disabled={!this.props.enableEdit}
                />
              </div>
              <div className="item">
                <Label>Email Address</Label>
                {/* <input
                  type="text"
                  name="email"
                  style={{ width: '300px' }}
                  value={this.state.email}
                  onChange={this.handleTextFieldChange}
                  disabled={!this.props.enableEdit}
                /> */}
                <TextInput
                  ref={input => (this.email = input)}
                  name="email"
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  isRequired={true}
                  placeholder="email"
                  errorMessage="Email is invalid"
                  emptyMessage="Email is required"
                  disabled={!this.props.enableEdit}
                />
              </div>
              <div className="item">
                <Label>Phone</Label>
                {/* <input
                  type="text"
                  name="phone"
                  style={{ width: '300px' }}
                  value={this.state.phone}
                  onChange={this.handleTextFieldChange}
                  disabled={!this.props.enableEdit}
                /> */}
                <TextInput
                  ref={input => (this.phone = input)}
                  name="phone"
                  pattern="[0-9]*"
                  isRequired={true}
                  placeholder="phone"
                  disabled={!this.props.enableEdit}
                  errorMessage="Phone is invalid"
                  emptyMessage="Phone is required"
                  disabled={!this.props.enableEdit}
                />
              </div>
            </div>
          </div>
          {/* <div className="item">
            <DataTable
              loadingData={false}
              message="No states added. Add states from the dropdown"
              headings={[
                { title: "State", icon: "", tooltipText: "" },
                { title: "Delivery Status", icon: "info", tooltipText: "Current status of delivery operations for a delivery service operator" },
                // { title: "", icon: "", tooltipText: "" }
              ]}
            >
              {
                this.state.deliverableStateDetails.length > 0 &&
                this.state.deliverableStateDetails.map((item) => {
                  return (
                    <tr>
                      <td>{item.state_name}</td>
                      <td>
                        <div className="text-icon">
                          {
                            item.service_status
                              ? <span style={{ marginRight: '10px' }}><Icon name="toggleGreen" /></span>
                              : <span style={{ marginRight: '10px' }}><Icon name="toggleRed" /></span>
                          }
                          <span style={{ cursor: 'pointer' }}
                            onClick={() => {
                              this.stateId = item.state_id,
                                this.serviceStatus = item.service_status,
                                this.mountModal("StateDeliveryStatus")
                            }}
                          >
                            {item.service_status ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </DataTable>
          </div> */}
          {/* {
            this.props.enableEdit &&
            <div className="item">
              <div className="icon">
                <span><Icon name="addIcon" /></span>
                <Label>Add State to DSO</Label>
              </div>
              <div style={{ display: 'flex' }}>
                <Select
                  options={this.state.stateList}
                  name="State"
                  onChange={e => this.handleChange(e)}
                  value={this.state.selectedStateIdx}
                />
                <div style={{ marginLeft: '10px' }}>
                  <Button primary onClick={this.addDsoState}>Add</Button>
                </div>
              </div>
            </div>
          } */}
        </div>
        {/* {
          showDeliveryStatusModal &&
          (
            <Dialog
              title="Are you sure you want to perform this action?"
              actions={[
                <Button onClick={() => this.toggleDeliveryStatus()} primary>
                  Yes
                </Button>,
                <Button onClick={() => this.unmountModal("DeliveryStatus")} secondary>
                  No
                </Button>
              ]}
            />
          )
        } */}
        {/* {
          showStateDeliveryStatusModal &&
          (
            <Dialog
              title="Are you sure you want to perform this action?"
              actions={[
                <Button onClick={() => this.toggleStateServiceStatus()} primary>
                  Yes
                </Button>,
                <Button onClick={() => this.unmountModal("StateDeliveryStatus")} secondary>
                  No
                </Button>
              ]}
            />
          )
        } */}
      </React.Fragment>
    )
  }
}

export default DsoDetailsForm