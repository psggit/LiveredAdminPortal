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
      enableEdit: true
    }

    this.toggleEdit = this.toggleEdit.bind(this)
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
                    data={dsoDetailsData}
                    buttonTitle="Edit"
                    title="Edit Basic Details"
                    enableEdit={this.state.enableEdit}
                    toggleEdit={this.toggleEdit}
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
