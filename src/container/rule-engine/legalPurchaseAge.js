import React from "react"
import { NavLink } from "react-router-dom"
import Label from 'Components/label'
import Button from 'Components/button'
import './rule-engine.scss'
import TextInput from "Components/textInput"
import * as Api from "../../api"

class LegalPurchaseAge extends React.Component {

  constructor(props) {
    super(props)
    // this.legalPurchaseAge = React.createRef();
    this.state = {
      showSave: true,
      creatingLegalPurchaseAge: false,
      updatingLegalPurchaseAge: false,
      createdLegalAge: props.data && props.data.consumer_min_age ? true : false
    }
    this.saveLegalPurchaseAge = this.saveLegalPurchaseAge.bind(this)
    this.toggleSave = this.toggleSave.bind(this)
    this.createLegalPurchaseAge = this.createLegalPurchaseAge.bind(this)
    this.updateLegalPurchaseAge = this.updateLegalPurchaseAge.bind(this)
    this.getData = this.getData.bind(this)
  }

  toggleSave() {
    this.setState({ showSave: !this.state.showSave })
  }

  getData() {
    return this.state
  }

  createLegalPurchaseAge() {
    this.setState({ creatingLegalPurchaseAge: true })
    Api.createLegalPurchaseAge({
      state_id: this.props.stateId,
      consumer_min_age: parseInt(this.legalPurchaseAge.state.value)
    })
      .then((response) => {
        this.toggleSave()
        this.setState({ createdLegalAge: true, creatingLegalPurchaseAge: false })
      })
      .catch((err) => {
        this.setState({ creatingLegalPurchaseAge: false })
        console.log("Error in creating legal purchase age", err)
      })
  }

  updateLegalPurchaseAge() {
    this.setState({ updatingLegalPurchaseAge: true })
    Api.updateLegalPurchaseAge({
      state_id: this.props.stateId,
      consumer_min_age: parseInt(this.legalPurchaseAge.state.value)
    })
      .then((response) => {
        this.setState({ updatingLegalPurchaseAge: false })
        this.toggleSave()
      })
      .catch((err) => {
        this.setState({ updatingLegalPurchaseAge: false })
        console.log("Error in updating legal purchase age", err)
      })
  }

  saveLegalPurchaseAge(e) {
    e.preventDefault()
    if (this.props.action === "create") {
      this.createLegalPurchaseAge()
    } else {
      this.updateLegalPurchaseAge()
    }
  }

  render() {
    const { showSave, updatingLegalPurchaseAge, creatingLegalPurchaseAge, createdLegalAge } = this.state
    const { data, action } = this.props

    return (
      <form onSubmit={this.saveLegalPurchaseAge}>
        <div className="rule--body legal-age">
          <div className="title">
            <Label
              icon="info"
              tooltipText="Minimum legal age limit to place an order"
            >
              Legal Purchage Age
          </Label>
            {
              ((action === "edit" && showSave) || (action === "create" && (data.consumer_min_age === 0 && !createdLegalAge))) &&
              <div className="button-group">
                <Button
                  disabled={updatingLegalPurchaseAge || creatingLegalPurchaseAge}
                >
                  Save
                  </Button>
                <NavLink
                  to={location.pathname}
                  onClick={this.toggleSave}
                  onClick={this.toggleSave}
                  className="nav-link cancel"
                >
                  Cancel
                </NavLink>
              </div>
            }
            {
              this.props.action === "edit" && !showSave &&
              <NavLink
                onClick={this.toggleSave}
                to={location.pathname}
                className="nav-link save"
              >
                Edit
              </NavLink>
            }
          </div>
          <TextInput
            ref={input => (this.legalPurchaseAge = input)}
            // ref={this.legalPurchaseAge}
            name="legalPurchaseAge"
            pattern="([1]{1}[8-9]{1})|([2-9]{1}[0-9]{1})"
            isRequired={true}
            placeholder="legal purchase age"
            defaultValue={data && data.consumer_min_age ? data.consumer_min_age : ""}
            disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdLegalAge)}
            errorMessage="Legal purchase age is invalid"
            emptyMessage="Legal purchase age is required"
          />
        </div>
      </form >
    )
  }
}

export default LegalPurchaseAge