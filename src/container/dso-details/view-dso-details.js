import React, { useState, useEffect } from "react"
import * as Api from "../../api"
import PageHeader from "Components/pageheader"
import "./dso-details.scss"
import DsoDetailsForm from "./dso-details-form"
import { getQueryObjByName } from "Utils/url-utils"

class dsoDetails extends React.Component {
  constructor() {
    super()
    this.state = {
      dsoDetailsData: {},
      loadingDsoDetails: true,
      dsoName: ""
    }
  }

  componentDidMount() {
    this.setState({
      loadingDsoDetails: true,
      dsoName: getQueryObjByName("name")
    })
    this.fetchDsoDetails({
      dso_id: getQueryObjByName("id")
    })
  }

  handleClick(route) {
    console.log("id", getQueryObjByName("id"))
    location.href = `${route}?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`
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

  render() {
    const { dsoName, dsoDetailsData, loadingDsoDetails } = this.state
    console.log("response dso", dsoDetailsData)
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
              <div id="dsoDetails">
                <div className="main-header">
                  <a onClick={() => this.handleClick(`/home/dso/view-details`)} className="active">Details</a>
                  <a onClick={() => this.handleClick("/home/credit-management")}>Credits</a>
                  <a>Users</a>
                  <a>Contact</a>
                </div>
                <div className="content">
                  <DsoDetailsForm
                    data={dsoDetailsData}
                    buttonTitle="Edit"
                    title="Basic Details"
                    enableEdit={false}
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

export default dsoDetails
