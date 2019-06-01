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
      dsoDetailsData: {},
      loadingDsoDetails: true,
      updatingDsoDetails: false,
      //enableEdit: true
    }

    this.handleCancel = this.handleCancel.bind(this)
    this.editDsoDetails = this.editDsoDetails.bind(this)
  }

  componentDidMount() {
    this.setState({
      loadingDsoDetails: true,
      dsoName: getQueryObjByName("name"),
      dsoId: getQueryObjByName("id")
    })
    this.fetchDsoDetails({
      dso_id: getQueryObjByName("id")
    })
  }

  editDsoDetails() {
    const data = this.dsoDetailsForm.getData()
    this.setState({ updatingDsoDetails: true })
    Api.updateDsoDetails({
      dso_id: getQueryObjByName("id"),
      dso_name: data.dsoName,
      is_active: data.deliveryStatus,
      entity_type: data.entityType,
      license_type: data.licenseType,
      license_status: data.licenseStatus,
      license_expiry: new Date(data.licenseExpiry).toISOString(),
      head_office_city_id: data.selectedCityIdx,
      head_office_address: data.headOfficeAddress,
      head_office_contact_name: data.name,
      head_office_contact_email: data.email,
      head_office_contact_phone: data.phone
    })
      .then((response) => {
        this.setState({ updatingDsoDetails: false })
        this.props.history.push(`/home/dso/view-details?id=${getQueryObjByName("id")}&name=${data.dsoName}`)
      })
      .catch((err) => {
        console.log("Error in updating dso details", err)
        this.setState({ updatingDsoDetails: false })
      })
  }

  fetchDsoDetails(payload) {
    Api.fetchDsoDetails(payload)
      .then((response) => {
        this.setState({
          dsoDetailsData: response.dso,
          loadingDsoDetails: false
        })
      })
      .catch((err) => {
        console.log("Error in fetching dso details", err)
      })
  }

  handleCancel() {
    this.props.history.push(`/home/dso/view-details?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
  }

  render() {
    const { dsoName, updatingDsoDetails, dsoDetailsData, loadingDsoDetails } = this.state
    return (
      <React.Fragment>
        <PageHeader pageName="Delivery Service Operators" text={dsoName} />
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
                    data={dsoDetailsData}
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
