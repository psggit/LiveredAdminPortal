import React from "react"
import PageHeader from "Components/pageheader"
import ReportForm from "./report-form"
import * as Api from "./../../api"
import Dialog from "Components/dialog"
import Button from "Components/button"

class ManageReports extends React.Component {
  constructor() {
    super()
    this.state = {
      requestingReport: false,
      reportFormKey: 0,
      stateList: [],
      cityList: [],
      stateMap: {},
      dsoList: [],
      showSuccessDialog: false
    }
    this.formatResponse = this.formatResponse.bind(this)
    this.generateReport = this.generateReport.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.fetchCityAndStates()
    this.fetchDSOList()
  }

  formatResponse(response) {
    const cityList = response.cities.map((item) => {
      return {
        text: item.city_name,
        value: item.id,
        //stateId: item.StateId
      }
    })

    const stateList = response.states.map((item) => {
      return {
        text: item.state_name,
        value: item.id
      }
    })

    this.setState({ stateList, cityList, stateMap: response.stateCity })
  }

  fetchDSOList() {
    Api.fetchDSOList({
      limit: 1000,
      offset: 0
    })
      .then((response) => {
        const dsoList = response.dso.map((item) => {
          return {
            text: item.dso_name,
            value: item.dso_id
          }
        })
        this.setState({ dsoList })
      })
      .catch((err) => {
        console.log("Error in fetching dso list")
      })
  }

  fetchCityAndStates() {
    Api.fetchStateAndCitiesList()
      .then((response) => {
        this.formatResponse(response)
      })
      .catch((err) => {
        console.log("Error in fetching state and cities")
      })
  }

  /**
  * Formas payload and invokes tha generate report api
  */
  handleSubmit() {
    const formData = this.reportForm.getData()
    this.setState({ requestingReport: true })
    this.generateReport({
      data_type: formData.dataType,
      state_id: formData.selectedStateIdx !== -1 ? formData.selectedStateIdx.toString() : "",
      city_id: formData.selectedCityIdx !== -1 ? formData.selectedCityIdx.toString() : "",
      dso_id: formData.selectedDsoIdx !== -1 ? formData.selectedDsoIdx.toString() : "",
      from_date: new Date(formData.fromDate).toISOString(),
      to_date: new Date(formData.toDate).toISOString(),
      file_name: formData.reportName
    })
  }

  unMountModal() {
    this.setState({ showSuccessDialog: false })
  }

  /**
   * Baed on data_type request appropriate api service
   * @param {Object} payloadObj - payload object
   */
  generateReport(payloadObj) {
    if (payloadObj.data_type.indexOf("credits") === -1) {
      Api.generateOttpReport(payloadObj)
        .then((response) => {
          this.downloadReport(response)
        })
        .catch((err) => {
          this.setState({ requestingReport: false })
          console.log("Error in downloading report", err)
        })
    } else {
      Api.generateCreditReport(payloadObj)
        .then((response) => {
          this.downloadReport(response)
        })
        .catch((err) => {
          this.setState({ requestingReport: false })
          console.log("Error in downloading report", err)
        })
    }
  }

  downloadReport(response) {
    const formData = this.reportForm.getData()
    const filename = formData.reportName ? `${formData.reportName}.csv` : `export.csv`
    const data = (response)
    const blob = new Blob([data], { type: `text/csv` });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.setState({ requestingReport: false, showSuccessDialog: true, reportFormKey: this.state.reportFormKey + 1 })
  }

  render() {
    return (
      <div id="reports" key={this.state.reportFormKey}>
        <PageHeader pageName="Reports" />
        <div className="form-wrapper">
          <ReportForm
            ref={(node) => this.reportForm = (node)}
            handleSubmit={this.handleSubmit}
            disableRequestReport={this.state.requestingReport}
            cityList={this.state.cityList}
            dsoList={this.state.dsoList}
            stateList={this.state.stateList}
            stateMap={this.state.stateMap}
          />
        </div>
        {this.state.showSuccessDialog && (
          <Dialog
            title="Report has been successfully downloaded"
            icon="greenTick"
            onClick={this.unMountModal}
            actions={[
              <Button onClick={() => this.unMountModal()} primary>
                Done
              </Button>
            ]}
          />
        )}
      </div>
    )
  }
}

export default ManageReports