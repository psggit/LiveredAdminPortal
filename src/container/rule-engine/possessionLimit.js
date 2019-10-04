import React from "react"
import { NavLink } from "react-router-dom"
import Label from 'Components/label'
import Button from 'Components/button'
import './rule-engine.scss'
import TextInput from "Components/textInput"
import * as Api from "../../api"

class PossessionLimit extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showSave: true,
      creatingPossessionLimit: false,
      updatingPossessionLimit: false,
      createdPossessionLimit: props.data.possession_limit && props.data.possession_limit.length > 0 ? true : false
    }
    this.savePossessionLimit = this.savePossessionLimit.bind(this)
    this.toggleSave = this.toggleSave.bind(this)
    this.createPossessionLimit = this.createPossessionLimit.bind(this)
    this.updatePossessionLimit = this.updatePossessionLimit.bind(this)
    this.getUpdatedPossessionLimit = this.getUpdatedPossessionLimit.bind(this)
    this.getData = this.getData.bind(this)
  }

  toggleSave() {
    this.setState({ showSave: !this.state.showSave })
  }

  getData() {
    return this.state
  }

  getUpdatedPossessionLimit() {
    return [{
      brand_type: "IMFL",
      volume_limit: (this.IMFL.state.value) * 1000
    },
    {
      brand_type: "FMFL",
      volume_limit: (this.FMFL.state.value) * 1000
    },
    {
      brand_type: "Beer",
      volume_limit: (this.beer.state.value) * 1000
    },
    {
      brand_type: "Wine",
      volume_limit: (this.wine.state.value) * 1000
    }]
  }

  createPossessionLimit() {
    this.setState({ creatingPossessionLimit: true })
    Api.createPossessionLimit({
      state_id: this.props.stateId,
      category: this.getUpdatedPossessionLimit()
    })
      .then((response) => {
        this.toggleSave()
        this.setState({ creatingPossessionLimit: false, createdPossessionLimit: true })
      })
      .catch((err) => {
        this.setState({ creatingPossessionLimit: false })
        console.log("Error in creating possession limit", err)
      })
  }

  updatePossessionLimit() {
    this.setState({ updatingPossessionLimit: true })
    Api.updatePossessionLimit({
      state_id: this.props.stateId,
      category: this.getUpdatedPossessionLimit()
    })
      .then((response) => {
        this.setState({ updatingPossessionLimit: false })
        this.toggleSave()
      })
      .catch((err) => {
        this.setState({ updatingPossessionLimit: false })
        console.log("Error in updating possession limit", err)
      })
  }

  savePossessionLimit(e) {
    e.preventDefault()
    if (this.props.action === "create") {
      this.createPossessionLimit()
    } else {
      this.updatePossessionLimit()
    }
  }

  render() {
    const { showSave, updatingPossessionLimit, creatingPossessionLimit, createdPossessionLimit } = this.state
    const { data, action } = this.props
    return (
      <form onSubmit={this.savePossessionLimit}>
        <div className="rule--body possession-limit">
          <div className="title">
            <Label
              icon="info"
              tooltipText="Quantity of liquor that an individual can possess at any given time"
            >
              Possession Limit (Litres)
          </Label>
            {
              ((action === "edit" && showSave) || (action === "create" && (data.possession_limit.length === 0 && !createdPossessionLimit))) &&
              <div className="button-group">
                <Button
                  disabled={updatingPossessionLimit || creatingPossessionLimit}
                //onClick={this.savePossessionLimit}
                >
                  Save
              </Button>
                <NavLink
                  to={location.pathname}
                  className="nav-link cancel"
                  onClick={this.toggleSave}
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

          <div className="brand-type">
            <span>IMFL</span>
            <TextInput
              ref={input => (this.IMFL = input)}
              name="IMFL"
              pattern="[0-9.]*"
              isRequired={true}
              defaultValue={
                data.possession_limit && data.possession_limit.length > 0
                  ? data.possession_limit.find((item) => item.brand_type === "IMFL").volume_limit / 1000
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdPossessionLimit)}
              errorMessage="IMFL is invalid"
              emptyMessage="IMFL is required"
            />
          </div>
          <div className="brand-type">
            <span>FMFL</span>
            <TextInput
              ref={input => (this.FMFL = input)}
              name="FMFL"
              pattern="[0-9.]*"
              isRequired={true}
              defaultValue={
                data.possession_limit && data.possession_limit.length > 0
                  ? data.possession_limit.find((item) => item.brand_type === "FMFL").volume_limit / 1000
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdPossessionLimit)}
              errorMessage="FMFL is invalid"
              emptyMessage="FMFL is required"
            />
          </div>
          <div className="brand-type">
            <span>Beer</span>
            <TextInput
              ref={input => (this.beer = input)}
              name="beer"
              pattern="[0-9.]*"
              isRequired={true}
              defaultValue={
                data.possession_limit && data.possession_limit.length > 0
                  ? data.possession_limit.find((item) => item.brand_type === "Beer").volume_limit / 1000
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdPossessionLimit)}
              errorMessage="Beer is invalid"
              emptyMessage="Beer is required"
            />
          </div>
          <div className="brand-type">
            <span>Wine</span>
            <TextInput
              ref={input => (this.wine = input)}
              name="wine"
              pattern="[0-9.]*"
              isRequired={true}
              defaultValue={
                data.possession_limit && data.possession_limit.length > 0
                  ? data.possession_limit.find((item) => item.brand_type === "Wine").volume_limit / 1000
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdPossessionLimit)}
              errorMessage="Wine is invalid"
              emptyMessage="Wine is required"
            />
          </div>
        </div>
      </form>
    )
  }
}

export default PossessionLimit