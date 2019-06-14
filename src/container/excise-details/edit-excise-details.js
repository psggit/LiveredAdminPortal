import React, { useState, useEffect } from "react"
import * as Api from "../../api"
import PageHeader from "Components/pageheader"
import ExciseDetailsForm from "./excise-details-form"
import { getQueryObjByName } from "Utils/url-utils"
import ExciseNavbar from "./excise-navbar";

class EditExciseDetails extends React.Component {
  constructor() {
    super()
    this.state = {
      exciseDetailsData: {},
      loadingExciseDetails: true,
      updatingExciseDetails: false,
    }

    this.handleCancel = this.handleCancel.bind(this)
    this.editExciseDetails = this.editExciseDetails.bind(this)
  }

  editExciseDetails() {
    const data = this.exciseDetailsForm.getData()
    this.setState({ updatingExciseDetails: true })
    Api.updateExciseDetails({
      name: data.exciseName.state.value,
      state_id: data.state.selectedStateIdx,
      delivery_status: data.state.deliveryStatus,
      head_office_city_id: data.state.selectedCityIdx,
      head_office_address: data.state.headOfficeAddress,
      primary_contact_name: data.name.state.value,
      primary_contact_email: data.email.state.value,
      primary_contact_phone: data.phone.state.value
    })
      .then((response) => {
        this.setState({ updatingExciseDetails: false })
        this.props.history.push(`/home/excise/view-details?stateId=${getQueryObjByName("stateId")}&name=${data.exciseName.state.value}`)
      })
      .catch((err) => {
        console.log("Error in updating excise details", err)
        this.setState({ updatingExciseDetails: false })
      })
  }

  handleCancel() {
    this.props.history.push(`/home/excise/view-details?stateId=${getQueryObjByName("stateId")}&name=${getQueryObjByName("name")}`)
  }

  render() {
    const { updatingExciseDetails } = this.state
    return (
      <React.Fragment>
        <PageHeader
          pageName="Excise Departments"
          text={getQueryObjByName("name")}
          pathname="/home/excise-management"
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
              <div id="exciseDetails" style={{ width: '100%', position: 'relative' }}>
                <ExciseNavbar />
                <div className="content">
                  <ExciseDetailsForm
                    ref={(node) => { this.exciseDetailsForm = node }}
                    updatingExciseDetails={updatingExciseDetails}
                    enableEdit={true}
                    action="edit"
                    handleCancel={this.handleCancel}
                    handleClick={this.editExciseDetails}
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

export default EditExciseDetails
