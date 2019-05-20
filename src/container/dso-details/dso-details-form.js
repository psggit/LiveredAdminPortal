import React from "react"
import Button from "Components/button"
import "./dso-details.scss"
import DataTable from "Components/table/custom-table"
import Label from "Components/label"
import Select from "Components/select"
import Icon from "Components/icon"
import { getQueryObjByName } from "Utils/url-utils"
import * as Api from "./../../api"

class DsoDetailsForm extends React.Component {
  constructor() {
    super()
    this.state = {
      dsoName: "",
      entityType: "",
      licenseType: "",
      isActive: false,
      selectedStateIdx: 1,
      enableEdit: "",
      stateList: []
    }

    this.handleEdit = this.handleEdit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggleDeliveryStatus = this.toggleDeliveryStatus.bind(this)
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
  }

  componentDidMount() {
    console.log("props", this.props)
    if (this.props.enableEdit) {
      Api.fetchStateAndCitiesList({})
        .then((response) => {
          // this.setState({
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
          //})
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
      isActive: this.props.data.is_active,
    })
  }

  handleChange(e) {
    selectedStateIdx: parseInt(e.target.value)
  }

  toggleDeliveryStatus() {
    this.setState({
      isActive: !this.state.isActive
    })
  }

  handleTextFieldChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleEdit() {
    this.props.history.push(`/home/dso/edit-details?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
  }

  render() {
    const { data } = this.props

    return (
      <React.Fragment>
        <div className="title-section">
          <div>
            <p>{this.props.title}</p>
          </div>
          {
            !this.props.enableEdit &&
            <Button custom icon="editIcon" onClick={this.handleEdit}>{this.props.buttonTitle}</Button>
          }
          {
            this.props.enableEdit &&
            <div className="button">
              <span style={{ marginRight: '10px' }}><Button primary>Save</Button></span>
              <span><Button secondary>Cancel</Button></span>
            </div>
          }
        </div>
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
                  ? <span style={{ marginRight: '10px' }} onClick={this.toggleDeliveryStatus}><Icon name="toggleGreen" /></span>
                  : <span style={{ marginRight: '10px' }} onClick={this.toggleDeliveryStatus}><Icon name="toggleRed" /></span>
              }
              <span
                onClick={this.toggleDeliveryStatus}
                style={{ cursor: 'pointer' }}
              >
                {this.state.isActive ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
          <div className="item">
            <DataTable
              loadingData={false}
              headings={[
                { title: "State", icon: "", tooltipText: "" },
                { title: "Delivery Status", icon: "info", tooltipText: "" },
                { title: "", icon: "", tooltipText: "" }
              ]}
            >
              <tr>
                <td>{"Tamilnadu"}</td>
                <td>
                  <div>
                    <span style={{ marginRight: '10px' }}><Icon name="toggleGreen" /></span>
                    Enabled
                  </div>
                </td>
                <td>{this.props.enableEdit ? <Icon name="deleteIcon" /> : ""}</td>
              </tr>
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
                  <Button primary>Add</Button>
                </div>
              </div>
            </div>
          }
        </div>
        <div className="item">
          <Button danger>Deactivate Swiggy</Button>
        </div>
      </React.Fragment>
    )
  }
}

export default DsoDetailsForm