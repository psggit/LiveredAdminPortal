import React from "react"
import PageHeader from "Components/pageheader"
import { getQueryObjByName } from "Utils/url-utils"
import DsoLocationForm from "./dso-location-form"
import DsoNavbar from "../dso-details/dso-navbar"
import * as Api from "../../api"

class EditLocation extends React.Component {
  constructor() {
    super()
    this.state = {
      dsoName: "",
      loadingDsoDetails: false,
      dsoDetailsData: {},
      updatingDsoLocationDetails: false
    }

    this.handleCancel = this.handleCancel.bind(this)
    this.editDsoLocationDetails = this.editDsoLocationDetails.bind(this)
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

  editDsoLocationDetails() {
    this.setState({ updatingDsoLocationDetails: true })
    const data = this.dsoLocationForm.getData()
    console.log("data", data)
    Api.editDsoLocationDetails({
      dso_id: getQueryObjByName("id"),
      state_id: data.selectedStateIdx,
      service_status: true,
      reg_office_city: data.regionalOfficeCity,
      reg_office_address: data.regionalOfficeAddress,
      reg_office_contact_name: data.name,
      reg_office_contact_email: data.email,
      reg_office_contact_phone: data.phone
    })
      .then((response) => {
        // this.toggleEdit()
        this.setState({ updatingDsoLocationDetails: false })
        //this.props.history.push(`/home/dso/view-locations?id=${getQueryObjByName("id")}&name=${this.state.dsoName}`)
      })
      .then((err) => {
        this.setState({ updatingDsoLocationDetails: false })
        console.log("Error in updating dso location details", err)
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

  handleCancel() {
    console.log("name", this.state.dsoName)
    this.props.history.push(`/home/view-contact?id=${getQueryObjByName("id")}&name=${this.state.dsoName}`)
  }

  render() {
    const { dsoName, loadingDsoDetails, dsoDetailsData, updatingDsoLocationDetails } = this.state
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
                    ref={(node) => this.dsoLocationForm = node}
                    data={dsoDetailsData}
                    enableEdit={true}
                    handleCancel={this.handleCancel}
                    history={this.props.history}
                    updatingDsoLocationDetails={updatingDsoLocationDetails}
                    handleClick={this.editDsoLocationDetails}
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

export default EditLocation