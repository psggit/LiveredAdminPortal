import React from "react";
import "./text-input.scss";

class TextInput extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      value: props ? props.defaultValue : "",
      errorStatus: false,
      errorMessage: "",
      touched: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.validation = this.validation.bind(this);
  }

  componentWillReceiveProps(newProps) {
    console.log("new prop", newProps, "old props", this.props)
    if(this.props.defaultValue !== newProps.defaultValue) {
      console.log("hello")
      this.setState({
        value: newProps.defaultValue
      })
    }
  }

  validation(e) {
    let errorMessage = "", errorStatus = false, touched = true;

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
      touched,
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
