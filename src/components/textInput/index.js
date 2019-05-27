import React from "react";
import "./text-input.scss";

class TextInput extends React.Component {

  constructor() {
    super();
    this.state = {
      value: "",
      errorStatus: false,
      errorMessage: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.validation = this.validation.bind(this);
  }

  validation(e) {
    let errorMessage = "", errorStatus = false;

    if (this.props.isRequired && e.target.value === "") {
      errorStatus = true;
      errorMessage = this.props.emptyMessage;
    } else if (e.target.validity.patternMismatch) {
      errorStatus = true;
      errorMessage = this.props.errorMessage;
    }

    this.setState({
      errorMessage,
      errorStatus,
      value: e.target.value
    });
  }

  handleChange(e) {
    this.validation(e);
  }

  render() {
    return (
      <div id="textInput">
        <input
          type="text"
          value={this.state.value}
          name={this.props.name}
          errorMessage={this.props.errorMessage}
          emptyMessage={this.props.emptyMessage}
          pattern={this.props.pattern}
          required={this.props.isRequired}
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
          disabled={this.props.disabled}
        />
        {this.state.errorStatus && (
          <p className="error-message">* {this.state.errorMessage}</p>
        )}
      </div>
    );
  }
}

export default TextInput
