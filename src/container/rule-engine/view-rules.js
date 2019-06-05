import React from "react"
import RulesForm from "./rules-form"

class ViewRules extends React.Component {

  constructor() {
    super()

    this.handleEdit = this.handleEdit.bind(this)
  }

  handleEdit(stateId, stateName) {
    this.props.history.push(`/home/rules/edit?stateId=${stateId}&stateName=${stateName}`)
  }

  render() {
    return (
      <React.Fragment>
        <RulesForm
          action="view"
          title="Rules"
          handleEdit={this.handleEdit}
          history={this.props.history}
        />
      </React.Fragment>
    )
  }
}

export default ViewRules