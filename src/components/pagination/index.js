import React, {useState, useEffect} from "react"
import Icon from 'Components/icon'
import PropTypes from "prop-types"
                              
const pageSizeOptions = [
  {
    text: "10",
    value: "1"
  },
  {
    text: "50",
    value: "2"
  },
  {
    text: "100",
    value: "3"
  }
]
const Pagination = ({pageSize, totalItemsCount, activePage, onChangePage}) => {
  const initialActivePageSize = pageSize 
                                ? pageSizeOptions.find(item => item.text === pageSize.toString()).value 
                                : 1
  const [activePageSize, setActivePageSize] = useState(initialActivePageSize)
  const [pager, setPager] = useState({})
  
  
  useEffect(() => {
    if(activePage) {
      setPager({activePage, totalItemsCount, pageSize})
      setActivePageSize(pageSizeOptions.find(item => item.text === pageSize.toString()).value)
    }
  }, [activePage, totalItemsCount])

  const updateActivePage = (activePage) => {
    console.log("active", activePage)
    if (Number.isInteger(totalItemsCount / pageSize)) {
      if (activePage < 1 || activePage > ((totalItemsCount / pageSize))) {
        return
      }
    } else {
      if (activePage < 1 || activePage > ((totalItemsCount / pageSize) + 1)) {
        return
      }
    }

    let newPager = { ...pager } 
    newPager.activePage = activePage     

    setPager(newPager)
    setActivePageSize(pageSizeOptions.find(item => item.text === pageSize.toString()).value)
    onChangePage(newPager)
  }

  const updatePageSize = (e) => {
    const selectedValue = pageSizeOptions.find(item => item.value === e.target.value).text
    if (activePage < 1) {
      return
    }
    let newPager = { ...pager }
    newPager.pageSize =  parseInt(selectedValue)
    newPager.activePage =  1

    setPager(newPager)
    setActivePageSize(e.target.value)
    onChangePage(newPager)                      
  }

  return (
    <div 
      style={{
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }}
    >   
      <div>
        <div style={{ display: 'inline-block', marginRight: '10px' }}>
          <select 
            onChange={e => updatePageSize(e)}
            value={activePageSize}
            style={{ 
              height: '24px',
              border: 'none', 
              width: '60px', 
              color: '#152935',
              fontSize: '14px',
              lineHeight: '1.29',
              padding: '0 5px',
              backgroundColor: 'rgba(61, 112, 178, 0.1)'
            }}
          >
            {
              pageSizeOptions.map((item, i) => {
                return <option key={i} value={item.value}>{item.text}</option>
              })
            }
          </select>
        </div>
        <div style={{display: 'inline-block'}}>
          <span
            style={{
              fontSize: '12px',
              lineHeight: '1.25',
              color: '#5a6872'
            }}
          >
            Items per page | {pageSize * activePage > totalItemsCount ? totalItemsCount - ((totalItemsCount % pageSize) - 1) : ((pageSize * activePage) - (pageSize - 1))} - {pageSize * activePage > totalItemsCount ? totalItemsCount : pageSize * activePage} of {totalItemsCount} items
          </span>
        </div>
      </div>
      
      <div >
        <span style={{
          marginRight: '20px',
          fontSize: '12px',
          lineHeight: '1.25',
          color: '#5a6872'
        }}
        > 
          {activePage} of {Math.ceil(totalItemsCount/pageSize)} pages 
        </span>

        <span  
          onClick={() => updateActivePage(parseInt(activePage)-1)}
          style={{cursor: 'pointer'}}
        >
          <Icon name="leftArrow"/>
        </span>

        <span 
          style={{
            margin: '30px',
            // width: '26px',
            height: '24px',
            padding: '3px 10px',
            fontSize: '14px',
            color: '#152935',
            backgroundColor: 'rgba(61, 112, 178, 0.1)'
          }}
        > 
          {activePage} 
        </span>

        <span  
          onClick={() => updateActivePage(parseInt(activePage)+1)}
          style={{cursor: 'pointer'}}
        >
          <Icon name="rightArrow"/>
        </span>

      </div>
    </div>
  )

}

export default Pagination

Pagination.defaultProps = {
  activePage: 1,
  pageSize: 10,
  totalItemsCount: undefined,
  onChangePage: undefined
}

Pagination.propTypes = {
  activePage: PropTypes.number,
  pageSize: PropTypes.number,
  totalItemsCount: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired
}