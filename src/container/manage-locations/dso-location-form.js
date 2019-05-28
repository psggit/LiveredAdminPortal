import React from "react"
import TitleBar from "Components/titlebar"
import Label from "Components/label"
import DataTable from "Components/table/custom-table"
import { formatStateAndCityList } from "Utils/helpers"
import Icon from "Components/icon"
import Button from "Components/button"
import Select from "Components/select"
import {fetchStateAndCitiesList} from "./../../api"
import TextInput from "Components/textInput"

class DsoLocationForm extends React.Component {

  constructor() {
    super()
    this.state = {
      dsoLocationDetails: [],
      stateList: [],
      cityList: [],
      stateMap: {},
      deliverableCityList: [],
      selectedStateIdx: -1,
      selectedCityIdx: -1,
      regionalOfficeCity: "",
      regionalOfficeAddress: "",
      name: "",
      email: "",
      phone: ""
    }

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
    this.getData = this.getData.bind(this)
    this.formatResponse = this.formatResponse.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleRowClick = this.handleRowClick.bind(this)
    this.handleCityChange = this.handleCityChange.bind(this)
    this.updateCityList = this.updateCityList.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  componentDidMount() {
    if (Object.keys(this.props.data).length > 0) {
      this.setState({
        dsoLocationDetails: this.props.data.state_details
      })
    }
    if(this.props.enableEdit) {
      this.fetchCityAndStates()
    }
  }

  fetchCityAndStates() {
    fetchStateAndCitiesList()
      .then((response) => {
        this.formatResponse(response)
      })
      .catch((err) => {
        console.log("Error in fetching state and cities")
      })
  }


  formatResponse(response) {
    const cityList = response.cities.map((item) => {
      return {
        text: item.city_name,
        value: item.id,
        //stateId: item.StateId
      }
    })

    const stateList = response.states.map((item) => {
      return {
        text: item.state_name,
        value: item.id
      }
    })

    this.setState({ stateList, cityList, stateMap: response.stateCity })
  }

  updateCityList(stateId) {
    let cityList = this.state.stateMap[stateId].cities
    cityList = cityList.map((item) => {
      return {
        text: item.city_name,
        value: item.city_id
      }
    })
    this.setState({ cityList })
  }

  getData() {
    return this.state
  }

  handleChange(e) {
    this.setState({
      selectedStateIdx: parseInt(e.target.value)
    })
    this.updateCityList(parseInt(e.target.value))
  }

  handleCityChange(e) {
    this.setState({
      selectedCityIdx: parseInt(e.target.value)
    })
  }

  handleSave() {
    if(this.props.enableEdit) {
      this.setState({
        regionalOfficeCity: this.regOfficeCity.state.value,
        name: this.name.state.value,
        email: this.email.state.value,
        phone: this.phone.state.value
      }, () => {
        this.props.handleClick()
      })
    } else {
      this.props.handleClick()
    }
  }

  handleRowClick(item) {
    this.setState({
      selectedStateIdx: parseInt(item.state_id),
      regionalOfficeCity: item.reg_office_city,
      regionalOfficeAddress: item.reg_office_address,
      name: item.reg_office_contact_name,
      email: item.reg_office_contact_email,
      phone: item.reg_office_contact_phone,
      deliverableCityList: item.city_list.trim().substring(0, item.city_list.length - 2).split(",")
    })
  }

  handleTextFieldChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return (
      <React.Fragment>
        <TitleBar
          title={this.props.action !== "view"
            ? this.props.action === "create" ? "Add Location Details" : "Edit Location Details"
            : "Location Details"}
          enableEdit={this.props.enableEdit}
          handleClick={this.props.handleClick}
          handleCancel={this.props.handleCancel}
          disableBtn={this.props.updatingDsoLocationDetails || this.props.creatingDsoLocationDetails}
        />
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
                  <tr className={`clickable ${this.state.selectedStateIdx === item.state_id ? 'highlight' : ''}`} onClick={() => this.handleRowClick(item)}>
                    <td>{item.state_name}</td>
                    <td>{item.city_list.substring(0, (item.city_list.length - 1))}</td>
                    <td>{item.reg_office_city}</td>
                    <td>{item.reg_office_address}</td>
                    <td>{item.reg_office_contact_phone}</td>
                    <td>
                      {this.props.enableEdit ? <a>Edit</a> : ""}
                    </td>
                  </tr>
                )
              })
            }
          </DataTable>
          {
            this.props.enableEdit &&
            <React.Fragment>
            <div className="item" style={{ borderBottom: '1px solid #e2e5e8' }}>
              <div className="item">
                <div className="icon">
                  <span><Icon name="addIcon" /></span>
                  <Label>Add State to DSO</Label>
                </div>
                <Select
                  options={this.state.stateList}
                  name="State"
                  placeholder="state"
                  onChange={e => this.handleChange(e)}
                  value={this.state.selectedStateIdx}
                />
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                  <p className="header">Regional Office</p>
                  <div className="item">
                    <Label>City</Label>
                    {/* <input
                      type="text"
                      name="regionalOfficeCity"
                      style={{ width: '300px' }}
                      value={this.state.regionalOfficeCity}
                      onChange={this.handleTextFieldChange}
                      disabled={!this.props.enableEdit}
                    /> */}
                    <TextInput
                      ref={input => (this.regOfficeCity = input)}
                      name="regionalOfficeCity"
                      pattern="[a-zA-Z]*"
                      isRequired={true}
                      placeholder="city"
                      defaultValue={this.state.regionalOfficeCity}
                      disabled={!this.props.enableEdit}
                      errorMessage="City is invalid"
                      emptyMessage="City is required"
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
                    {/* <input
                      type="text"
                      name="name"
                      style={{ width: '300px' }}
                      value={this.state.name}
                      onChange={this.handleTextFieldChange}
                      disabled={!this.props.enableEdit}
                    /> */}
                    <TextInput
                      ref={input => (this.name = input)}
                      name="name"
                      pattern="[a-zA-Z]*"
                      isRequired={true}
                      placeholder="name"
                      defaultValue={this.state.name}
                      disabled={!this.props.enableEdit}
                      errorMessage="Name is invalid"
                      emptyMessage="Name is required"
                    />
                  </div>
                  <div className="item">
                    <Label>Email Address</Label>
                    {/* <input
                      type="text"
                      name="email"
                      style={{ width: '300px' }}
                      value={this.state.email}
                      onChange={this.handleTextFieldChange}
                      disabled={!this.props.enableEdit}
                    /> */}
                    <TextInput
                      ref={input => (this.email = input)}
                      name="email"
                      pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                      isRequired={true}
                      placeholder="email"
                      defaultValue={this.state.email}
                      disabled={!this.props.enableEdit}
                      errorMessage="Email is invalid"
                      emptyMessage="Email is required"
                    />
                  </div>
                  <div className="item">
                    <Label>Phone</Label>
                    {/* <input
                      type="text"
                      name="phone"
                      style={{ width: '300px' }}
                      value={this.state.phone}
                      onChange={this.handleTextFieldChange}
                      disabled={!this.props.enableEdit}
                    /> */}
                    <TextInput
                      ref={input => (this.phone = input)}
                      name="phone"
                      pattern="[0-9]*"
                      isRequired={true}
                      placeholder="phone"
                      defaultValue={this.state.phone}
                      disabled={!this.props.enableEdit}
                      errorMessage="Phone is invalid"
                      emptyMessage="Phone is required"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
               <div className="icon">
                 <span><Icon name="addIcon" /></span>
                 <Label>Add cities</Label>
               </div>
               <Select
                 options={this.state.cityList}
                 name="City"
                 large
                 placeholder="city"
                 onChange={e => this.handleCityChange(e)}
                 value={this.state.selectedCityIdx}
               />
            </div>
            <div style={{marginTop: '20px'}}>
              <Button 
                secondary 
                onClick={() => this.handleSave()}
                disabled={this.props.updatingDsoLocationDetails}
              >
                {
                  location.href.indexOf("edit") !== -1 ? 'Update' : 'Add State'
                }
              </Button>
            </div>
           </React.Fragment>
          }
      </React.Fragment>
    )
  }
}

export default DsoLocationForm