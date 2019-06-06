import React from "react"
import Label from "Components/label"
import Select from "Components/select"
import Icon from "Components/icon"
import TextInput from "Components/textInput"
import * as Api from "../../api"
import { getQueryObjByName, getQueryUri } from "Utils/url-utils"

class SpecialDayRestrictionForm extends React.Component {

  constructor() {
    super()
    this.state = {
      cityList: [],
      selectedCityIdx: -1,
      selectedCityName: "",
      isRepeat: false
    }
    this.fetchStateAndCityList = this.fetchStateAndCityList.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.getData = this.getData.bind(this)
  }

  componentDidMount() {
    this.fetchStateAndCityList()
  }

  handleSelectChange(e) {
    this.setState({
      selectedCityIdx: e.target.value,
      selectedCityName: this.state.cityList.find((item) => item.value === parseInt(e.target.value)).text
    })
  }

  getData() {
    return this
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
          }],
          selectedCityIdx: cityList[0].value
        })
      })
      .catch((err) => {
        console.log("Error in fetching states and cities", err)
      })
  }

  handleCheckboxChange() {
    this.setState({
      isRepeat: !this.state.isRepeat
    })
  }

  render() {
    return (
      <div style={{ borderTop: '1px solid #dfe3e6' }}>
        <div className="title">
          <Label
            icon="info"
            tooltipText="In case of extension, late fee is charged per OTTP per order"
          >
            Restricting delivery
          </Label>
        </div>

        <div className="delivery-restriction">

          <div className="section">
            <Select
              options={this.state.cityList}
              name="City"
              placeholder="City/Town"
              onChange={e => this.handleSelectChange(e)}
              value={this.state.selectedCityIdx}
            />
          </div>
          <div className="section">
            <div style={{ position: 'relative' }} className="input-field">
              <span className="calendar-icon">
                <Icon name="calendar" />
              </span>
              <p style={{ width: '110px' }}>Choose Day</p>
              <input
                type="date"
                max="9999-12-31"
                name="specialDate"
                required
                ref={input => this.specialDate = input}
              />
            </div>
            <div className="input-field">
              <p style={{ width: '110px' }}>Time</p>
              <input
                name="startTime"
                type="time"
                ref={input => this.startTime = input}
                required
              />
              <p style={{ padding: '10px' }}>to</p>
              <input
                ref={input => this.endTime = input}
                name="endTimings"
                type="time"
                required
              />
            </div>
            <div className="input-field">
              <p style={{ width: '110px' }}>Reason</p>
              <TextInput
                ref={input => (this.reason = input)}
                name="reason"
                pattern="^[^-\s][a-zA-Z0-9_\s-]+$"
                isRequired={true}
                errorMessage="Reason is invalid"
                emptyMessage="Reason is required"
              />
            </div>
            <div className="input-field" style={{ marginLeft: '110px' }}>
              <span>
                {
                  this.state.isRepeat
                    ? <Icon name="filledRectangle" />
                    : <Icon name="rectangle" />
                }
              </span>
              <span style={{ cursor: 'pointer' }} onClick={this.handleCheckboxChange}>Repeat</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SpecialDayRestrictionForm