import React from 'react'
import PageHeader from 'Components/pageheader'
import Label from 'Components/label'
import Select from "Components/select"
import Button from "Components/button"
import './rule-engine.scss'
import * as Api from "../../api"
import { getQueryObjByName } from "Utils/url-utils"
import LegalPurchaseAge from "./legalPurchaseAge"
import PossessionLimit from "./possessionLimit"
import DsoFee from "./dsoFee"
import TimeRestrictions from './timeRestriction'
import Dialog from "Components/dialog"
import SpecialRestrictions from "./specialRestriction"

class RuleManagement extends React.Component {
  constructor() {
    super()

    this.state = {
      rulesData: {},
      stateList: [],
      selectedStateIdx: parseInt(getQueryObjByName("stateId")) || -1,
      selectedStateName: getQueryObjByName("stateName") || "",
      loadingRules: true,
      showErrorModal: false
    }

    this.fetchRules = this.fetchRules.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleSetRules = this.handleSetRules.bind(this)
    this.fetchAndViewExciseRules = this.fetchAndViewExciseRules.bind(this)
    this.fetchStateAndCityList = this.fetchStateAndCityList.bind(this)
    this.toggleModalState = this.toggleModalState.bind(this)
  }

  componentDidMount() {
    this.fetchStateAndCityList()
  }

  handleEdit() {
    const { selectedStateIdx, selectedStateName } = this.state
    // this.setState({ rulesData: {} })
    this.props.handleEdit(selectedStateIdx, selectedStateName)
  }

  fetchStateAndCityList() {
    Api.fetchStateAndCitiesList({})
      .then((response) => {
        const stateList = response.states.map((item) => {
          return {
            text: item.state_name,
            value: item.id
          }
        })
        this.setState({ stateList })
        if (this.state.selectedStateIdx === -1) {
          this.setState({
            selectedStateIdx: stateList[0].value,
            selectedStateName: stateList[0].text
          }, () => { this.fetchRules() })
        } else { this.fetchRules() }
      })
      .catch((err) => {
        console.log("Error in fetching states and cities")
      })
  }

  handleChange(e) {
    this.setState({
      selectedStateIdx: parseInt(e.target.value),
      selectedStateName: this.state.stateList.find((item) => item.value === parseInt(e.target.value)).text
    })
  }

  fetchAndViewExciseRules() {
    const { selectedStateIdx, selectedStateName, rulesData: { } } = this.state
    this.fetchRules()
    this.props.history.push(`/home/rules?stateId=${selectedStateIdx}&stateName=${selectedStateName}`)
  }

  fetchRules() {
    Api.fetchRules({
      state_id: this.state.selectedStateIdx
    })
      .then((response) => {
        this.setState({ loadingRules: false, rulesData: response.rules })
      })
      .catch((err) => {
        this.setState({ loadingRules: false })
        console.log("Error in fetching rule list", err)
      })
  }

  handleDone() {
    const { selectedStateIdx, selectedStateName } = this.state
    this.timeRestrictionForm = this.timeRestrictionForm.getData()
    this.dsoFeeForm = this.dsoFeeForm.getData()
    this.legalPurchaseAgeForm = this.legalPurchaseAgeForm.getData()
    this.possessionLimitForm = this.possessionLimitForm.getData()
    // console.log("poses", this.possessionLimitForm.createdPossessionLimit)
    // console.log("dso", this.dsoFeeForm.createdPermitRules)
    // console.log("age", this.legalPurchaseAgeForm.createdLegalAge)
    // console.log("time", this.timeRestrictionForm.createdTimeRestrictions)
    if (this.timeRestrictionForm.createdTimeRestrictions &&
      this.dsoFeeForm.createdPermitRules &&
      this.legalPurchaseAgeForm.createdLegalAge &&
      this.possessionLimitForm.createdPossessionLimit) {
      this.props.history.push(`/home/rules?stateId=${selectedStateIdx}&stateName=${selectedStateName}`)
    } else {
      this.toggleModalState()
    }
  }

