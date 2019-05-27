import React from "react"
import TitleBar from "Components/titlebar"
import Label from "Components/label"
import DataTable from "Components/table/custom-table"
import { formatStateAndCityList } from "Utils/helpers"
import Icon from "Components/icon"

class DsoContactForm extends React.Component {

  constructor() {
    super()
    this.state = {
      dsoLocationDetails: [],
      stateList: [],
      cityList: [],
      stateMap: {},
      selectedStateIdx: -1,
      regionalOfficeCity: "",
      regionalOfficeAddress: "",
      regionalOfficeName: "",
      regionalOfficePhone: "",
      regionalOfficeEmail: ""
    }

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
    this.getData = this.getData.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    console.log("data", this.props.data)
    if (Object.keys(this.props.data).length > 0) {
      this.setState({
        dsoLocationDetails: this.props.data.state_details,
        // regionalOfficeCity: this.props.data.head_office.city,
        // regionalOfficeAddress: this.props.data.head_office.address,
        // regionalOfficeName: this.props.data.regional_office.contact.name,
        // regionalOfficePhone: this.props.data.regional_office.contact.phone,
        // regionalOfficeEmail: this.props.data.regional_office.contact.email
      })
      console.log(formatStateAndCityList(this.props.data.state_details))
    }
  }

  getData() {
    return this.state
  }

  handleChange(e) {
    this.setState({
      selectedStateIdx: parseInt(e.target.value)
    })
  }

  handleTextFieldChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    console.log("props", this.props)
    return (
      <React.Fragment>
        <TitleBar
          title={this.props.action !== "view"
            ? this.props.action === "create" ? "Add Location Details" : "Edit Location Details"
            : "Location Details"}
          enableEdit={this.props.enableEdit}
          handleClick={this.props.handleClick}
          handleCancel={this.props.handleCancel}
          //disableBtn={this.props.updatingDsoLocationDetails || this.props.creatingDsoLocationDetails}
        />
        <div className="item">
          <DataTable
            loadingData={false}
            message="No states added"
            headings={[
              { title: "State", icon: "", tooltipText: "" },
              { title: "Cities", icon: "", tooltipText: "" },
              { title: "Regional Office (City)", icon: "", tooltipText: "" },
              { title: "Address", icon: "", tooltipText: "" },
              { title: "Primary Contact", icon: "", tooltipText: "" },
              { title: "", icon: "", tooltipText: "" },
            ]}
          >
            {
              this.state.dsoLocationDetails.length > 0 &&
              this.state.dsoLocationDetails.map((item) => {
                return (
                  <tr>
                    <td>{item.state_name}</td>
                    <td>{item.city_list.substring(0, (item.city_list.length - 1))}</td>
                    <td>{item.reg_office_city}</td>
                    <td>{item.reg_office_address}</td>
                    <td>{item.reg_office_contact_phone}</td>
                    <td>
                      <a>Edit</a>
                    </td>
                  </tr>
                )
              })
            }
          </DataTable>
          {
            this.props.enableEdit &&
            <React.Fragment>
              <div className="item">
                <div className="icon">
                  <span><Icon name="addIcon" /></span>
                  <Label>Add State to DSO</Label>
                </div>
                <Select
                  options={this.state.stateList}
                  name="State"
                  onChange={e => this.handleChange(e)}
                  value={this.state.selectedStateIdx}
                />
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                  <p className="header">Regional Office</p>
                  <div className="item">
                    <Label>City</Label>
                    <input
                      type="text"
                      name="regionalOfficeCity"
                      style={{ width: '300px' }}
                      value={this.state.regionalOfficeCity}
                      onChange={this.handleTextFieldChange}
                      disabled={!this.props.enableEdit}
                    />
                  </div>
                  <div className="item">
                    <Label>Address</Label>
                    <textarea
                      name="regionalOfficeAddress"
                      style={{ width: '300px' }}
                      rows={4}
                      value={this.state.regionalOfficeAddress}
                      onChange={this.handleTextFieldChange}
                      disabled={!this.props.enableEdit}
                    />
                  </div>
                </div>
                <div style={{ width: '50%' }}>
                  <p className="header">Primary Contact</p>
                  <div className="item">
                    <Label>Name</Label>
                    <input
                      type="text"
                      name="name"
                      style={{ width: '300px' }}
                      value={this.state.name}
                      onChange={this.handleTextFieldChange}
                      disabled={!this.props.enableEdit}
                    />
                  </div>
                  <div className="item">
                    <Label>Email Address</Label>
                    <input
                      type="text"
                      name="email"
                      style={{ width: '300px' }}
                      value={this.state.email}
                      onChange={this.handleTextFieldChange}
                      disabled={!this.props.enableEdit}
                    />
                  </div>
                  <div className="item">
                    <Label>Phone</Label>
                    <input
                      type="text"
                      name="phone"
                      style={{ width: '300px' }}
                      value={this.state.phone}
                      onChange={this.handleTextFieldChange}
                      disabled={!this.props.enableEdit}
                    />
                  </div>
                </div>
              </div>
            </React.Fragment>
          }
        </div>
      </React.Fragment>
    )
  }
}

export default DsoContactForm