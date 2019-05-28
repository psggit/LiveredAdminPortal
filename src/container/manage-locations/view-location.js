import React from "react"
import PageHeader from "Components/pageheader"
import { getQueryObjByName } from "Utils/url-utils"
import DsoLocationForm from "./dso-location-form"
import DsoNavbar from "../dso-details/dso-navbar"
import * as Api from "../../api"

class ViewLocation extends React.Component {
  constructor() {
    super()
    this.state = {
      dsoName: "",
      loadingDsoDetails: false,
      dsoDetailsData: {}
    }

    this.handleEdit = this.handleEdit.bind(this)
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

  handleEdit() {
    this.props.history.push(`/home/dso/edit-locations?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
  }

  render() {
    const { dsoName, loadingDsoDetails, dsoDetailsData } = this.state
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
                  <DsoLocationForm
                    data={dsoDetailsData}
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