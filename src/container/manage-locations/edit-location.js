import React from "react"
import PageHeader from "Components/pageheader"
import { getQueryObjByName } from "Utils/url-utils"
import DsoLocationForm from "./dso-location-form"
import DsoNavbar from "../dso-details/dso-navbar"
import * as Api from "../../api"

class EditLocation extends React.Component {
  constructor() {
    super()
    this.state = {
      updatingDsoLocationDetails: false,
      creatingDsoLocationDetails: false
    }

    this.handleCancel = this.handleCancel.bind(this)
    this.removeCityToDso = this.removeCityToDso.bind(this)
    this.addCityToDso = this.addCityToDso.bind(this)
    this.editDsoLocationDetails = this.editDsoLocationDetails.bind(this)
    this.createDsoLocationDetails = this.createDsoLocationDetails.bind(this)
  }

  createDsoLocationDetails() {
    this.setState({ creatingDsoLocationDetails: true })
    const data = this.dsoLocationForm.getData()
    Api.creatingDsoLocationDetails({
      dso_id: getQueryObjByName("id"),
      service_status: true,
      state_id: data.state.selectedStateIdx,
      reg_office_city_id: data.state.selectedRegionalCityIdx,
      reg_office_address: data.state.regionalOfficeAddress,
      reg_office_contact_name: data.name.state.value,
      reg_office_contact_email: data.email.state.value,
      reg_office_contact_phone: data.phone.state.value
    })
      .then((response) => {
        this.setState({ creatingDsoLocationDetails: false })
        this.props.history.push(`/home/dso/view-locations?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
      })
      .catch((err) => {
        this.setState({ creatingDsoLocationDetails: false })
        console.log("Error in creating dso location details", err)
      })
  }

  editDsoLocationDetails() {
    this.setState({ updatingDsoLocationDetails: true })
    const data = this.dsoLocationForm.getData()
    Api.editDsoLocationDetails({
      dso_id: getQueryObjByName("id"),
      state_id: data.state.selectedStateIdx,
      service_status: data.state.deliveryStatus,
      reg_office_city_id: data.state.selectedRegionalCityIdx,
      reg_office_address: data.state.regionalOfficeAddress,
      reg_office_contact_name: data.name.state.value,
      reg_office_contact_email: data.email.state.value,
      reg_office_contact_phone: data.phone.state.value
    })
      .then((response) => {
        this.setState({ updatingDsoLocationDetails: false })
        this.props.history.push(`/home/dso/view-locations?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
      })
      .catch((err) => {
        this.setState({ updatingDsoLocationDetails: false })
        console.log("Error in updating dso location details", err)
      })
  }

  handleCancel() {
    this.props.history.push(`/home/dso/view-locations?id=${getQueryObjByName("id")}`)
  }

  addCityToDso(id, value, callback) {
    const data = this.dsoLocationForm.getData()
    Api.addCityToDso({
      dso_id: getQueryObjByName("id"),
      city_id: id,
      state_id: data.state.selectedStateIdx,
      service_status_on: new Date().toISOString(),
      service_status: true
    })
      .then((response) => {
        console.log("Successfully added city to dso")
      })
      .catch((err) => {
        console.log("value", value)
        callback(value)
        console.log("Error in adding city to dso", err)
      })
  }

  removeCityToDso(id, value, callback) {
    Api.deleteCityToDso({
      dso_id: getQueryObjByName("id"),
      city_id: id
    })
      .then((response) => {
        console.log("Successfully removed city from dso")
      })
      .catch((err) => {
        callback(value)
        console.log("Error in removing city from dso", err)
      })
  }

  render() {
    const { updatingDsoLocationDetails, creatingDsoLocationDetails } = this.state
    return (
      <React.Fragment>
        <PageHeader
          pageName="Delivery Service Operators"
          text={getQueryObjByName("name")}
          pathname="/home/dso-management"
        />
        <div style={{
          display: "flex",
          marginTop: "30px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: '0px 60px'
        }}
        >
          {
            <React.Fragment>
              <div id="dsoDetails" style={{ width: '100%', position: 'relative' }}>
                <DsoNavbar />
                <div className="content">
                  <DsoLocationForm
                    ref={(node) => this.dsoLocationForm = node}
                    enableEdit={true}
                    action="edit"
                    handleCancel={this.handleCancel}
                    history={this.props.history}
                    updatingDsoLocationDetails={updatingDsoLocationDetails}
                    creatingDsoLocationDetails={creatingDsoLocationDetails}
                    handleClick={this.createDsoLocationDetails}
                    handleUpdate={this.editDsoLocationDetails}
                    addCityToDso={this.addCityToDso}
                    removeCityToDso={this.removeCityToDso}
                  />
                </div>
              </div>
            </React.Fragment>
          }
        </div>
      </React.Fragment>
    )
  }
}

export default EditLocation