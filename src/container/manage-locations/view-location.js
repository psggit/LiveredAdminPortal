import React from "react"
import PageHeader from "Components/pageheader"
import { getQueryObjByName } from "Utils/url-utils"
import DsoLocationForm from "./dso-location-form"
import DsoNavbar from "../dso-details/dso-navbar"
import * as Api from "../../api"

class ViewLocation extends React.Component {
  constructor() {
    super()

    this.handleEdit = this.handleEdit.bind(this)
  }

  handleEdit() {
    this.props.history.push(`/home/dso/edit-locations?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
  }

  render() {
    return (
      <React.Fragment>
        <PageHeader pageName="Delivery Service Operators" text={getQueryObjByName("name")} />
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
                    enableEdit={false}
                    action="view"
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

export default ViewLocation