  toggleModalState() {
    this.setState({ showErrorModal: !this.state.showErrorModal })
  }

  handleSetRules() {
    const { selectedStateIdx, selectedStateName } = this.state
    this.props.history.push(`/home/rules/create?stateId=${selectedStateIdx}&stateName=${selectedStateName}`)
  }

  render() {
    const {
      rulesData,
      loadingRules,
      selectedStateIdx,
      selectedStateName,
      showErrorModal
    } = this.state

    const { title, action } = this.props
    const noRules = Object.keys(rulesData).length > 0
      && rulesData.consumer_min_age === 0
      && rulesData.possession_limit.length === 0
      && rulesData.permit_rules.length === 0
      && rulesData.time_restrictions.length === 0

    return (
      <div id="rule-engine">
        <PageHeader pageName="Rules" pathname="/home/rules" />
        <div className="wrapper">
          <Label>Excise Department</Label>
          <div style={{ display: 'flex' }}>
            <Select
              options={this.state.stateList}
              name="State"
              placeholder="excise department"
              onChange={e => this.handleChange(e)}
              value={this.state.selectedStateIdx}
            />
            <div style={{ marginLeft: '10px' }}>
              <Button
                primary
                onClick={this.fetchAndViewExciseRules}
                disabled={loadingRules && selectedStateIdx !== -1}
              >
                View
              </Button>
            </div>
          </div>
        </div>
        {
          noRules && !loadingRules && selectedStateIdx !== -1 && action === "view" &&
          <div className="wrapper no-rules">
            <span>No rules set for {selectedStateName}</span>
            <Button custom
              icon="addWhiteIcon"
              onClick={this.handleSetRules}
            >
              Set Rules
            </Button>
          </div>
        }
        {
          !loadingRules &&
          selectedStateIdx !== -1 &&
          ((action !== "view" && !noRules) || (action === "create" && noRules) || (action === "view" && !noRules)) &&
          <div className="wrapper">
            <div className="rule--header">
              <p className="title">{title}{selectedStateIdx !== -1 ? ` | ${selectedStateName}` : ""}</p>
              {
                this.props.action === "view" &&
                <Button custom icon="editIcon" onClick={this.handleEdit}>Edit</Button>
              }
            </div>

            <PossessionLimit
              ref={(node) => this.possessionLimitForm = (node)}
              action={this.props.action}
              stateId={selectedStateIdx}
              data={this.state.rulesData}
            />

            <LegalPurchaseAge
              ref={(node) => this.legalPurchaseAgeForm = (node)}
              action={this.props.action}
              stateId={selectedStateIdx}
              data={this.state.rulesData}
            />

            <DsoFee
              ref={(node) => this.dsoFeeForm = (node)}
              action={this.props.action}
              stateId={selectedStateIdx}
              data={this.state.rulesData}
            />

            <TimeRestrictions
              ref={(node) => this.timeRestrictionForm = (node)}
              action={this.props.action}
              stateId={selectedStateIdx}
              data={this.state.rulesData}
            />

            <SpecialRestrictions
              ref={(node) => this.specialRestrictionForm = (node)}
              action={this.props.action}
              stateId={selectedStateIdx}
              data={this.state.rulesData}
            />
            {
              this.props.action !== "view" &&
              <React.Fragment>
                <div style={{ marginBottom: '10px' }}>
                  <Button secondary onClick={this.handleDone}>Done</Button>
                </div>
                <p>Save all the sections before pressing DONE</p>
              </React.Fragment>
            }
          </div>
        }
        {
          showErrorModal &&
          (
            <Dialog
              title="Please fill and save all the sections"
              onClick={this.toggleModalState}
              actions={[
                <Button onClick={() => this.toggleModalState()} primary>
                  Ok
                </Button>
              ]}
            />
          )
        }
      </div >
    )
  }
}

export default RuleManagement