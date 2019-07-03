import React from "react"
import { NavLink } from "react-router-dom"
import Label from 'Components/label'
import Button from 'Components/button'
import './rule-engine.scss'
import * as Api from "../../api"

const weekdays = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' }
]

class TimeRestriction extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showSave: true,
      creatingTimeRestriction: false,
      updatingTimeRestriction: false,
      createdTimeRestrictions: props.data.time_restrictions && props.data.time_restrictions.length > 0 ? true : false
    }
    this.saveStateTimings = this.saveStateTimings.bind(this)
    this.toggleSave = this.toggleSave.bind(this)
    this.createTimeRestriction = this.createTimeRestriction.bind(this)
    this.updateTimeRestriction = this.updateTimeRestriction.bind(this)
    this.getData = this.getData.bind(this)
  }

  toggleSave() {
    this.setState({ showSave: !this.state.showSave })
  }

  getData() {
    return this.state
  }

  getStateTimings() {
    return [{
      weekday_id: weekdays.find((item) => item.label === "Monday").value,
      start_time: this.mondayStartTimings.value + ":00+05:30",
      end_time: this.mondayEndTimings.value + ":00+05:30"
    },
    {
      weekday_id: weekdays.find((item) => item.label === "Tuesday").value,
      start_time: this.tuesdayStartTimings.value + ":00+05:30",
      end_time: this.tuesdayEndTimings.value + ":00+05:30"
    },
    {
      weekday_id: weekdays.find((item) => item.label === "Wednesday").value,
      start_time: this.wednesdayStartTimings.value + ":00+05:30",
      end_time: this.wednesdayEndTimings.value + ":00+05:30"
    },
    {
      weekday_id: weekdays.find((item) => item.label === "Thursday").value,
      start_time: this.thursdayStartTimings.value + ":00+05:30",
      end_time: this.thursdayEndTimings.value + ":00+05:30"
    },
    {
      weekday_id: weekdays.find((item) => item.label === "Friday").value,
      start_time: this.fridayStartTimings.value + ":00+05:30",
      end_time: this.fridayEndTimings.value + ":00+05:30"
    },
    {
      weekday_id: weekdays.find((item) => item.label === "Saturday").value,
      start_time: this.saturdayStartTimings.value + ":00+05:30",
      end_time: this.saturdayEndTimings.value + ":00+05:30"
    },
    {
      weekday_id: weekdays.find((item) => item.label === "Sunday").value,
      start_time: this.sundayStartTimings.value + ":00+05:30",
      end_time: this.sundayEndTimings.value + ":00+05:30"
    }]
  }

  createTimeRestriction() {
    this.setState({ creatingTimeRestriction: true })
    Api.createTimeRestriction({
      state_id: this.props.stateId,
      timings: this.getStateTimings()
    })
      .then((response) => {
        this.setState({ creatingTimeRestriction: false, createdTimeRestrictions: true })
        this.toggleSave()
      })
      .catch((err) => {
        this.setState({ creatingTimeRestriction: false })
        console.log("Error in creating time restriction", err)
      })
  }

  updateTimeRestriction() {
    this.setState({ updatingTimeRestriction: true })
    Api.updateTimeRestriction({
      state_id: this.props.stateId,
      timings: this.getStateTimings()
    })
      .then((response) => {
        this.setState({ updatingTimeRestriction: false })
        this.toggleSave()
      })
      .catch((err) => {
        this.setState({ updatingLegalPurchaseAge: false })
        console.log("Error in updating legal purchase age", err)
      })
  }

  saveStateTimings(e) {
    e.preventDefault()
    if (this.props.action === "create") {
      this.createTimeRestriction()
    } else {
      this.updateTimeRestriction()
    }
  }

  render() {
    const { showSave, updatingTimeRestriction, creatingTimeRestriction, createdTimeRestrictions } = this.state
    const { data, action } = this.props
    return (
      <form onSubmit={this.saveStateTimings}>
        <div className="rule--body time-restrictions">
          <div className="title">
            <Label
              icon="info"
              tooltipText="Time range per day within which delivery of liquor is permitted"
            >
              TIME RESTRICTIONS
            </Label>
            {
              ((action === "edit" && showSave) || (action === "create" && (data.time_restrictions.length === 0 && !createdTimeRestrictions))) &&
              <div className="button-group">
                <Button
                  disabled={updatingTimeRestriction || creatingTimeRestriction}
                // onClick={this.savePossessionLimit}
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
          <div className="timings">
            <p style={{ width: '110px' }}>Monday</p>
            <input
              ref={input => this.mondayStartTimings = input}
              name="mondayStartTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 1).start_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
            <p>to</p>
            <input
              ref={input => this.mondayEndTimings = input}
              name="mondayEndTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 1).end_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
          </div>
          <div className="timings">
            <p style={{ width: '110px' }}>Tuesday</p>
            <input
              ref={input => (this.tuesdayStartTimings = input)}
              name="tuesdayStartTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 2).start_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
            <p>to</p>
            <input
              ref={input => (this.tuesdayEndTimings = input)}
              name="tuesdayEndTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 2).end_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
          </div>
          <div className="timings">
            <p style={{ width: '110px' }}>Wednesday</p>
            <input
              ref={input => (this.wednesdayStartTimings = input)}
              name="wednesdayStartTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 3).start_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
            <p>to</p>
            <input
              ref={input => (this.wednesdayEndTimings = input)}
              name="wednesdayEndTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 3).end_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
          </div>
          <div className="timings">
            <p style={{ width: '110px' }}>Thursday</p>
            <input
              ref={input => (this.thursdayStartTimings = input)}
              name="thursdayStartTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 4).start_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
            <p>to</p>
            <input
              ref={input => (this.thursdayEndTimings = input)}
              name="thursdayEndTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 4).end_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
          </div>
          <div className="timings">
            <p style={{ width: '110px' }}>Friday</p>
            <input
              ref={input => (this.fridayStartTimings = input)}
              name="fridayStartTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 5).start_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
            <p>to</p>
            <input
              ref={input => (this.fridayEndTimings = input)}
              name="fridayEndTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 5).end_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
          </div>
          <div className="timings">
            <p style={{ width: '110px' }}>Saturday</p>
            <input
              ref={input => (this.saturdayStartTimings = input)}
              name="saturdayStartTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 6).start_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
            <p>to</p>
            <input
              ref={input => (this.saturdayEndTimings = input)}
              name="saturdayEndTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 6).end_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
          </div>
          <div className="timings">
            <p style={{ width: '110px' }}>Sunday</p>
            <input
              ref={input => (this.sundayStartTimings = input)}
              name="sundayStartTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 7).start_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
            <p>to</p>
            <input
              ref={input => (this.sundayEndTimings = input)}
              name="sundayEndTimings"
              type="time"
              required
              defaultValue={
                data.time_restrictions && data.time_restrictions.length > 0
                  ? data.time_restrictions.find((item) => item.weekday_id === 7).end_time.substring(11, 16)
                  : ""
              }
              disabled={this.props.action === "view" || !this.state.showSave || (action === "create" && createdTimeRestrictions)}
            />
          </div>
        </div>
      </form>
    )
  }
}

export default TimeRestriction