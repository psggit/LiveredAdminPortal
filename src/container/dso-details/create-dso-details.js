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
    this.setState({ creatingDsoDetails: true })
    Api.createDsoDetails({
      dso_name: data.dsoName.state.value,
      is_active: data.state.deliveryStatus,
      entity_type: data.entityType.state.value,
      license_type: data.licenseType.state.value,
      license_status: data.state.licenseStatus,
      license_expiry: new Date(data.state.licenseExpiry).toISOString(),
      head_office_city_id: data.state.selectedCityIdx,
      head_office_address: data.state.headOfficeAddress,
      head_office_contact_name: data.name.state.value,
      head_office_contact_email: data.email.state.value,
      head_office_contact_phone: data.phone.state.value
    })
      .then((response) => {
        this.setState({ creatingDsoDetails: false })
        this.props.history.push(`/home/dso/create-locations?id=${response.dso_id}&name=${response.dso_name}`)
      })
      .catch((err) => {
        this.setState({ creatingDsoDetails: false })
        console.log("Error in creating dso", err)
      })
  }

  render() {
    const { creatingDsoDetails } = this.state
    return (
      <React.Fragment>
        <PageHeader
          pageName="Delivery Service Operators"
          text="Add new"
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
          <div id="dsoDetails" style={{ width: '100%', position: 'relative' }}>
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