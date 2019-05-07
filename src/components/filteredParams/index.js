import React from "react"
import "./filteredParams.scss"

const FilteredParams = ({ data }) => {
  const textStyle = {
    fontSize: '12px',
    color: '#5a6872'
  }
  return (
    <div style={{ display: 'flex', margin: '9px 0px', alignItems: 'center' }}>
      <p style={textStyle}>Filtered results</p>
      {
        data.map((item, i) => {
          console.log("item", item, item.filterby)
          return (
            <div key={i}>
              <span style={{ margin: '0px 10px', fontSize: '12px' }}>|</span>
              {/* {
                item.filterby !== "Order Amount" && item.filterby !== "City" && item.filterby !== "From" && item.filterby !== "To" &&
                <span style={textStyle}>{item.value}</span>
              } */}
              {
                item.filterby === "From" &&
                <span style={textStyle}>From {item.value}</span>
              }
              {
                item.filterby === "To" &&
                <span style={textStyle}>To {item.value}</span>
              }
              {
                item.filterby === "City" &&
                <span style={textStyle}>{item.cityName}</span>
              }
              {
                item.filterby === "State" &&
                <span style={textStyle}> {item.stateName} </span>
              }
              {
                item.filterby === "Delivery Operator" &&
                <span style={textStyle}>{item.value}</span>
              }
              {
                item.filterby === "Permit Status" &&
                <span style={textStyle}> {item.value} </span>
              }
            </div>
          )
        })
      }
    </div>
  )
}

export default FilteredParams