import React, { useState, useEffect } from "react"
import * as Api from "../../api"
import PageHeader from "Components/pageheader"
// import "./dso-details.scss"
import DsoDetailsForm from "./dso-details-form"
import { getQueryObjByName } from "Utils/url-utils"
import DsoNavbar from "./dso-navbar";

class EditDsoDetails extends React.Component {
  constructor() {
    super()
    this.state = {
      // dsoDetailsData: {},
      // loadingDsoDetails: true,
      updatingDsoDetails: false,
      //enableEdit: true
    }

    this.handleCancel = this.handleCancel.bind(this)
    this.editDsoDetails = this.editDsoDetails.bind(this)
  }

  // componentDidMount() {
  //   this.setState({
  //     loadingDsoDetails: true,
  //     dsoName: getQueryObjByName("name"),
  //     dsoId: getQueryObjByName("id")
  //   })
  //   this.fetchDsoDetails({
  //     dso_id: getQueryObjByName("id")
  //   })
  // }

  editDsoDetails() {
    const data = this.dsoDetailsForm.getData()
    this.setState({ updatingDsoDetails: true })
    Api.updateDsoDetails({
      dso_id: getQueryObjByName("id"),
      dso_name: data.dsoName.state.value,
      is_active: data.state.deliveryStatus,
      entity_type: data.entityType.state.value,
      license_type: data.licenseType.state.value,
      license_status: data.state.licenseStatus,
      license_expiry: new Date(data.state.licenseExpiry).toISOString(),
      head_office_city_id: data.state.selectedCityIdx,
      head_office_address: data.state.headOfficeAddress,
      head_office_contact_name: data.name.state.value,
      head_office_contact_email: data.email.state.value,
      head_office_contact_phone: data.phone.state.value
    })
      .then((response) => {
        this.setState({ updatingDsoDetails: false })
        this.props.history.push(`/home/dso/view-details?id=${getQueryObjByName("id")}&name=${data.dsoName.state.value}`)
      })
      .catch((err) => {
        console.log("Error in updating dso details", err)
        this.setState({ updatingDsoDetails: false })
      })
  }

  // fetchDsoDetails(payload) {
  //   Api.fetchDsoDetails(payload)
  //     .then((response) => {
  //       this.setState({
  //         dsoDetailsData: response.dso,
  //         loadingDsoDetails: false
  //       })
  //     })
  //     .catch((err) => {
  //       console.log("Error in fetching dso details", err)
  //     })
  // }

  handleCancel() {
    this.props.history.push(`/home/dso/view-details?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
  }

  render() {
    const { dsoName, updatingDsoDetails, dsoDetailsData, loadingDsoDetails } = this.state
    return (
      <React.Fragment>
        <PageHeader
          pageName="Delivery Service Operators"
          text={dsoName}
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
            !loadingDsoDetails &&
            <React.Fragment>
              <div id="dsoDetails" style={{ width: '100%', position: 'relative' }}>
                <DsoNavbar />
                <div className="content">
                  <DsoDetailsForm
                    ref={(node) => { this.dsoDetailsForm = node }}
                    // data={dsoDetailsData}
                    updatingDsoDetails={updatingDsoDetails}
                    enableEdit={true}
                    action="edit"
                    handleCancel={this.handleCancel}
                    handleClick={this.editDsoDetails}
                    history={this.props.history}
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

export default EditDsoDetails
