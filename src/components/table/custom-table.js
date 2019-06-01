import React from "react"
import Loader from "Components/loader"
import "./table.scss"
import Icon from "./../icon"
import PropTypes from "prop-types"

const CustomTable = ({ headings, rows, className, children, loadingData, message }) => {
  const renderHeadingRow = (item, i) => {
    return (
      <th key={i}>
        {item.title}
        {
          item.icon &&
          <span className="info" style={{ position: "relative", marginLeft: "12px", verticalAlign: "middle" }}>
            <Icon name={item.icon} />
            <span className="tooltip-text">
              {item.tooltipText}
            </span>
          </span>
        }
      </th>
    )
  }
  return (

    <div className="table-wrapper">
      <table className={`${className ? 'logs' : ''}`}>
        <thead>
          <tr>
            {
              headings.map((item, i) => {
                return renderHeadingRow(item, i)
              })
            }
          </tr>
        </thead>
        <tbody>
          {children}
          {
            loadingData &&
            <tr>
              <td colSpan={headings.length}>
                <Loader />
              </td>
            </tr>
          }
          {
            !loadingData &&
            //Object.keys(children) === undefined || 
            Object.keys(children).length === 0 && (
              <tr>
                <td style={{ textAlign: "center" }} colSpan={headings.length}>
                  {message}
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default CustomTable

CustomTable.defaultProps = {
  loadingData: undefined,
  headings: undefined
}

CustomTable.propTypes = {
  loadingData: PropTypes.bool,
  headings: PropTypes.array.isRequired
}

