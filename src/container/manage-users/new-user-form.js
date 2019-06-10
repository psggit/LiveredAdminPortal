import React from "react"
import Label from "Components/label"
import TextInput from "Components/textInput"
import Select from "Components/select"
import Button from "Components/button"
import * as Api from "./../../api"

const optionList = [
  { text: "Excise User", value: 1 },
  { text: "DSO User", value: 2 },
  { text: "Admin Portal User", value: 3 }
]

class AddNewUser extends React.Component {
  constructor() {
    super()
    this.state = {
      selectedUserTypeIdx: 1,
      selectedDsoIdx: -1,
      selectedRoleIdx: -1,
      selectedStateIdx: -1,
      name: "",
      email: "",
      designation: "",
      selectedUserType: "Excise User",
      userRoles: [],
      dsoList: [],
      stateList: []
    }
    this.handleDsoChange = this.handleDsoChange.bind(this)
    this.handleRoleChange = this.handleRoleChange.bind(this)
    this.handleUserTypeChange = this.handleUserTypeChange.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
    this.fetchDsoList = this.fetchDsoList.bind(this)
    this.fetchRolesList = this.fetchRolesList.bind(this)
    this.getData = this.getData.bind(this)
    this.handleAddNewUser = this.handleAddNewUser.bind(this)
  }

  componentDidMount() {
    this.fetchDsoList()
    this.fetchExciseList()
    this.fetchRolesList()
  }

  fetchExciseList() {
    Api.fetchStateAndCitiesList({})
      .then((response) => {
        const stateList = response.states.map((item) => {
          return {
            text: item.state_name,
            value: item.id
          }
        })
        this.setState({ stateList, selectedStateIdx: stateList[0].value })
      })
      .catch((err) => {
        console.log("Error in fetching excise list", err)
      })
  }

  fetchDsoList() {
    Api.fetchDSOList({
      offset: 0,
      limit: 1000
    })
      .then((response) => {
        const dsoList = response.dso.map((item) => {
          return {
            text: item.dso_name,
            value: item.dso_id
          }
        })
        this.setState({ dsoList, selectedDsoIdx: dsoList[0].value })
      })
      .catch((err) => {
        console.log("Error in fetching dso list", err)
      })
  }

  fetchRolesList() {
    Api.fetchUserRoles()
      .then((response) => {
        console.log("roles", response)
        const userRoles = response.roles.map((item) => {
          return {
            text: item.name,
            value: item.role_id
          }
        })
        this.setState({ userRoles, selectedRoleIdx: userRoles[0].value })
      })
      .catch((error) => {
        console.log("Error in fetching roles list", error)
      })
  }

  handleStateChange(e) {
    this.setState({
      selectedStateIdx: e.target.value
    })
  }

  handleUserTypeChange(e) {
    this.setState({
      selectedUserTypeIdx: parseInt(e.target.value),
      selectedUserType: optionList.find((item) => item.value === parseInt(e.target.value)).text
    })
  }

  handleDsoChange(e) {
    this.setState({
      selectedDsoIdx: e.target.value
    })
  }

  handleRoleChange() {
    this.setState({
      selectedRoleIdx: e.target.value
    })
  }

  getData() {
    return this
  }

  handleAddNewUser(e) {
    e.preventDefault()
    this.props.handleAddNewUser()
  }

  render() {
    const { dsoList, userRoles, stateList, selectedUserTypeIdx } = this.state
    return (
      <form onSubmit={this.handleAddNewUser}>
        <div className="item">
          <Label>Name</Label>
          <TextInput
            ref={input => (this.name = input)}
            name="name"
            pattern="^[^-\s][a-zA-Z0-9_\s-]+$"
            isRequired={true}
            placeholder="name"
            // defaultValue={this.state.name}
            // disabled={!this.props.enableEdit}
            errorMessage="Name is invalid"
            emptyMessage="Name is required"
          />
        </div>
        <div className="item">
          <Label>Email address</Label>
          <TextInput
            ref={input => (this.email = input)}
            name="email"
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            isRequired={true}
            placeholder="email"
            // defaultValue={this.state.email}
            // disabled={!this.props.enableEdit}
            errorMessage="Email is invalid"
            emptyMessage="Email is required"
          />
        </div>
        <div className="item">
          <Label>Designation</Label>
          <TextInput
            ref={input => (this.designation = input)}
            name="designation"
            pattern="^[^-\s][a-zA-Z0-9_\s-]+$"
            isRequired={true}
            placeholder="designation"
            // defaultValue={this.state.designation}
            // disabled={!this.props.enableEdit}
            errorMessage="Designation is invalid"
            emptyMessage="Designation is required"
          />
        </div>
        <div className="item">
          <Label>User type</Label>
          <Select
            options={optionList}
            name="selectedUserTypeIdx"
            placeholder="user type"
            onChange={e => this.handleUserTypeChange(e)}
            value={this.state.selectedUserTypeIdx}
          // disabled={!this.props.enableEdit}
          />
        </div>
        {
          selectedUserTypeIdx === 1 &&
          <div className="item">
            <Label>Excise department</Label>
            <Select
              options={stateList}
              name="selectedStateIdx"
              placeholder="state"
              onChange={e => this.handleStateChange(e)}
              value={this.state.selectedStateIdx}
            // disabled={!this.props.enableEdit}
            />
          </div>
        }
        {
          selectedUserTypeIdx === 2 &&
          <div className="item">
            <Label>DSO</Label>
            <Select
              options={dsoList}
              name="selectedDsoIdx"
              placeholder="dso"
              onChange={e => this.handleDsoChange(e)}
              value={this.state.selectedDsoIdx}
            // disabled={!this.props.enableEdit}
            />
          </div>
        }
        <div className="item">
          <Label>Roles</Label>
          <Select
            options={userRoles}
            name="selectedRoleIdx"
            placeholder="role"
            onChange={e => this.handleRoleChange(e)}
            value={this.state.selectedRoleIdx}
          // disabled={!this.props.enableEdit}
          />
        </div>
        <div className="item">
          <Button primary disabled={this.props.disableSave}>ADD</Button>
        </div>
      </form>
    )
  }
}

export default AddNewUser