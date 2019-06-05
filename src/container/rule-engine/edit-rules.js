import React from "react"
import RulesForm from "./rules-form"

class EditRules extends React.Component {

  constructor() {
    super()
    this.state = {
      creatingTimeRestriction: false,
      creatingDsoFee: false,
      creatingSpecialRestriction: false
    }
  }

  render() {
    return (
      <React.Fragment>
        <RulesForm
          action="edit"
          title="Edit Rules"
          history={this.props.history}
        />
      </React.Fragment>
    )
  }
}

export default EditRules