import React from "react"
import PageHeader from "Components/pageheader"
import { getQueryObjByName } from "Utils/url-utils"
import DsoLocationForm from "./dso-location-form"
import DsoNavbar from "../dso-details/dso-navbar"
import * as Api from "../../api"

class CreateLocation extends React.Component {
  constructor() {
    super()
    this.state = {
      creatingDsoLocationDetails: false
    }

    this.navbarOptions = [
      { label: "Details", value: "details", path: `/home/dso/view-details?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}` },
      { label: "Locations", value: "locations", path: `/home/dso/view-locations` },
    ]

    this.handleCancel = this.handleCancel.bind(this)
    this.createDsoLocationDetails = this.createDsoLocationDetails.bind(this)
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

  createDsoLocationDetails() {
    this.setState({ creatingDsoLocationDetails: true })
    const data = this.dsoLocationForm.getData()
    Api.creatingDsoLocationDetails({
      dso_id: getQueryObjByName("id"),
      head_office_city: data.headOfficeCity,
      head_office_contact_phone: data.headOfficeContact,
      head_office_address: data.headOfficeAddress,
      reg_office_contact_name: data.regionalOfficeName,
      reg_office_contact_email: data.regionalOfficeEmail,
      reg_office_contact_phone: data.regionalOfficePhone
    })
      .then((response) => {
        this.toggleEdit()
        this.setState({ creatingDsoLocationDetails: false })
        this.props.history.push(`/home/view-location?id=${getQueryObjByName("id")}&name=${this.state.dsoName}`)
      })
      .then((err) => {
        this.setState({ creatingDsoLocationDetails: false })
        console.log("Error in creating dso location details", err)
      })
  }

  handleCancel() {
    this.props.history.push(`/home/dso-management`)
  }

  render() {
    const { dsoName, loadingDsoDetails, dsoDetailsData, updatingDsoContactDetails } = this.state
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
            <React.Fragment>
              <div id="dsoDetails" style={{ width: '100%' }}>
                <DsoNavbar navbarItems={this.navbarOptions} />
                <div className="content">
                  <DsoLocationForm
                    ref={(node) => this.dsoLocationForm = node}
                    enableEdit={true}
                    handleCancel={this.handleCancel}
                    history={this.props.history}
                    creatingDsoLocationDetails={creatingDsoLocationDetails}
                    handleClick={this.createDsoLocationDetails}
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

export default CreateLocation