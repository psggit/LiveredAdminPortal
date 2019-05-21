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
      enableEdit: true
    }

    this.toggleEdit = this.toggleEdit.bind(this)
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
    // console.log("edit")
    // console.log(this.dsoDetailsForm.getData())
    const data = this.dsoDetailsForm.getData()
    this.setState({ updatingDsoDetails: true })
    Api.updateDsoDetails({
      dso_id: getQueryObjByName("id"),
      dso_name: data.dsoName,
      entity_type: data.entityType,
      license_type: data.licenseType
    })
      .then((response) => {
        this.toggleEdit()
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
        console.log("response", response.dso)
        this.setState({
          dsoDetailsData: response.dso,
          loadingDsoDetails: false
        })
      })
      .catch((err) => {
        console.log("Error in fetching dso details", err)
      })
  }

  toggleEdit() {
    this.props.history.push(`/home/dso/view-details?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
  }

  render() {
    const { dsoName, dsoId, dsoDetailsData, loadingDsoDetails } = this.state
    console.log("state", this.state.enableEdit)
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
              <div id="dsoDetails" style={{ width: '100%' }}>
                <DsoNavbar />
                <div className="content">
                  <DsoDetailsForm
                    ref={(node) => { this.dsoDetailsForm = node }}
                    data={dsoDetailsData}
                    buttonTitle="Edit"
                    title="Edit Basic Details"
                    enableEdit={this.state.enableEdit}
                    toggleEdit={this.toggleEdit}
                    editDsoDetails={this.editDsoDetails}
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
