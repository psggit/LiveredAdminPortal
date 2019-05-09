import React, { useState, useEffect } from "react"
import * as Api from "./../../api"
import Pagination from "Components/pagination"
import PageHeader from "Components/pageheader"
import Icon from "Components/icon"
import Loader from "Components/loader"
import { getQueryObjByName, getQueryUri } from "Utils/url-utils"
import DataTable from "Components/table/custom-table"
import Moment from "moment"
import Search from "Components/search"
import Button from "Components/button"
import FilteredParams from "Components/filteredParams"
import Filter from "Components/filterModal"

const ottpTableHeaders = [
  { title: "Permit ID", icon: "info", tooltipText: "Unique One Time Transport Permit Number" },
  { title: "Date Issued", icon: "" },
  { title: "Delivery Operator", icon: "info", tooltipText: "On-demand application through which a customer places an order" },
  { title: "Retailer", icon: "info", tooltipText: "The retailer/retail outlet which received the order" },
  { title: "City/Town", icon: "" },
  { title: "Order Amount", icon: "info", tooltipText: "Price of the chosen alcohol beverage against its quantity" },
  { title: "Volume (Litres)", icon: "info", tooltipText: "Total volume of alcoholic beverages" },
  { title: "Permit Status", icon: "info", tooltipText: "Validity status of a single Permit ID " },
  { title: "", icon: "", tooltipText: "" },
]

