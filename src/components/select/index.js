import React, {useState} from 'react'
import './select.scss'
import Icon from './../icon'

const Select = (props) => {
  const [value, setValue] = useState("")

  const handleChange = (e) => {
    setValue(e.target.value)
    props.onChange(e)
  }

  return (
      <div className="select--container">
        <Icon name="down-small" size="10"/>
        <select
          placeholder={props.placeholder}
          className={`select ${props.small ? 'small' : ''}`}
          name={props.name}
          onChange={handleChange}
          value={props.value ? props.value : value}
        >
          {
            props.name && !props.value &&
            <option value="" disabled selected>
              Choose a {props.name}
            </option>
          }
          {
            props.options.map((item, i) => (
              <option key={i} value={item.value}>{ item.text }</option>
            ))
          }
        </select>
      </div>
    )
}

export default Select