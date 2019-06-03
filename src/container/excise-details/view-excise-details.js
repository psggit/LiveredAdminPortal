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

    this.handleEdit = this.handleEdit.bind(this)
  }

  handleEdit() {
    this.props.history.push(`/home/excise/edit-details?stateId=${getQueryObjByName("stateId")}&name=${getQueryObjByName("name")}`)
  }

  render() {
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
            <React.Fragment>
              <div id="dsoDetails" style={{ width: '100%', position: 'relative' }}>
                <ExciseNavbar />
                <div className="content">
                  <ExciseDetailsForm
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