const ManageOTTP = (props) => {
  const pageLimit = parseInt(getQueryObjByName("limit")) || 10
  const pageNo = parseInt(getQueryObjByName("activePage")) || 1
  const filterParams = Object.keys(getQueryObjByName("filter")).length > 0 ? JSON.parse(decodeURI(getQueryObjByName("filter"))) : []
  const [activePage, setActivePage] = useState(pageNo)
  // const [dsoList, setDsoList] = useState([])
  // const [cityList, setCityList] = useState([])
  // const [stateList, setStateList] = useState([])
  const [mountFilter, setMountFilter] = useState(false)
  const [loadingOttp, setLoadingOttp] = useState(true)
  const [ottpData, setOttpData] = useState([])
  const [ottpDataCount, setOttpDataCount] = useState(0)
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const [limit, setLimit] = useState(pageLimit)
  const [filter, setFilter] = useState(filterParams)
  const [OttpId, setOttpId] = useState("")
  const [selectedCityIdx, setCityIdx] = useState("")
  const [selectedStateIdx, setStateIdx] = useState("")
  const [selectedDsoIdx, setdsoIdx] = useState("")
  const [selectedPermitIdx, setPermitIdx] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const ottpReqParams = {
    limit,
    offset: limit * parseInt(activePage - 1)
  }


  /**
   * Sets the dropdown field with selected value
   * @param {String} name - selected dropdown field name
   * @param {String} value - selected dropdown field index
   */
  const setFilteredFieldState = (fieldName, value) => {
    if (fieldName !== "FromDate" && fieldName !== "ToDate") {
      const selectedFieldIdxFn = eval(`selected${fieldName}Idx`)
      selectedFieldIdxFn(value)
    } else if (fieldName === "FromDate") {
      setFromDate(value)
    } else if (fieldName === "ToDate") {
      setToDate(value)
    }
  }

  /**
   * Sets the filtered dropdown value on page reload
   */
  const setSelectedDropDownValue = (item) => {
    console.log("item", item)
    switch (item.filterby) {
      case 'City':
        setFilteredFieldState('City', item.idx)
        break;
      case 'Delivery Operator':
        setFilteredFieldState('Dso', item.idx)
        break;
      case 'State':
        setFilteredFieldState('State', item.idx)
        break;
      case 'Permit Status':
        setFilteredFieldState('Permit', item.idx)
        break;
      case 'From':
        setFilteredFieldState('FromDate', item.value)
        break;
      case 'To':
        setFilteredFieldState('ToDate', item.value)
        break;
    }
  }

  if (filter.length > 0 && isFilterApplied === false) {
    ottpReqParams.filter = filter
    //sets the filtered fields as default value to filter fields
    filter.map((item) => {
      setSelectedDropDownValue(item)
    })
    setIsFilterApplied(true)
  }

  useEffect(() => {
    fetchAllOttps(ottpReqParams)
    fetchFilterDropDownData()
  }, [activePage])

  const fetchAllOttps = (payload) => {
    setLoadingOttp(true)
    setOttpData([])
    Api.fetchAllOttps(payload)
      .then((response) => {
        console.log("response", response)
        setLoadingOttp(false)
        setOttpData(response.ottp)
        setOttpDataCount(response.count)
      })
      .catch((err) => {
        console.log("Error in fetching all ottp's")
      })
  }

  // const fetchFilterDropDownData = () => {
  //   fetchDSOList({
  //     limit: 10000,
  //     offset: 0
  //   })
  //   fetchStateAndCitiesList()
  // }

  // const fetchDSOList = (payload) => {
  //   Api.fetchDSOList(payload)
  //     .then((response) => {
  //       let dsoList = response.dso.map((item, i) => {
  //         return { text: item.dso_name, value: i }
  //       })
  //       dsoList = [...dsoList, { text: "All", value: dsoList.length }]
  //       setDsoList(dsoList)
  //     })
  //     .catch((err) => {
  //       console.log("Error in fetching dso list", err)
  //     })
  // }

  // const fetchStateAndCitiesList = () => {
  //   Api.fetchStateAndCitiesList({})
  //     .then((response) => {
  //       formatResponse(response)
  //     })
  //     .catch((err) => {
  //       console.log("Error in fetching state and city list", err)
  //     })
  // }

  // const formatResponse = (response) => {
  //   let cityList = response.cities.map((item) => {
  //     return {
  //       text: item.city_name,
  //       value: item.id,
  //       stateId: item.StateId
  //     }
  //   })
  //   cityList = [...cityList, { text: "All", value: cityList.length + 1 }]

  //   let stateList = response.states.map((item) => {
  //     return {
  //       text: item.state_name,
  //       value: item.id
  //     }
  //   })
  //   stateList = [...stateList, { text: "All", value: stateList.length + 1 }]

  //   setStateList(stateList)
  //   setCityList(cityList)
  // }

  /**
   * Navigates to next page
   * @param {object} pagerObj - Passed from pagination component
   * @param {Integer} pagerObj.activePage - Used to calculate the offset to fetch next set of ottp
   * @param {Integer} pagerObj.pageSize - Used as limit to fetch next set of ottp
   */
  const handlePageChange = (pagerObj) => {
    //const queryObj = getQueryObj()
    let queryParamsObj = {}
    setActivePage(pagerObj.activePage)
    setLimit(pagerObj.pageSize)
    if (filter.length > 0) {
      queryParamsObj = {
        activePage: pagerObj.activePage,
        limit: pagerObj.pageSize,
        filter: queryObj.filter
      }
    } else {
      queryParamsObj = {
        activePage: pagerObj.activePage,
        limit: pagerObj.pageSize
      }
    }
    // if(queryObj.filter && queryObj.filter.length) {
    //   queryParamsObj = {
    //     activePage: pagerObj.activePage,
    //     limit: pagerObj.pageSize,
    //     filter: queryObj.filter
    //   }
    //   this.props.actions.fetchInProgressOTTP({
    //     limit: pagerObj.pageSize,
    //     activePage: pagerObj.activePage,
    //     offset,
    //     filter: JSON.parse(decodeURIComponent(queryObj.filter))
    //   })
    // } else {


    // fetchAllOttps({
    //   limit,
    //   offset: limit * parseInt(activePage - 1)
    // })
    //}

    props.history.push(`/home/ottp-management?${getQueryUri(queryParamsObj)}`)
  }

  /**
   * Fetches the ottp(order) of given OttpId
   * @param {string} searchQuery - OttpId passed from searchComponent, used for filtering the ottp's
   */
  const handleSearch = () => {
    const filterObj = {
      filterby: "OttpId",
      value: OttpId
    }
    const urlParams = {
      limit: 10,
      activePage: 1,
      filter: JSON.stringify([filterObj])
    }

    // fetchAllOttps({
    //   limit: 10,
    //   offset: 0,
    //   filter: [filterObj]
    // })
    //setLimit(10)
    setActivePage(1)
    setFilter([filterObj])
    props.history.push(`/home/ottp-management?${(getQueryUri(urlParams))}`)
  }

  /**
  * Clears the applied filter/search and renders all the ottp 
  */
  const clearSearchResults = () => {
    if (filter.length > 0) {
      fetchAllOttps({
        limit,
        offset: 0
      })
      props.history.push(`/home/ottp-management`)
      setIsFilterApplied(false)
      setFilter([])
    }
    setOttpId("")
  }

  /**
  * Clears the filter
  */
  const resetFilter = () => {
    clearSearchResults()
  }

  /**
 * Fetches the filtered ottp
 * @param {array of object} filter - Passed form FilterModal component
 */
  const applyFilter = (newFilter) => {
    let appliedFilter = []

    //If filter already applied, then adds the new filter options to it
    if (filter) {
      appliedFilter = filter
      newFilter.map((item) => {
        appliedFilter.push(item)
      })
    }

    setLimit(10)
    setFilter(appliedFilter)
    setIsFilterApplied(isFilterApplied)

    const queryObj = {
      limit: 10,
      offset: 0,
      activePage: 1,
      filter: JSON.stringify(appliedFilter)
    }
    fetchAllOttps({
      limit: 10,
      offset: 0,
      filter: appliedFilter
    })
    console.log("applied filter", appliedFilter, queryObj)
    props.history.push(`/home/ottp-management?${getQueryUri(queryObj)}`)
    mountFilterModal()
  }

  /**
   * Toggles[mount and unmounts] the filter component
   */
  const mountFilterModal = () => {
    setMountFilter(!mountFilter)
  }

  return (
    <React.Fragment>
      <PageHeader pageName="Ottp Management" />
      <div style={{
        display: "flex",
        marginTop: "30px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: '0px 60px'
      }}
      >
        <Search
          placeholder="Search by permit Id"
          setSearchText={setOttpId}
          searchText={OttpId}
          handleSearch={handleSearch}
          clearSearch={clearSearchResults}
        />
        {
          isFilterApplied &&
          <FilteredParams data={filter} />
        }
        <div style={{ marginLeft: '46px', position: 'relative' }}>
          <span style={{ marginRight: '10px' }}>
            <Button secondary onClick={resetFilter}>
              <span>Reset</span>
            </Button>
          </span>
          <Button primary onClick={mountFilterModal}>
            <Icon name="filter" />
            <span style={{ position: 'relative', top: '-2px', marginLeft: '5px' }}>Filter</span>
          </Button>
          <Filter
            showFilter={mountFilter}
            // filterName="liveOrders"
            applyFilter={applyFilter}
            cityList={cityList}
            stateList={stateList}
            permitStatus={permitStatus}
            dsoList={dsoList}
            fromDate={fromDate}
            toDate={toDate}
          >
          </Filter>
        </div>
      </div>
      <div style={{
        background: '#fff',
        margin: '60px',
        padding: '60px'
      }}>
        {!loadingOttp && ottpData.length > 1 && (
          <div>
            <Pagination
              activePage={activePage}
              pageSize={limit}
              totalItemsCount={ottpDataCount}
              onChangePage={handlePageChange}
            />
          </div>
        )}
        {
          <div style={{ overflow: 'auto' }}>
            <DataTable
              headings={ottpTableHeaders}
              loadingData={loadingOttp}
            //className="logs"
            >
              {
                ottpData.length > 0 &&
                ottpData.map((item, i) => {
                  return (
                    <tr key={i} onClick={() => { handleClick(data) }} className="clickable">
                      <td>{item.ottp_info.ottp_id}</td>
                      <td>{Moment(item.ottp_info.issued_at).format("YYYY/MM/DD, h:mm A")}</td>
                      <td>{item.dso.name}</td>
                      <td>{item.retailer.name}</td>
                      <td>{item.consumer.city}</td>
                      <td>₹ {item.order.total}</td>
                      <td>{item.order.total_volume}</td>
                      <td>{item.ottp_info.status}</td>
                      <td>{`valid till ${Moment(item.ottp_info.expiry_at).format("h:mm A")}`}</td>
                    </tr>
                  )
                })
              }
            </DataTable>
          </div>
        }
      </div>
    </React.Fragment>
  )
}

export default ManageOTTP