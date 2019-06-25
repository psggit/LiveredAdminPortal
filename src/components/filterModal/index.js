import React from "react"
import Button from "../button"
import './index.scss'
import DeliveryOperator from "./deliveryOperator"
import PermitStatus from "./permitStatus"
import DeliveryStatus from "./deliveryStatus"
import City from "./cityComponent"
import StateComponent from "./stateComponent"
import FromDate from "./fromDateComponent"
import ToDate from "./toDateComponent"

class Filter extends React.Component {

  constructor(props) {
    super(props)
    // this.state = {
    //   selectedCityIdx: this.props.selectedCityIdx ? this.props.selectedCityIdx : -1
    // }
    this.applyFilter = this.applyFilter.bind(this)
    this.resetFilter = this.resetFilter.bind(this)
    this.setFilterDefaultValues = this.setFilterDefaultValues.bind(this)
  }

  // componentDidUpdate(prevProps) {
  //   console.log("prev props", prevProps, this.props)
  //   if (this.props.selectedCityIdx !== prevProps.selectedCityIdx) {
  //     this.setState({ selectedCityIdx: this.props.selectedCityIdx })
  //   }
  // }

  setFilterDefaultValues(defaultValueObj) {
    console.log("set filter default values", defaultValueObj)
    if (defaultValueObj.selectedCityIdx && defaultValueObj.selectedCityIdx !== -1) {
      this.cityState.setDefaultValue(defaultValueObj.selectedCityIdx)
    }
    if (defaultValueObj.selectedStateIdx && defaultValueObj.selectedStateIdx !== -1) {
      this.stateComponent.setDefaultValue(defaultValueObj.selectedStateIdx)
    }
    if (defaultValueObj.selectedDsoIdx && defaultValueObj.selectedDsoIdx !== -1) {
      this.dsoListState.setDefaultValue(defaultValueObj.selectedDsoIdx)
    }
    if (defaultValueObj.selectedPermitIdx && defaultValueObj.selectedPermitIdx !== -1) {
      this.permitStatusState.setDefaultValue(defaultValueObj.selectedPermitIdx)
    }
    if (defaultValueObj.selectedDeliveryStatusIdx && defaultValueObj.selectedDeliveryStatusIdx !== -1) {
      this.deliveryStatusState.setDefaultValue(defaultValueObj.selectedDeliveryStatusIdx)
    }
    if (defaultValueObj.fromDate && defaultValueObj.fromDate !== -1) {
      this.fromDateState.setDefaultValue(defaultValueObj.fromDate)
    }
    if (defaultValueObj.toDate && defaultValueObj.toDate !== -1) {
      this.toDateState.setDefaultValue(defaultValueObj.toDate)
    }
  }

  resetFilter() {

    if (this.props.filterName !== "exciseOperations") {
      this.cityState.reset()
      this.stateComponent.reset()
      this.dsoListState.reset()
      this.permitStatusState.reset()
      this.fromDateState.reset()
      this.toDateState.reset()
    }

    if (this.props.filterName === "exciseOperations") {
      this.cityState.reset()
      this.dsoListState.reset()
      this.deliveryStatusState.reset()
    }
  }

  applyFilter() {
    let filterObj = []
    const dso = this.dsoListState.getData().dso
    const city = this.cityState.getData().city

    if (this.props.filterName !== "exciseOperations") {
      const stateComponentState = this.stateComponent.getData().stateObj
      const permitStatus = this.permitStatusState.getData().permitStatus
      const fromDate = this.fromDateState.getData().fromDate
      const toDate = this.toDateState.getData().toDate

      if (fromDate.filterby) {
        filterObj.push(fromDate)
      }
      if (toDate.filterby) {
        filterObj.push(toDate)
      }

      filterObj.push(stateComponentState, dso, city, permitStatus)
    } else {
      const deliveryStatus = this.deliveryStatusState.getData().deliveryStatus
      filterObj.push(dso, city, deliveryStatus)
    }

    filterObj = filterObj.filter((item) => item.filterby && item.filterby.length > 0)
    this.props.applyFilter(filterObj)
  }

  render() {
    console.log("filter", this.props)
    return (
      <div className={`filter-container ${this.props.showFilter ? 'show' : 'hide'}`} >
        <p className="title"> Filters </p>
        <div style={{ margin: '20px 0' }}>
          {
            this.props.filterName !== "exciseOperations" &&
            <React.Fragment>
              <FromDate
                ref={(node) => { this.fromDateState = node }}
                fromDate={this.props.fromDate}
              />
              <ToDate
                ref={(node) => { this.toDateState = node }}
                toDate={this.props.toDate}
              />
            </React.Fragment>
          }

          <City
            cityList={this.props.cityList}
            ref={(node) => { this.cityState = node }}
            selectedCityIdx={this.props.selectedCityIdx}
          />
          {
            this.props.filterName !== "exciseOperations" &&
            <StateComponent
              stateList={this.props.stateList}
              ref={(node) => { this.stateComponent = node }}
              selectedStateIdx={this.props.selectedStateIdx}
            />
          }
          <DeliveryOperator
            dsoList={this.props.dsoList}
            ref={(node) => { this.dsoListState = node }}
            selectedDsoIdx={this.props.selectedDsoIdx}
          />
          {
            this.props.filterName === "exciseOperations" &&
            <DeliveryStatus
              deliveryStatus={this.props.deliveryStatus}
              ref={(node) => { this.deliveryStatusState = node }}
              selectedDeliveryStatusIdx={this.props.selectedDeliveryStatusIdx}
            />
          }
          {
            this.props.filterName !== "exciseOperations" &&
            <PermitStatus
              permitStatus={this.props.permitStatus}
              ref={(node) => { this.permitStatusState = node }}
              selectedPermitIdx={this.props.selectedPermitIdx}
            />
          }
        </div>
        <Button primary onClick={this.applyFilter}>
          <span
            style={{
              position: 'relative',
              top: '-2px',
              marginLeft: '5px',
            }}
          >
            APPLY
          </span>
        </Button>
      </div>
    )
  }
}

export default Filter