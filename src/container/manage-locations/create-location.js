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
    this.removeCityToDso = this.removeCityToDso.bind(this)
    this.addCityToDso = this.addCityToDso.bind(this)
    this.createDsoLocationDetails = this.createDsoLocationDetails.bind(this)
  }

  componentDidMount() {
    this.setState({
      loadingDsoDetails: true,
      dsoName: getQueryObjByName("name")
    })
    // this.fetchDsoDetails({
    //   dso_id: getQueryObjByName("id")
    // })
  }

  createDsoLocationDetails() {
    this.setState({ creatingDsoLocationDetails: true })
    const data = this.dsoLocationForm.getData()
    Api.creatingDsoLocationDetails({
      dso_id: getQueryObjByName("id"),
      service_status: true,
      state_id: data.selectedStateIdx,
      reg_office_city_id: data.selectedRegionalCityIdx,
      reg_office_address: data.regionalOfficeAddress,
      reg_office_contact_name: data.name,
      reg_office_contact_email: data.email,
      reg_office_contact_phone: data.phone
    })
      .then((response) => {
        this.setState({ creatingDsoLocationDetails: false })
        //this.props.history.push(`/home/dso-management`)
        this.props.history.push(`/home/dso/view-locations?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
      })
      .catch((err) => {
        this.setState({ creatingDsoLocationDetails: false })
        console.log("Error in creating dso location details", err)
      })
  }

  handleCancel() {
    this.props.history.push(`/home/dso-management`)
  }

  addCityToDso(id, value, callback) {
    const data = this.dsoLocationForm.getData()
    Api.addCityToDso({
      dso_id: getQueryObjByName("id"),
      city_id: id,
      state_id: data.selectedStateIdx,
      service_status_on: new Date().toISOString(),
      service_status: true
    })
      .then((response) => {
        console.log("Successfully added city to dso")
      })
      .catch((err) => {
        console.log("value", value)
        callback(value)
        console.log("Error in adding city to dso", err)
      })
  }

  removeCityToDso(id, value, callback) {
    Api.deleteCityToDso({
      dso_id: getQueryObjByName("id"),
      city_id: id
    })
      .then((response) => {
        console.log("Successfully removed city from dso")
      })
      .catch((err) => {
        callback(value)
        console.log("Error in removing city from dso", err)
      })
  }

  render() {
    const { dsoName, creatingDsoLocationDetails } = this.state
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
                    action="create"
                    creatingDsoLocationDetails={creatingDsoLocationDetails}
                    handleClick={this.createDsoLocationDetails}
                    addCityToDso={this.addCityToDso}
                    removeCityToDso={this.removeCityToDso}
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