import React from "react"
import { NavLink } from "react-router-dom"
import Label from 'Components/label'
import Button from 'Components/button'
import './rule-engine.scss'
import Icon from "Components/icon"
import Dialog from "Components/dialog"
import { getQueryObjByName } from "Utils/url-utils"
import * as Api from "../../api"
import Moment from "moment"
import SpecialDayRestrictionForm from "./special-day-restriction-form"

class SpecialRestriction extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showSave: true,
      showConfirmationModal: false,
      creatingSpecialRestriction: false,
      deletingSpecialRestriction: false,
      restrictionId: "",
      zoneRestrictions: props.data.city_special_days
        ? props.data.state_special_days
          ? props.data.city_special_days.concat(props.data.state_special_days)
          : props.data.city_special_days
        : []
    }

    this.saveSpecialRestriction = this.saveSpecialRestriction.bind(this)
    this.toggleSave = this.toggleSave.bind(this)
    this.mountConfirmationModal = this.mountConfirmationModal.bind(this)
    this.unmountConfirmationModal = this.unmountConfirmationModal.bind(this)
    this.createStateSpecialDay = this.createStateSpecialDay.bind(this)
    this.createCitySpecialDay = this.createCitySpecialDay.bind(this)
    this.deleteSpecialDay = this.deleteSpecialDay.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.deleteCitySpecialDay = this.deleteCitySpecialDay.bind(this)
    this.deleteStateSpecialDay = this.deleteStateSpecialDay.bind(this)
  }

  toggleSave() {
    this.setState({ showSave: !this.state.showSave })
  }

  createCitySpecialDay() {
    const data = this.specialrestrictionForm.getData()
    this.setState({ creatingSpecialRestriction: true })
    const payload = {
      state_id: parseInt(this.props.stateId),
      city_id: parseInt(data.state.selectedCityIdx),
      city: data.state.selectedCityName,
      date: data.specialDate.value,
      start_time: data.startTime.value + ":00+05:30",
      end_time: data.endTime.value + ":00+05:30",
      is_repeat: data.state.isRepeat,
      reason: data.reason.state.value
    }
    console.log("paload", payload)
    Api.createCitySpecialDay(payload)
      .then((response) => {
        payload.id = response.id
        payload.start_time = "0000-00-00T" + data.startTime.value + ":00+05:30"
        payload.end_time = "0000-00-00T" + data.endTime.value + ":00+05:30"
        this.setState({
          creatingSpecialRestriction: false,
          zoneRestrictions: [...this.state.zoneRestrictions, payload]
        })
      })
      .catch((err) => {
        this.setState({ creatingSpecialRestriction: false })
        console.log("Error in creating city special day", err)
      })
  }

  createStateSpecialDay() {
    const data = this.specialrestrictionForm.getData()
    this.setState({ creatingSpecialRestriction: true })
    const payload = {
      state_id: parseInt(this.props.stateId),
      state: getQueryObjByName("stateName"),
      // city_id: parseInt(data.state.selectedCityIdx),
      // city: data.state.selectedCityName,
      date: data.specialDate.value,
      start_time: data.startTime.value + ":00+05:30",
      end_time: data.endTime.value + ":00+05:30",
      is_repeat: data.state.isRepeat,
      reason: data.reason.state.value
    }
    console.log("paload", payload)
    Api.createStateSpecialDay({
      state_id: parseInt(this.props.stateId),
      state_name: getQueryObjByName("stateName"),
      date: data.specialDate.value,
      from_time: data.startTime.value + ":00+05:30",
      to_time: data.endTime.value + ":00+05:30",
      is_repeat: data.state.isRepeat,
      reason: data.reason.state.value
    })
      .then((response) => {
        // this.toggleSave()
        payload.id = response.id
        payload.from_time = "0000-00-00T" + data.startTime.value + ":00+05:30"
        payload.to_time = "0000-00-00T" + data.endTime.value + ":00+05:30"
        this.setState({
          creatingSpecialRestriction: false,
          zoneRestrictions: [...this.state.zoneRestrictions, payload]
        })
      })
      .catch((err) => {
        this.setState({ creatingSpecialRestriction: false })
        console.log("Error in creating state special day", err)
      })
  }

  saveSpecialRestriction(e) {
    e.preventDefault()
    const data = this.specialrestrictionForm.getData()
    if (data.state.selectedCityName.indexOf("All") === -1) {
      this.createCitySpecialDay()
    } else {
      this.createStateSpecialDay()
    }
  }

  deleteSpecialDay() {
    const { restrictionId } = this.state
    const ID = parseInt(restrictionId.split("_")[1])
    if (restrictionId.indexOf("city") === -1) {
      this.deleteStateSpecialDay(ID)
    } else {
      this.deleteCitySpecialDay(ID)
    }
  }

  deleteStateSpecialDay(id) {
    this.setState({ deletingSpecialRestriction: true })
    console.log("zone", this.state.zoneRestrictions)

    Api.deleteStateSpecialDay({
      id: parseInt(id),
      state_id: this.state.zoneRestrictions.find((item) => item.id === parseInt(id)).state_id
    })
      .then((response) => {
        //this.toggleSave()
        const availableZoneRestriction = this.state.zoneRestrictions.filter((item) => {
          if (item.id !== id) {
            return item
          }
        })
        this.setState({
          zoneRestrictions: availableZoneRestriction,
          deletingSpecialRestriction: false,
          showConfirmationModal: false
        })
        // location.reload()
      })
      .catch((error) => {
        this.setState({ deletingSpecialRestriction: false })
        console.log("Error in deleting state special day", error)
      })
  }

  deleteCitySpecialDay(id) {
    console.log("zone", this.state.zoneRestrictions)
    this.setState({ deletingSpecialRestriction: true })
    Api.deleteCitySpecialDay({
      id: parseInt(id),
      city_id: this.state.zoneRestrictions.find((item) => item.id === parseInt(id)).city_id,
      state_id: this.state.zoneRestrictions.find((item) => item.id === parseInt(id)).state_id,
    })
      .then((response) => {
        //this.toggleSave()
        const availableZoneRestriction = this.state.zoneRestrictions.filter((item) => {
          if (item.id !== id) {
            return item
          }
        })
        this.setState({
          zoneRestrictions: availableZoneRestriction,
          deletingSpecialRestriction: false,
          showConfirmationModal: false
        })
        // location.reload()
      })
      .catch((error) => {
        this.setState({ deletingSpecialRestriction: false })
        console.log("Error in deleting city special day", error)
      })
  }

  handleChange(e) {
    this.setState({
      selectedCityIdx: parseInt(e.target.value)
    })
  }

  mountConfirmationModal(restrictionId) {
    this.setState({
      showConfirmationModal: true,
      restrictionId
    })
  }

  unmountConfirmationModal() {
    this.setState({
      showConfirmationModal: false
    })
  }

  render() {
    const { showSave, creatingSpecialRestriction, deletingSpecialRestriction, zoneRestrictions } = this.state
    const { data } = this.props
    console.log("zone", zoneRestrictions)
    return (
      <form onSubmit={this.saveSpecialRestriction}>
        <div className="rule--body">
          <div className="title">
            <Label
              icon="info"
              tooltipText="Restricting delivery with a minimum of 48 hours of intimation on certain days due to dry days, state emergencies or other requirements"
            >
              SPECIAL RESTRICTIONS
            </Label>
            {
              this.props.action !== "view" && showSave &&
              <div className="button-group">
                <Button
                  disabled={creatingSpecialRestriction}
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
              this.props.action == "edit" && !showSave &&
              <NavLink
                onClick={this.toggleSave}
                to={location.pathname}
                className="nav-link save"
              >
                Edit
              </NavLink>
            }
          </div>
          <div>
            <table>
              {
                zoneRestrictions.length > 0
                  ? <React.Fragment>
                    <thead>
                      <tr>
                        <th><Label>City/Town</Label></th>
                        <th><Label>On</Label></th>
                        <th><Label>From</Label></th>
                        <th><Label>To</Label></th>
                        <th><Label>Repeat</Label></th>
                        <th><Label>Reason</Label></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        zoneRestrictions.map((item, i) => {
                          return (
                            <tr key={i}>
                              <td>{item.city ? item.city : item.state}</td>
                              <td>{Moment(item.date).format('DD/MM/YYYY')}</td>
                              <td>{item.from_time ? (item.from_time).substring(11, 16) : (item.start_time).substring(11, 16)}</td>
                              <td>{item.to_time ? (item.to_time).substring(11, 16) : (item.end_time).substring(11, 16)}</td>
                              <td>{item.is_repeat ? 'Yearly' : 'No'}</td>
                              <td>{item.reason}</td>
                              <td>{showSave && this.props.action !== "view" ? <span onClick={() => this.mountConfirmationModal(`${item.city_id !== undefined ? `city_${item.id}` : `state_${item.id}`}`)}><Icon name="redDeleteIcon" /></span> : ""}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </React.Fragment>
                  : <tbody>
                    <tr>
                      <td style={{ textAlign: 'center' }} colSpan='6'>
                        <p style={{ fontWeight: '16px' }}>No special day found</p>
                      </td>
                    </tr>
                  </tbody>
              }
            </table>
            {
              this.state.showConfirmationModal &&
              <Dialog
                title="Are you sure you want to perform this action?"
                onClick={this.unmountConfirmationModal}
                actions={[
                  <Button disabled={deletingSpecialRestriction} onClick={() => this.unmountConfirmationModal()} secondary>
                    No
                  </Button>,
                  <Button disabled={deletingSpecialRestriction} onClick={() => this.deleteSpecialDay()} primary>
                    Yes
                  </Button>
                ]}
              />
            }
          </div>
          {
            this.props.action !== "view" &&
            <SpecialDayRestrictionForm
              ref={(node) => { this.specialrestrictionForm = node }}
              creatingSpecialRestriction={creatingSpecialRestriction}
            />
          }
        </div>
      </form>
    )
  }
}

export default SpecialRestriction