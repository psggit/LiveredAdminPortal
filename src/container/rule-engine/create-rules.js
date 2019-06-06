import React from "react"
import RulesForm from "./rules-form"

class CreateRules extends React.Component {

  constructor() {
    super()
  }

  render() {
    return (
      <React.Fragment>
        <RulesForm
          action="create"
          title="Set Rules"
          history={this.props.history}
        />
      </React.Fragment>
    )
  }
}

export default CreateRules