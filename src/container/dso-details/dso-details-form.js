import React from "react"
import Button from "Components/button"
import "./dso-details.scss"
import DataTable from "Components/table/custom-table"
import Label from "Components/label"
import Icon from "Components/icon"

class DsoDetailsForm extends React.Component {
  constructor() {
    super()
    this.state = {
      dsoName: ""
    }
  }

  componentDidMount() {
    this.setState({
      loadingDsoDetails: true,
      dsoName: getQueryObjByName("name")
    })
  }

  // handleEdit() {
  //   this.props.history.push(`/home/dso-details/edit?id=${}&name=${}`)
  // }

  // componentWillReceiveProps(newProps) {
  //   console.log("hello", this.props, newProps)
  //   if (this.props.dsoDetailsData !== newProps.dsoDetailsData) {
  //     console.log("new prop", newProps)
  //     this.setState({
  //       dsoDetailsData: newProps.dsoDetailsData
  //     })
  //   }
  // }

  render() {
    const { data } = this.props
    console.log("data", this.props, this.props.data.dsoDetailsData)
    return (
      <React.Fragment>
        <div className="title-section">
          <div>
            {this.props.title}
          </div>
          <Button custom icon="editIcon" onClick={this.handleClick}>{this.props.buttonTitle}</Button>
        </div>
        <div className="content">
          <div className="item">
            <Label>DSO</Label>
            <input type="text" value={data.dso_name} />
          </div>
          <div className="item">
            <Label>Entity type</Label>
            <input type="text" value={data.entity_type} />
          </div>
          <div className="item">
            <Label>License type</Label>
            <input type="text" value={data.license_type} />
          </div>
          <div className="item">
            <Label
              icon="info"
              tooltipText="Minimum legal age limit to place an order"
            >Delivery Status</Label>
            {
              data.is_active
                ? <span><Icon name="toggleGreen" /></span>
                : <span><Icon name="toggleRed" /></span>
            }
            {data.is_active ? "Enabled" : "Disabled"}
          </div>
          <div className="item">
            <DataTable
              loadingData={false}
              headings={[
                { title: "State", icon: "", tooltipText: "" },
                { title: "Delivery Status", icon: "info", tooltipText: "" },
                { title: "", icon: "", tooltipText: "" }
              ]}
            >
              <tr>
                <td>{"Tamilnadu"}</td>
                <td>{"Enabled"}</td>
                <td></td>
              </tr>
            </DataTable>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default DsoDetailsForm

