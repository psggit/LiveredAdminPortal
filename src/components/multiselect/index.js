import React from "react";
import "./multiselect.scss";
import Icon from "./../icon"

class Select extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      values: this.props.selectedValues
    };

    this.onFocus = this.onFocus.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDeleteOption = this.onDeleteOption.bind(this);
    this.onClickOption = this.onClickOption.bind(this);
    this.renderOption = this.renderOption.bind(this);

    this.removeOption = this.removeOption.bind(this)
    this.addOption = this.addOption.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if(this.props.selectedValues !== newProps.selectedValues) {
      this.setState({
        values: newProps.selectedValues
      })
    }
  }

  onFocus() {
    this.setState({
      isFocused: true
    });
  }

  onClick() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  onDeleteOption(text) {
    const id = this.props.options.find((item) => item.text === text).id
    this.removeOption(text)
    this.props.removeOption(id, text, this.addOption)
  }

  addOption(value) {
    this.setState(prevState => {
      const [...values] = prevState.values;
      const index = values.indexOf(value);

      if (index === -1) {
        values.push(value);
      } else {
        values.splice(index, 1);
      }

      return { values };
    });
  }

  removeOption(value) {
    this.setState(prevState => {
      const [...values] = prevState.values;
      const index = values.indexOf(value);

      values.splice(index, 1);

      return { values };
    });
  }

  onClickOption(text, value) {
    this.addOption(text)
    this.props.addOption(value, text, this.removeOption)
  }

  // removeOption(value) {
  //   console.log("callback val", value)
  //   this.onDeleteOption(value)
  // }

  stopPropagation(e) {
    e.stopPropagation();
  }

  renderValues() {
    const { placeholder, multiple } = this.props;
    const { values } = this.state;

    if (values.length === 0) {
      return <div className="placeholder">{placeholder}</div>;
    }

    if (multiple) {
      return values.map(value => {
        return (
          <span
            key={value}
            onClick={this.stopPropagation}
            className="multiple value"
          >
            <span style={{marginRight: '10px'}}>{value}</span>
            <span onClick={() => this.onDeleteOption(value)} className="delete">
              <Icon name="redDeleteIcon" />
            </span>
          </span>
        );
      });
    }

    return <div className="value">{values[0]}</div>;
  }

  renderOptions() {
    const { options } = this.props;
    const { isOpen } = this.state;

    if (!isOpen) {
      return null;
    }

    return <div className="options">{options.map(this.renderOption)}</div>;
  }

  renderOption(option, index) {
    const { values } = this.state;
    // const { value, id } = option;
    const {text, value} = option;
    const selected = values.includes(text);
    return (
      <div
        key={text}
        className={`option ${selected ? "selected" : ""}`}
        onClick={() => this.onClickOption(text, value)}
      >
        <span className="checkbox">{selected ? <Check /> : null}</span>
        {text}
      </div>
    );
  }

  render() {
    const { label } = this.props;
    const { isOpen } = this.state;

    return (
      <div id="multiSelect">
        <label className="label">{label}</label>
        <div className="selection" onClick={this.onClick}>
          {this.renderValues()}
          <span className="arrow">
            {isOpen ? <Icon name="up-small" /> : <Icon name="down-small" />}
          </span>
        </div>
        {this.renderOptions()}
      </div>
    );
  }
}

export default Select

const Check = () => (
  <svg viewBox="0 0 16 16" width="10" height="10" fill="#fff">
    <path
      d="M13 .156l-1.406 1.438-5.594 5.594-1.594-1.594-1.406-1.438-2.844 2.844 1.438 1.406 3 3 1.406 1.438 1.406-1.438 7-7 1.438-1.406-2.844-2.844z"
      transform="translate(0 1)"
    />
  </svg>
);