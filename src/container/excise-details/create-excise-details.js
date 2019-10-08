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
    if (data.state.selectedStateIdx !== -1 && data.state.selectedCityIdx !== -1) {
      this.setState({
        creatingExciseDetails: true
      })

      Api.createExciseDetails({
        name: data.exciseName.state.value,
        state_id: data.state.selectedStateIdx,
        delivery_status: data.state.deliveryStatus,
        head_office_city_id: data.state.selectedCityIdx,
        head_office_address: data.state.headOfficeAddress,
        primary_contact_name: data.name.state.value,
        primary_contact_email: data.email.state.value,
        primary_contact_phone: data.phone.state.value
      })
        .then((response) => {
          this.setState({
            creatingExciseDetails: false
          })
          this.props.history.push(`/home/excise/view-details?stateId=${response.state_id}&name=${data.exciseName.state.value}`)
        })
        .catch((err) => {
          this.setState({ mountDialog: true, creatingExciseDetails: false })
          console.log("Error in creating excise", err)
        })
    }
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
        <PageHeader
          pageName="Excise Departments"
          text="Add new"
          pathname="/home/excise-management"
        />
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
            title={"Error in creating excise"}
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