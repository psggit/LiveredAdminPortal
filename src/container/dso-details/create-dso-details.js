import React from "react"
import PageHeader from "Components/pageheader"
import DsoNavbar from "./dso-navbar"
import DsoDetailsForm from "./dso-details-form"
import * as Api from "./../../api"

class CreateDso extends React.Component {
  constructor() {
    super()
    this.state = {
      creatingDsoDetails: false
    }
    this.navbarOptions = [
      { label: "Details", value: "details", path: "/home/dso/create-details" },
      // { label: "Locations", value: "locations", path: "/home/dso/view-locations" },
    ]

    this.handleCancel = this.handleCancel.bind(this)
    this.createDsoDetails = this.createDsoDetails.bind(this)
  }

  handleCancel() {
    this.props.history.push("/home/dso-management")
  }

  createDsoDetails() {
    const data = this.dsoDetailsForm.getData()
    Api.createDsoDetails({
      dso_name: data.dsoName,
      is_active: data.deliveryStatus,
      entity_type: data.entityType,
      license_type: data.licenseType,
      license_status: data.licenseStatus,
      license_expiry: new Date(data.licenseExpiry).toISOString(),
      head_office_city_id: data.selectedCityIdx,
      head_office_address: data.headOfficeAddress,
      head_office_contact_name: data.name,
      head_office_contact_email: data.email,
      head_office_contact_phone: data.phone
    })
      .then((response) => {
        this.props.history.push(`/home/dso/create-locations?id=${response.dso_id}&name=${response.dso_name}`)
      })
      .catch((err) => {
        console.log("Error in creating dso", err)
      })
  }

  render() {
    const { creatingDsoDetails } = this.state
    return (
      <React.Fragment>
        <PageHeader pageName="Delivery Service Operators" text="Add new" />
        <div style={{
          display: "flex",
          marginTop: "30px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: '0px 60px'
        }}
        >
          <div id="dsoDetails" style={{ width: '100%' }}>
            <DsoNavbar navbarItems={this.navbarOptions} />
            <div className="content">
              <DsoDetailsForm
                ref={(node) => { this.dsoDetailsForm = node }}
                creatingDsoDetails={creatingDsoDetails}
                enableEdit={true}
                action="create"
                handleCancel={this.handleCancel}
                handleClick={this.createDsoDetails}
                history={this.props.history}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default CreateDso