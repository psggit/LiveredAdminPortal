import React from "react"
import { NavLink } from "react-router-dom"
import Label from 'Components/label'
import Button from 'Components/button'
import './rule-engine.scss'
import TextInput from "Components/textInput"
import * as Api from "../../api"

class PossessionLimit extends React.Component {

  constructor() {
    super()
    this.state = {
      showSave: true,
      creatingPossessionLimit: false,
      updatingPossessionLimit: false
    }
    this.savePossessionLimit = this.savePossessionLimit.bind(this)
    this.toggleSave = this.toggleSave.bind(this)
    this.createPossessionLimit = this.createPossessionLimit.bind(this)
    this.updatePossessionLimit = this.updatePossessionLimit.bind(this)
    this.getUpdatedPossessionLimit = this.getUpdatedPossessionLimit.bind(this)
  }

  // componentDidMount() {
  //   this.fetchRules()
  // }

  // fetchRules() {
  //   this.setState({ loadingRules: true })
  //   Api.fetchRules({
  //     state_id: this.state.selectedStateIdx
  //   })
  //     .then((response) => {
  //       this.setState({
  //         loadingRules: false,
  //         legalPurchaseAge: response.rules.consumer_min_age
  //       })
  //     })
  //     .catch((err) => {
  //       this.setState({ loadingRules: false })
  //       console.log("Error in fetching rule list", err)
  //     })
  // }

  toggleSave() {
    this.setState({ showSave: !this.state.showSave })
  }

  getUpdatedPossessionLimit() {
    return [{
      brand_type: "IMFL",
      volume_limit: parseInt(this.IMFL.state.value)
    },
    {
      brand_type: "FMFL",
      volume_limit: parseInt(this.FMFL.state.value)
    },
    {
      brand_type: "Beer",
      volume_limit: parseInt(this.beer.state.value)
    },
    {
      brand_type: "Wine",
      volume_limit: parseInt(this.wine.state.value)
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
        this.setState({ creatingPossessionLimit: false })
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

  savePossessionLimit() {
    if (this.props.action === "create") {
      this.createPossessionLimit()
    } else {
      this.updatePossessionLimit()
    }
  }

  render() {
    const { showSave, updatingPossessionLimit, creatingPossessionLimit } = this.state
    const { data } = this.props
    console.log("data", data)
    return (
      <div className="rule--body possession-limit">
        <div className="title">
          <Label
            icon="info"
            tooltipText="The quantity of liquor that an individual can possess at any given time"
          >
            Possession Limit
          </Label>
          {
            this.props.action !== "view" && showSave &&
            <div className="button-group">
              <Button
                disabled={updatingPossessionLimit || creatingPossessionLimit}
                onClick={this.savePossessionLimit}
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
            this.props.action !== "view" && !showSave &&
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
            pattern="[0-9]*"
            isRequired={true}
            defaultValue={data.possession_limit && data.possession_limit.length > 0 ? data.possession_limit.find((item) => item.brand_type === "IMFL").volume_limit : 0}
            disabled={this.props.action === "view" || !this.state.showSave}
            errorMessage="IMFL is invalid"
            emptyMessage="IMFL is required"
          />
        </div>
        <div className="brand-type">
          <span>FMFL</span>
          <TextInput
            ref={input => (this.FMFL = input)}
            name="FMFL"
            pattern="[0-9]*"
            isRequired={true}
            defaultValue={data.possession_limit && data.possession_limit.length > 0 ? data.possession_limit.find((item) => item.brand_type === "FMFL").volume_limit : 0}
            disabled={this.props.action === "view" || !this.state.showSave}
            errorMessage="FMFL is invalid"
            emptyMessage="FMFL is required"
          />
        </div>
        <div className="brand-type">
          <span>Beer</span>
          <TextInput
            ref={input => (this.beer = input)}
            name="beer"
            pattern="[0-9]*"
            isRequired={true}
            defaultValue={data.possession_limit && data.possession_limit.length > 0 ? data.possession_limit.find((item) => item.brand_type === "Beer").volume_limit : 0}
            disabled={this.props.action === "view" || !this.state.showSave}
            errorMessage="Beer is invalid"
            emptyMessage="Beer is required"
          />
        </div>
        <div className="brand-type">
          <span>Wine</span>
          <TextInput
            ref={input => (this.wine = input)}
            name="wine"
            pattern="[0-9]*"
            isRequired={true}
            defaultValue={data.possession_limit && data.possession_limit.length > 0 ? data.possession_limit.find((item) => item.brand_type === "Wine").volume_limit : 0}
            disabled={this.props.action === "view" || !this.state.showSave}
            errorMessage="Wine is invalid"
            emptyMessage="Wine is required"
          />
        </div>
      </div>

    )
  }
}

export default PossessionLimit