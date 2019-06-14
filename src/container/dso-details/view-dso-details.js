import React, { useState, useEffect } from "react"
import * as Api from "../../api"
import PageHeader from "Components/pageheader"
// import "./dso-details.scss"
import DsoDetailsForm from "./dso-details-form"
import DsoNavbar from "./dso-navbar"
import { getQueryObjByName } from "Utils/url-utils"

class dsoDetails extends React.Component {
  constructor() {
    super()
    this.state = {
      dsoDetailsData: {},
      loadingDsoDetails: true,
      dsoName: ""
    }
    this.handleEdit = this.handleEdit.bind(this)
  }

  // componentDidMount() {
  //   this.setState({
  //     loadingDsoDetails: true,
  //     dsoName: getQueryObjByName("name")
  //   })
  //   this.fetchDsoDetails({
  //     dso_id: getQueryObjByName("id")
  //   })
  // }

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

  handleEdit() {
    this.props.history.push(`/home/dso/edit-details?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
  }

  render() {
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
                  <DsoDetailsForm
                    // data={dsoDetailsData}
                    action="view"
                    enableEdit={false}
                    handleClick={this.handleEdit}
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
