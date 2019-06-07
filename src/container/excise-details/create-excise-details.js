import React from "react"
import PageHeader from "Components/pageheader"
import Dialog from "Components/dialog"
import Button from "Components/button"
import ExciseNavbar from "./excise-navbar"
import ExciseDetailsForm from "./excise-details-form"
import * as Api from "./../../api"

class CreateExcise extends React.Component {
  constructor() {
    super()
    this.state = {
      creatingExciseDetails: false,
      mountDialog: false
    }
    this.navbarOptions = [
      { label: "Details", value: "details", path: "/home/excise/create-details" },
      // { label: "Locations", value: "locations", path: "/home/dso/view-locations" },
    ]

    this.handleCancel = this.handleCancel.bind(this)
    this.createExciseDetails = this.createExciseDetails.bind(this)
    this.unMountModal = this.unMountModal.bind(this)
  }

  handleCancel() {
    this.props.history.push("/home/excise-management")
  }

  createExciseDetails() {
    const data = this.exciseDetailsForm.getData()
    this.setState({
      creatingExciseDetails: true
    })
    Api.createExciseDetails({
      name: data.exciseName,
      state_id: data.selectedStateIdx,
      delivery_status: data.deliveryStatus,
      head_office_city_id: data.selectedCityIdx,
      head_office_address: data.headOfficeAddress,
      primary_contact_name: data.name,
      primary_contact_email: data.email,
      primary_contact_phone: data.phone
    })
      .then((response) => {
        this.setState({
          creatingExciseDetails: false
        })
        this.props.history.push(`/home/excise/view-details?stateId=${response.state_id}&name=${data.exciseName}`)
      })
      .catch((err) => {
        this.setState({ mountDialog: true, creatingExciseDetails: false })
        console.log("Error in creating excise", err)
      })
  }

  unMountModal() {
    this.setState({
      mountDialog: false
    })
  }

  render() {
    const { creatingExciseDetails, mountDialog } = this.state
    return (
      <React.Fragment>
        <PageHeader pageName="Excise Departments" text="Add new" />
        <div style={{
          display: "flex",
          marginTop: "30px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: '0px 60px'
        }}
        >
          <div id="exciseDetails" style={{ width: '100%', position: 'relative' }}>
            <ExciseNavbar navbarItems={this.navbarOptions} />
            <div className="content">
              <ExciseDetailsForm
                ref={(node) => { this.exciseDetailsForm = node }}
                creatingExciseDetails={creatingExciseDetails}
                enableEdit={true}
                action="create"
                handleCancel={this.handleCancel}
                handleClick={this.createExciseDetails}
                history={this.props.history}
              />
            </div>
          </div>
        </div>
        {
          mountDialog &&
          <Dialog
            title="Error in creating excise"
            onClick={this.unMountModal}
            actions={[
              <Button onClick={() => this.unMountModal()} primary>
                Done
              </Button>
            ]}
          />
        }
      </React.Fragment>
    )
  }
}

export default CreateExcise