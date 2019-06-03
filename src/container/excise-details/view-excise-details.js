import React, { useState, useEffect } from "react"
import * as Api from "../../api"
import PageHeader from "Components/pageheader"
// import "./dso-details.scss"
import ExciseDetailsForm from "./excise-details-form"
import ExciseNavbar from "./excise-navbar"
import { getQueryObjByName } from "Utils/url-utils"

class exciseDetails extends React.Component {
  constructor() {
    super()
    this.state = {
      exciseDetailsData: {},
      loadingExciseDetails: true
    }
    this.handleEdit = this.handleEdit.bind(this)
  }

  componentDidMount() {
    this.setState({
      loadingExciseDetails: true,
      //dsoName: getQueryObjByName("name")
    })
    this.fetchExciseDetails({
      state_id: parseInt(getQueryObjByName("stateId"))
    })
  }

  fetchExciseDetails(payload) {
    Api.fetchExciseDetails(payload)
      .then((response) => {
        console.log("response", response.excise)
        this.setState({
          exciseDetailsData: response.excise,
          loadingExciseDetails: false
        })
      })
      .catch((err) => {
        console.log("Error in fetching excise details", err)
      })
  }

  handleEdit() {
    this.props.history.push(`/home/excise/edit-details?stateId=${getQueryObjByName("stateId")}&name=${getQueryObjByName("name")}`)
  }

  render() {
    const { exciseDetailsData, loadingExciseDetails } = this.state
    return (
      <React.Fragment>
        <PageHeader pageName="Excise Departments" text={getQueryObjByName("name")} />
        <div style={{
          display: "flex",
          marginTop: "30px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: '0px 60px'
        }}
        >
          {
            !loadingExciseDetails &&
            <React.Fragment>
              <div id="dsoDetails" style={{ width: '100%', position: 'relative' }}>
                <ExciseNavbar />
                <div className="content">
                  <ExciseDetailsForm
                    data={exciseDetailsData}
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

export default exciseDetails
