import React from "react"
import TitleBar from "Components/titlebar"
import Label from "Components/label"

class DsoContactForm extends React.Component {

  constructor() {
    super()
    this.state = {
      headOfficeCity: "",
      headOfficeAddress: "",
      headOfficeContact: "",
      regionalOfficeName: "",
      regionalOfficePhone: "",
      regionalOfficeEmail: ""
    }

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
    this.getData = this.getData.bind(this)
  }

  componentDidMount() {
    console.log("data", this.props.data)
    if (Object.keys(this.props.data).length > 0) {
      this.setState({
        headOfficeCity: this.props.data.head_office.city,
        headOfficeAddress: this.props.data.head_office.address,
        headOfficeContact: this.props.data.head_office.contact.phone,
        regionalOfficeName: this.props.data.regional_office.contact.name,
        regionalOfficePhone: this.props.data.regional_office.contact.phone,
        regionalOfficeEmail: this.props.data.regional_office.contact.email
      })
    }
  }

  getData() {
    return this.state
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
          title={this.props.enableEdit ? "Edit Contact Details" : "Contact Details"}
          enableEdit={this.props.enableEdit}
          handleClick={this.props.enableEdit ? this.props.editDsoContactDetails : this.props.handleEdit}
          handleCancel={this.props.toggleEdit}
          disableBtn={this.props.updatingDsoContactDetails}
        />
        <div className="content-section" style={{ display: 'flex' }}>
          <div style={{ width: '50%' }}>
            <p className="header">Headquarters</p>
            <div className="item">
              <Label>City</Label>
              <input
                type="text"
                name="headOfficeCity"
                style={{ width: '300px' }}
                value={this.state.headOfficeCity}
                onChange={this.handleTextFieldChange}
                disabled={!this.props.enableEdit}
              />
            </div>
            <div className="item">
              <Label>Contact Details</Label>
              <input
                type="text"
                name="headOfficeContact"
                style={{ width: '300px' }}
                value={this.state.headOfficeContact}
                onChange={this.handleTextFieldChange}
                disabled={!this.props.enableEdit}
              />
            </div>
            <div className="item">
              <Label>Address</Label>
              <input
                type="text"
                name="headOfficeAddress"
                style={{ width: '300px' }}
                value={this.state.headOfficeAddress}
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
                name="regionalOfficeName"
                style={{ width: '300px' }}
                value={this.state.regionalOfficeName}
                onChange={this.handleTextFieldChange}
                disabled={!this.props.enableEdit}
              />
            </div>
            <div className="item">
              <Label>Email Address</Label>
              <input
                type="text"
                name="regionalOfficeEmail"
                style={{ width: '300px' }}
                value={this.state.regionalOfficeEmail}
                onChange={this.handleTextFieldChange}
                disabled={!this.props.enableEdit}
              />
            </div>
            <div className="item">
              <Label>Phone</Label>
              <input
                type="text"
                name="regionalOfficePhone"
                style={{ width: '300px' }}
                value={this.state.regionalOfficePhone}
                onChange={this.handleTextFieldChange}
                disabled={!this.props.enableEdit}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default DsoContactForm