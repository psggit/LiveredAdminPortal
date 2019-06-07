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

  constructor() {
    super()
    this.applyFilter = this.applyFilter.bind(this)
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

    filterObj = filterObj.filter((item) => item.value && item.value !== "All")
    console.log("filter obj", filterObj)
    this.props.applyFilter(filterObj)
  }

  render() {
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