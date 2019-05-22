import React from "react"
import PageHeader from "Components/pageheader"
import { getQueryObjByName } from "Utils/url-utils"
import DsoContactForm from "./dso-contact-form"
import DsoNavbar from "./../dso-details/dso-navbar"
import * as Api from "./../../api"

class EditContact extends React.Component {
  constructor() {
    super()
    this.state = {
      dsoName: "",
      loadingDsoDetails: false,
      dsoDetailsData: {},
      updatingDsoContactDetails: false
    }

    this.toggleEdit = this.toggleEdit.bind(this)
    this.editDsoContactDetails = this.editDsoContactDetails.bind(this)
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

  editDsoContactDetails() {
    this.setState({ updatingDsoContactDetails: true })
    const data = this.dsoContactForm.getData()
    Api.editDsoContactDetails({
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
        this.setState({ updatingDsoContactDetails: false })
        this.props.history.push(`/home/view-contact?id=${getQueryObjByName("id")}&name=${this.state.dsoName}`)
      })
      .then((err) => {
        this.setState({ updatingDsoContactDetails: false })
        console.log("Error in updating dso contact details", err)
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

  toggleEdit() {
    console.log("name", this.state.dsoName)
    this.props.history.push(`/home/view-contact?id=${getQueryObjByName("id")}&name=${this.state.dsoName}`)
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
            !loadingDsoDetails &&
            <React.Fragment>
              <div id="dsoDetails" style={{ width: '100%' }}>
                <DsoNavbar />
                <div className="content">
                  <DsoContactForm
                    ref={(node) => this.dsoContactForm = node}
                    data={dsoDetailsData}
                    enableEdit={true}
                    toggleEdit={this.toggleEdit}
                    history={this.props.history}
                    updatingDsoContactDetails={updatingDsoContactDetails}
                    editDsoContactDetails={this.editDsoContactDetails}
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

export default EditContact