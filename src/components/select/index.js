import React, { useState } from 'react'
import './select.scss'
import Icon from './../icon'

const Select = (props) => {
  //const [value, setValue] = useState("")
  const handleChange = (e) => {
    //setValue(e.target.value)
    props.onChange(e)
  }
  return (
    <div className="select--container">
      <Icon name="down-small" size="10" />
      <select
        placeholder={props.placeholder}
        className={`select ${props.small ? 'small' : props.large ? 'large' : ''}`}
        name={props.name}
        onChange={handleChange}
        disabled={props.disabled}
        style={{ width: props.width ? props.width : "260px" }}
        value={props.value !== -1 ? props.value : ""}
      >
        {
          props.name && props.value === -1 &&
          <option value="" disabled selected>
            Choose a {props.placeholder}
          </option>
        }
        {
          props.options.map((item, i) => (
            <option key={i} value={item.value}>{item.text}</option>
          ))
        }
      </select>
    </div>
  )
}

export default Select