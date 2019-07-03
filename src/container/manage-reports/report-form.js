import React from "react"
import Label from "Components/label"
import Select from "Components/select"
import Button from "Components/button"
import Icon from "Components/icon"
import "Sass/wrapper.scss"
import "./reports.scss"

class ReportForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataType: "",
      selectedDataTypeIdx: -1,
      selectedReportTypeIdx: 1,
      selectedCityIdx: -1,
      selectedStateIdx: -1,
      selectedDsoIdx: -1,
      stateList: [],
      cityList: [],
      fromDate: "",
      toDate: ""
    }

    this.exciseDataType = [
      { text: "All transport permits", value: 1 },
      { text: "Past transport permits", value: 2 },
      { text: "Cancelled transport permits", value: 3 },
    ]

    this.dsoDataType = [
      { text: "All transport permits", value: 1 },
      { text: "Past transport permits", value: 2 },
      { text: "Cancelled transport permits", value: 3 },
      { text: "Credit history", value: 4 },
    ]

    this.reportType = [
      { text: "Excise", value: 1 },
      { text: "Delivery Operator", value: 2 }
    ]

    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.getData = this.getData.bind(this)
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.cityList !== newProps.cityList) {
      this.setState({ cityList: newProps.cityList })
    }
    if (this.props.stateList !== newProps.stateList) {
      this.setState({ stateList: newProps.stateList })
    }
    if (this.props.dsoList !== newProps.dsoList) {
      this.setState({ dsoList: newProps.dsoList })
    }
  }

  handleTextFieldChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  /**
   * Sets the dropdown value
   * @param {Object} e 
   */
  handleSelectChange(e) {
    switch (e.target.name) {
      case 'exciseDataType':
        this.setState({
          selectedDataTypeIdx: parseInt(e.target.value),
          dataType: this.exciseDataType.find((item) => item.value === parseInt(e.target.value)).text
        })
        break;
      case 'deliveryOperator':
        this.setState({
          selectedDsoIdx: (e.target.value)
        })
        break;
      case 'dsoDataType':
        this.setState({
          selectedDataTypeIdx: parseInt(e.target.value),
          dataType: this.dsoDataType.find((item) => item.value === parseInt(e.target.value)).text
        })
        break;

      case 'reportType':
        this.setState({
          selectedReportTypeIdx: parseInt(e.target.value),
          reportType: this.reportType.find((item) => item.value === parseInt(e.target.value)).text
        })
        break;

      case 'state':
        this.setState({
          selectedStateIdx: parseInt(e.target.value),
          state: this.props.stateList.find((item) => item.value === parseInt(e.target.value)).text
        })
        this.updateCityList(e.target.value)
        break;

      case 'city':
        this.setState({
          selectedCityIdx: parseInt(e.target.value),
          city: this.state.cityList.find((item) => item.value === parseInt(e.target.value)).text
        })
        break;
    }
  }

  getData() {
    return this.state
  }

  updateCityList(stateId) {
    let cityList = this.props.stateMap[stateId].cities
    cityList = cityList.map((item) => {
      return {
        text: item.city_name,
        value: item.city_id
      }
    })
    this.setState({ cityList })
  }

  render() {
    const { selectedCityIdx, selectedDataTypeIdx, selectedDsoIdx, selectedStateIdx, fromDate, toDate } = this.state
    const disableDownload = selectedDataTypeIdx === -1 || fromDate.length === 0 || toDate.length === 0
    return (
      <React.Fragment>
        <div className="wrapper">
          <div className="content">
            <div className="item">
              <Label>Report Type <span class="impo">*</span></Label>
              <Select
                options={this.reportType}
                name="reportType"
                width="378px"
                placeholder="Report Type"
                value={this.state.selectedReportTypeIdx}
                onChange={this.handleSelectChange}
              />
            </div>
            {
              this.state.selectedReportTypeIdx === 1 &&
              <div className="item">
                <Label>Data Type <span class="impo">*</span></Label>
                <Select
                  options={this.exciseDataType}
                  name="exciseDataType"
                  width="378px"
                  placeholder="Data Type"
                  value={this.state.selectedDataTypeIdx}
                  onChange={this.handleSelectChange}
                />
              </div>
            }
            {
              this.state.selectedReportTypeIdx === 2 &&
              <div className="item">
                <Label>Data Type <span class="impo">*</span></Label>
                <Select
                  options={this.dsoDataType}
                  name="dsoDataType"
                  width="378px"
                  placeholder="Data Type"
                  value={this.state.selectedDataTypeIdx}
                  onChange={this.handleSelectChange}
                />
              </div>
            }
            <div className="item">
              <Label>State</Label>
              <Select
                options={this.props.stateList}
                name="state"
                width="378px"
                placeholder="State"
                value={this.state.selectedStateIdx}
                onChange={this.handleSelectChange}
              />
            </div>
            <div className="item">
              <Label>City</Label>
              <Select
                options={this.state.cityList}
                name="city"
                width="378px"
                placeholder="City"
                value={this.state.selectedCityIdx}
                onChange={this.handleSelectChange}
              />
            </div>
            <div className="item">
              <Label>Delivery Operator</Label>
              <Select
                options={this.props.dsoList}
                name="deliveryOperator"
                width="378px"
                placeholder="Delivery Operator"
                value={this.state.selectedDsoIdx}
                onChange={this.handleSelectChange}
              />
            </div>
            <div className="item">
              <Label>Report Name (Optional)</Label>
              <input
                type="text"
                name="reportName"
                style={{ width: "378px" }}
                value={this.state.reportName}
                onChange={this.handleTextFieldChange}
              />
            </div>
            <div className="item" style={{ display: 'flex' }}>
              <div>
                <Label>From <span class="impo">*</span></Label>
                <div style={{ position: 'relative' }}>
                  <span className="calendar-icon">
                    <Icon name="calendarIcon" />
                  </span>
                  <input
                    type="date"
                    name="fromDate"
                    onChange={this.handleTextFieldChange}
                    style={{ width: "176px", marginRight: '26px' }}
                  />
                </div>
              </div>
              <div>
                <Label>To <span class="impo">*</span></Label>
                <div style={{ position: 'relative' }}>
                  <span className="calendar-icon">
                    <Icon name="calendarIcon" />
                  </span>
                  <input
                    type="date"
                    name="toDate"
                    onChange={this.handleTextFieldChange}
                    style={{ width: "176px" }}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <Button
                primary
                onClick={this.props.handleSubmit}
                disabled={this.props.disableRequestReport || disableDownload}
              >
                Download Report
              </Button>
            </div>
            <div className="item">
              <p className="note">Note: File will be downloaded as .csv</p>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ReportForm