import React from "react"
import { NavLink } from "react-router-dom"
import Label from 'Components/label'
import Button from 'Components/button'
import './rule-engine.scss'
import TextInput from "Components/textInput"
import * as Api from "../../api"

class DsoFee extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showSave: true,
      creatingDsoFee: false,
      updatingDsoFee: false,
      createdPermitRules: props.data.permit_rules && props.data.permit_rules.length > 0 ? true : false
    }

    this.saveDsoFee = this.saveDsoFee.bind(this)
    this.toggleSave = this.toggleSave.bind(this)
    this.createDsoFee = this.createDsoFee.bind(this)
    this.updateDsoFee == this.updateDsoFee.bind(this)
    this.getData = this.getData.bind(this)
  }

  toggleSave() {
    this.setState({ showSave: !this.state.showSave })
  }

  createDsoFee() {
    this.setState({ creatingDsoFee: true })
    Api.createDsoFee({
      state_id: this.props.stateId,
      permit_fee: parseInt(this.permitFee.state.value),
      cancellation_fee: parseInt(this.cancellationFee.state.value)
    })
      .then((response) => {
        this.toggleSave()
        this.setState({ creatingDsoFee: false, createdPermitRules: true })
      })
      .catch((err) => {
        this.setState({ creatingDsoFee: false })
        console.log("Error in creating dso fee", err)
      })
  }

  updateDsoFee() {
    this.setState({ updatingDsoFee: true })
    Api.updateDsoFee({
      state_id: this.props.stateId,
      permit_fee: parseInt(this.permitFee.state.value),
      cancellation_fee: parseInt(this.cancellationFee.state.value)
    })
      .then((response) => {
        this.setState({ updatingDsoFee: false })
        this.toggleSave()
      })
      .catch((err) => {
        this.setState({ updatingDsoFee: false })
        console.log("Error in updating dso fee", err)
      })
  }

  saveDsoFee(e) {
    e.preventDefault()
    if (this.props.action === "create") {
      this.createDsoFee()
    } else {
      this.updateDsoFee()
    }
  }

  getData() {
    return this.state
  }

  render() {
    const { showSave, updatingDsoFee, creatingDsoFee, createdPermitRules } = this.state
    const { data, action } = this.props
    return (
      <form onSubmit={this.saveDsoFee}>
        <div className="rule--body">
          <div className="cancellation-fee" style={{ margin: '20px 0 40px 0' }}>
            <div className="title">
              <Label
                icon="info"
                tooltipText="In case an OTTP (One Time Transport Permit) is cancelled, a cancellation fee will be charged"
              >
                Cancellation Fee (???)
              </Label>
              {
                ((action === "edit" && showSave) || (action === "create" && (data.permit_rules.length === 0 && !createdPermitRules))) &&
                <div className="button-group">
                  <Button
                    disabled={updatingDsoFee || creatingDsoFee}
                  // onClick={this.savePossessionLimit}
                  >
                    Save
                  </Button>
                  <NavLink
                    className="nav-link cancel"
                    to={location.pathname}
                    onClick={this.toggleSave}
                  >
                    Cancel
                  </NavLink>
                </div>
              }
              {
                this.props.action === "edit" && !showSave &&
                <NavLink
                  className="nav-link save"
                  onClick={this.toggleSave}
                  to={location.pathname}
                >
                  Edit
                </NavLink>
              }
            </div>
            <TextInput
              ref={input => (this.cancellationFee = input)}
              name="cancellationFee"
              pattern="[0-9]*"
              isRequired={true}
              defaultValue={`${data.permit_rules && data.permit_rules.length > 0 ? data.permit_rules[0].cancellation_fee : ""}`}
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdPermitRules)}
              errorMessage="Cancellation fee is invalid"
              emptyMessage="Cancellation fee is required"
            />
          </div>
          <div className="permit-fee" style={{ marginTop: '10px' }}>
            <div className="title">
              <Label
                icon="info"
                tooltipText="Amount charged per OTTP per order"
              >
                Cost/Permit (???)
            </Label>
            </div>
            <TextInput
              ref={input => (this.permitFee = input)}
              name="permitFee"
              pattern="^[0-9]*"
              isRequired={true}
              defaultValue={`${data.permit_rules && data.permit_rules.length > 0 ? data.permit_rules[0].permit_cost : ""}`}
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdPermitRules)}
              errorMessage="Permit fee is invalid"
              emptyMessage="Permit fee is required"
            />
          </div>
        </div>
      </form>
    )
  }
}

export default DsoFee