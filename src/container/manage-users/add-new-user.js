import React from "react"
import "Sass/wrapper.scss"
import Label from "Components/label"
import PageHeader from "Components/pageheader"
import NewUserForm from "./new-user-form"
import * as Api from "./../../api"

class AddNewUser extends React.Component {

  constructor() {
    super()
    this.state = {
      creatingUser: false
    }
    this.handleAddNewUser = this.handleAddNewUser.bind(this)
    this.addNewDsoUser = this.addNewDsoUser.bind(this)
    this.addNewExciseUser = this.addNewExciseUser.bind(this)
    this.addNewSupportUser = this.addNewSupportUser.bind(this)
  }

  addNewDsoUser() {
    const data = this.newUserForm.getData()
    this.setState({ creatingUser: true })
    Api.createDsoUser({
      name: data.name,
      email: data.email,
      designation: data.designation,
      dso_id: data.selectedDsoIdx,
      roles: [{
        role_id: data.selectedRoleIdx
      }]
    })
      .then((response) => {
        this.setState({ creatingUser: false })
        this.props.history.push("/home/dso-users")
      })
      .catch((err) => {
        this.setState({ creatingUser: false })
        console.log("Error in creating dso user", err)
      })
  }

  addNewExciseUser() {
    const data = this.newUserForm.getData()
    this.setState({ creatingUser: true })
    Api.createExciseUser({
      name: data.name,
      email: data.email,
      designation: data.designation,
      state_id: data.selectedStateIdx,
      roles: [{
        role_id: data.selectedRoleIdx
      }]
    })
      .then((response) => {
        this.setState({ creatingUser: false })
        this.props.history.push("/home/excise-users")
      })
      .catch((err) => {
        this.setState({ creatingUser: false })
        console.log("Error in creating excise user", err)
      })
  }

  addNewSupportUser() {
    const data = this.newUserForm.getData()
    this.setState({ creatingUser: true })
    Api.createSupportUser({
      name: data.name,
      email: data.email,
      designation: data.designation,
      roles: [{
        role_id: data.selectedRoleIdx
      }]
    })
      .then((response) => {
        this.setState({ creatingUser: false })
        this.props.history.push("/home/support-users")
      })
      .catch((err) => {
        this.setState({ creatingUser: false })
        console.log("Error in creating support user", err)
      })
  }

  handleAddNewUser() {
    const data = this.newUserForm.getData()
    if (data.selectedUserType.indexOf("Excise") !== -1) {
      this.addNewExciseUser()
    } else if (data.selectedUserType.indexOf("Admin") !== -1) {
      this.addNewSupportUser()
    } else {
      this.addNewDsoUser()
    }
    console.log("data", data)
  }

  render() {
    return (
      <React.Fragment>
        <PageHeader pageName="Users & Roles" />
        <div className="wrapper">
          <div className="content">
            <p style={{ fontSize: '24px', color: '#2d3f49', marginBottom: '30px' }}>
              Add User
            </p>
            <NewUserForm
              ref={(node) => { this.newUserForm = node }}
              title="Add User"
              handleAddNewUser={this.handleAddNewUser}
              disableSave={this.state.creatingUser}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default AddNewUser