import React from "react"
import Loader from "Components/loader"
import "./table.scss"
import PropTypes from "prop-types"

class Table extends React.Component {

  constructor() {
    super()
    this.renderHeadingRow = this.renderHeadingRow.bind(this)
    this.renderRow = this.renderRow.bind(this)
  }

  renderHeadingRow = (_cell, cellIndex) => {
    const { headings } = this.props

    return (
      <th>
        {headings[cellIndex]}
      </th>
    )
  }

  renderRow = (_row, rowIndex) => {
    const { rows } = this.props

    return (
      <tr 
        key={`row-${rowIndex}`} 
        onClick={this.props.rowClick ? this.props.rowClick : () => {}}
        className={`${this.props.rowClick ? 'clickable' : undefined}`}
      >
        {
          Object.keys(rows[rowIndex]).map((key) => rows[rowIndex][key]).map((item, i) => {
            return (
              <td>
                {item}
              </td>
            )
          })
        }
      </tr>
    )
  }
  render() {
    const {headings, rows} = this.props;
    return (
      <div className="table-wrapper">
        <table className={`${this.props.className ? 'logs' : ''}`}>
          <thead>
            <tr>
              {headings.map(this.renderHeadingRow)}
            </tr>
          </thead>
          <tbody>
            {
              !this.props.loadingData && rows.length &&
              rows.map(this.renderRow)
            }
            {
              this.props.loadingData &&
              <tr>
                <td colSpan={this.props.headings.length}>
                  <Loader />
                </td>
              </tr>
            }
            {
                !this.props.loadingData &&
                this.props.rows.length === 0 && (
                  <tr>
                    <td style={{ textAlign: "center" }} colSpan={this.props.headings.length}>
                      No orders found
                    </td>
                  </tr>
                )
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default Table

Table.defaultProps = {
  loadingData: undefined,
  rows: undefined,
  headings: undefined
}

Table.propTypes = {
  loadingData: PropTypes.bool,
  rows: PropTypes.array.isRequired,
  headings: PropTypes.array.isRequired
}