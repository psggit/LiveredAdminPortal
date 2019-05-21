import React from "react"
import Button from "Components/button"
import "Sass/wrapper.scss"
import DataTable from "Components/table/custom-table"
import Label from "Components/label"
import Select from "Components/select"
import Icon from "Components/icon"
import { getQueryObjByName } from "Utils/url-utils"
import * as Api from "./../../api"
import Dialog from "Components/dialog"
import TitleBar from "Components/titlebar"

class DsoDetailsForm extends React.Component {
  constructor() {
    super()
    this.state = {
      dsoName: "",
      entityType: "",
      licenseType: "",
      isActive: false,
      selectedStateIdx: -1,
      enableEdit: "",
      stateList: [],
      showDeliveryStatusModal: false,
      showStateDeliveryStatusModal: false,
      deliverableStateDetails: [],
      deliverableStateMap: {}
    }

    this.mountModal = this.mountModal.bind(this)
    this.unmountModal = this.unmountModal.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getData = this.getData.bind(this)
    this.addDsoState = this.addDsoState.bind(this)
    this.toggleDeliveryStatus = this.toggleDeliveryStatus.bind(this)
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
    this.toggleStateServiceStatus = this.toggleStateServiceStatus.bind(this)
  }

  componentDidMount() {
    const deliverableStateMap = {}
    this.props.data.state_details.map((item) => {
      deliverableStateMap[item.state_id] = item
    })

    this.setState({
      deliverableStateDetails: this.props.data.state_details,
      deliverableStateMap
    })
    if (this.props.enableEdit) {
      Api.fetchStateAndCitiesList({})
        .then((response) => {
          const stateList = response.states.map((item) => {
            return {
              text: item.state_name,
              value: item.id
            }
          })
          this.setState({
            stateList,
            selectedStateIdx: stateList[0].value
          })
        })
        .catch((err) => {
          console.log("Error in fetching states and cities")
        })
    }
    this.setState({
      loadingDsoDetails: true,
      dsoName: getQueryObjByName("name"),
      entityType: this.props.data.entity_type,
      licenseType: this.props.data.license_type,
      isActive: this.props.data.is_active
    })
  }

  handleChange(e) {
    selectedStateIdx: parseInt(e.target.value)
  }

  toggleDeliveryStatus() {
    Api.toggleDeliveryStatus({
      dso_id: getQueryObjByName("id"),
      is_active: !this.state.isActive
    })
      .then((response) => {
        this.setState({
          isActive: !this.state.isActive
        })
        this.unmountModal("DeliveryStatus")
      })
      .catch((err) => {
        console.log("Error in changing delivery status", err)
        this.unmountModal("DeliveryStatus")
      })
  }

  handleTextFieldChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  mountModal(name) {
    const flagName = (`show${name}Modal`)
    this.setState({
      [flagName]: true
    })
  }

  unmountModal(name) {
    const flagName = (`show${name}Modal`)
    this.setState({
      [flagName]: false
    })
  }

  addDsoState() {
    Api.addDsoStateDetails({
      dso_id: getQueryObjByName("id"),
      state_id: this.state.selectedStateIdx,
      service_status: true
    })
      .then((response) => {
        location.reload()
      })
      .catch((err) => {
        console.log("Error in adding dso state", err)
      })
  }

  toggleStateServiceStatus() {
    Api.toggleStateServiceStatus({
      state_id: this.stateId,
      dso_id: getQueryObjByName("id"),
      service_status: !this.serviceStatus
    })
      .then((response) => {
        console.log("location", location.pathname)
        this.unmountModal("StateDeliveryStatus")
        location.reload()
      })
      .catch((err) => {
        console.log("Error in updating state delivery status", err)
        this.unmountModal("StateDeliveryStatus")
      })
  }

  getData() {
    return this.state
  }

