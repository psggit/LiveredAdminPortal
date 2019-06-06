import React from "react"
import { NavLink } from "react-router-dom"
import Label from 'Components/label'
import Button from 'Components/button'
import './rule-engine.scss'
import Icon from "Components/icon"
import Select from "Components/select"
import * as Api from "../../api"
import Moment from "moment"
import SpecialDayRestrictionForm from "./special-day-restriction-form"

class SpecialRestriction extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showSave: true,
      creatingSpecialRestriction: false,
      deletingSpecialRestriction: false,
      zoneRestrictions: props.data.city_special_days ? props.data.state_special_days ? props.data.city_special_days.concat(props.data.state_special_days) : props.data.city_special_days : []
    }

    this.saveSpecialRestriction = this.saveSpecialRestriction.bind(this)
    this.toggleSave = this.toggleSave.bind(this)
    this.createStateSpecialDay = this.createStateSpecialDay.bind(this)
    this.createCitySpecialDay = this.createCitySpecialDay.bind(this)
    this.deleteSpecialDay = this.deleteSpecialDay.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.deleteCitySpecialDay = this.deleteCitySpecialDay.bind(this)
    this.deleteStateSpecialDay = this.deleteStateSpecialDay.bind(this)
  }

  componentDidMount() {
    this.fetchStateAndCityList()
  }

  fetchStateAndCityList() {
    Api.fetchStateAndCitiesList()
      .then((response) => {
        const stateId = this.props.stateId ? parseInt(this.props.stateId) : parseInt(getQueryObjByName("stateId"))
        let cityList = response.stateCity[stateId].cities
        cityList = cityList.map((item) => {
          return {
            text: item.city_name,
            value: item.city_id
          }
        })

        this.setState({
          cityList: [...cityList, {
            text: "All",
            value: cityList.length - 1
          }]
        })
      })
      .catch((err) => {
        console.log("Error in fetching states and cities", err)
      })
  }

  toggleSave() {
    this.setState({ showSave: !this.state.showSave })
  }

  createCitySpecialDay() {
    const data = this.specialrestrictionForm.getData()
    this.setState({ creatingSpecialRestriction: true })
    Api.createCitySpecialDay({
      state_id: parseInt(this.props.stateId),
      city_id: parseInt(data.state.selectedCityIdx),
      date: data.specialDate.value,
      start_time: data.startTime.value + ":00+05:30",
      end_time: data.endTime.value + ":00+05:30",
      is_repeat: data.state.isRepeat,
      reason: data.reason.state.value
    })
      .then((response) => {
        this.toggleSave()
        this.setState({ creatingSpecialRestriction: false })
        location.reload()
      })
      .catch((err) => {
        this.setState({ creatingSpecialRestriction: false })
        console.log("Error in creating city special day", err)
      })
  }

  createStateSpecialDay() {
    const data = this.specialrestrictionForm.getData()
    this.setState({ creatingSpecialRestriction: true })
    Api.createStateSpecialDay({
      state_id: parseInt(this.props.stateId),
      date: data.specialDate.value,
      from_time: data.startTime.value + ":00+05:30",
      to_time: data.endTime.value + ":00+05:30",
      is_repeat: data.state.isRepeat,
      reason: data.reason.state.value
    })
      .then((response) => {
        this.toggleSave()
        this.setState({ creatingSpecialRestriction: false })
        location.reload()
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

  deleteSpecialDay(id) {
    const ID = parseInt(id.split("_")[1])
    if (id.indexOf("city") === -1) {
      this.deleteStateSpecialDay(ID)
    } else {
      this.deleteCitySpecialDay(ID)
    }
  }

  deleteStateSpecialDay(id) {
    Api.deleteStateSpecialDay({
      id: parseInt(id)
    })
      .then((response) => {
        this.toggleSave()
        location.reload()
      })
      .catch((error) => {
        console.log("Error in deleting state special day", error)
      })
  }

  deleteCitySpecialDay(id) {
    Api.deleteCitySpecialDay({
      id: parseInt(id)
    })
      .then((response) => {
        this.toggleSave()
        location.reload()
      })
      .catch((error) => {
        console.log("Error in deleting city special day", error)
      })
  }

  handleChange(e) {
    this.setState({
      selectedCityIdx: parseInt(e.target.value)
    })
  }

  render() {
    const { showSave, creatingSpecialRestriction, zoneRestrictions } = this.state
    const { data } = this.props
    console.log("zone", zoneRestrictions)
    return (
      <form onSubmit={this.saveSpecialRestriction}>
        <div className="rule--body">
          <div className="title">
            <Label
              icon="info"
              tooltipText=""
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
                            <tr onClick={() => this.deleteSpecialDay(`${item.city_id !== undefined ? `city_${item.id}` : `state_${item.id}`}`)}>
                              <td>{item.city ? item.city : item.state}</td>
                              <td>{Moment(item.date).format('DD/MM/YYYY')}</td>
                              <td>{item.from_time ? (item.from_time).substring(11, 16) : (item.start_time).substring(11, 16)}</td>
                              <td>{item.to_time ? (item.to_time).substring(11, 16) : (item.end_time).substring(11, 16)}</td>
                              <td>{item.is_repeat ? 'Yearly' : 'No'}</td>
                              <td>{item.reason}</td>
                              <td>{showSave && this.props.action !== "view" ? <Icon name="redDeleteIcon" /> : ""}</td>
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
          </div>
          {
            this.props.action !== "view" &&
            <SpecialDayRestrictionForm ref={(node) => { this.specialrestrictionForm = node }} />
          }
        </div>
      </form>
    )
  }
}

export default SpecialRestriction