  render() {
    const { showDeliveryStatusModal, showStateDeliveryStatusModal } = this.state
    console.log("props", this.props.enableEdit)
    return (
      <React.Fragment>
        <TitleBar
          title={this.props.enableEdit ? "Edit Basic Details" : "Basic Details"}
          enableEdit={this.props.enableEdit}
          handleClick={this.props.enableEdit ? this.props.editDsoDetails : this.props.handleEdit}
          handleCancel={this.props.toggleEdit}
        />

        <div className="content-section">
          <div className="item">
            <Label>DSO</Label>
            <input
              type="text"
              name="dsoName"
              value={this.state.dsoName}
              onChange={this.handleTextFieldChange}
              disabled={!this.props.enableEdit}
            />
          </div>
          <div className="item">
            <Label>Entity type</Label>
            <input
              type="text"
              name="entityType"
              value={this.state.entityType}
              disabled={!this.props.enableEdit}
              onChange={this.handleTextFieldChange}
            />
          </div>
          <div className="item">
            <Label>License type</Label>
            <input
              type="text"
              name="licenseType"
              value={this.state.licenseType}
              disabled={!this.props.enableEdit}
              onChange={this.handleTextFieldChange}
            />
          </div>
          <div className="item">
            <Label
              icon="info"
              tooltipText="Minimum legal age limit to place an order"
            >
              Delivery Status
            </Label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {
                this.state.isActive
                  ? <span style={{ marginRight: '10px' }} onClick={() => this.mountModal("DeliveryStatus")}>
                    <Icon name="toggleGreen" />
                  </span>
                  : <span style={{ marginRight: '10px' }} onClick={() => this.mountModal("DeliveryStatus")}>
                    <Icon name="toggleRed" />
                  </span>
              }
              <span
                onClick={() => this.mountModal("DeliveryStatus")}
                style={{ cursor: 'pointer' }}
              >
                {this.state.isActive ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
          <div className="item">
            <DataTable
              loadingData={false}
              message="No states added. Add states from the dropdown"
              headings={[
                { title: "State", icon: "", tooltipText: "" },
                { title: "Delivery Status", icon: "info", tooltipText: "Current status of delivery operations for a delivery service operator" },
                // { title: "", icon: "", tooltipText: "" }
              ]}
            >
              {
                this.state.deliverableStateDetails.length > 0 &&
                this.state.deliverableStateDetails.map((item) => {
                  return (
                    <tr>
                      <td>{item.state_name}</td>
                      <td>
                        <div className="text-icon">
                          {
                            item.service_status
                              ? <span style={{ marginRight: '10px' }}><Icon name="toggleGreen" /></span>
                              : <span style={{ marginRight: '10px' }}><Icon name="toggleRed" /></span>
                          }
                          <span style={{ cursor: 'pointer' }}
                            onClick={() => {
                              this.stateId = item.state_id,
                                this.serviceStatus = item.service_status,
                                this.mountModal("StateDeliveryStatus")
                            }}
                          >
                            {item.service_status ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </td>
                      {/* <td>
                        <span style={{ cursor: 'pointer' }}>
                          {this.props.enableEdit ? <Icon name="deleteIcon" /> : ""}
                        </span>
                      </td> */}
                    </tr>
                  )
                })
              }
            </DataTable>
          </div>
          {
            this.props.enableEdit &&
            <div className="item">
              <div className="icon">
                <span><Icon name="addIcon" /></span>
                <Label>Add State to DSO</Label>
              </div>
              <div style={{ display: 'flex' }}>
                <Select
                  options={this.state.stateList}
                  name="State"
                  onChange={e => this.handleChange(e)}
                  value={this.state.selectedStateIdx}
                />
                <div style={{ marginLeft: '10px' }}>
                  <Button primary onClick={this.addDsoState}>Add</Button>
                </div>
              </div>
            </div>
          }
        </div>
        {
          showDeliveryStatusModal &&
          (
            <Dialog
              title="Are you sure you want to perform this action?"
              actions={[
                <Button onClick={() => this.toggleDeliveryStatus()} primary>
                  Yes
                </Button>,
                <Button onClick={() => this.unmountModal("DeliveryStatus")} secondary>
                  No
                </Button>
              ]}
            />
          )
        }
        {
          showStateDeliveryStatusModal &&
          (
            <Dialog
              title="Are you sure you want to perform this action?"
              actions={[
                <Button onClick={() => this.toggleStateServiceStatus()} primary>
                  Yes
                </Button>,
                <Button onClick={() => this.unmountModal("StateDeliveryStatus")} secondary>
                  No
                </Button>
              ]}
            />
          )
        }
      </React.Fragment>
    )
  }
}

export default DsoDetailsForm