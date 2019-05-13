import React, { useState, useEffect } from "react"
import * as Api from "./../../api"
import Pagination from "Components/pagination"
import PageHeader from "Components/pageheader"
import Icon from "Components/icon"
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
  { title: "Customer Age verification", icon: "info", tooltipText: "Customer Age Verification" },
]

const ManageOTTP = (props) => {
  const pageLimit = parseInt(getQueryObjByName("limit")) || 10
  const pageNo = parseInt(getQueryObjByName("activePage")) || 1
  const searchedOttpId = getQueryObjByName("filter") !== undefined &&
    Object.keys(getQueryObjByName("filter")).length > 0 &&
    (JSON.parse(decodeURI(getQueryObjByName("filter")))).find((item) => item.filterby === "OttpId") !== undefined
    ? (JSON.parse(decodeURI(getQueryObjByName("filter")))).find((item) => item.filterby === "OttpId").value
    : ""
  const filterParams = getQueryObjByName("filter") !== undefined && Object.keys(getQueryObjByName("filter")).length > 0 ? JSON.parse(decodeURI(getQueryObjByName("filter"))) : []
  const [activePage, setActivePage] = useState(pageNo)
  const [mountFilter, setMountFilter] = useState(false)
  const [loadingOttp, setLoadingOttp] = useState(true)
  const [ottpData, setOttpData] = useState([])
  const [ottpDataCount, setOttpDataCount] = useState(0)
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(searchedOttpId ? true : false)
  const [limit, setLimit] = useState(pageLimit)
  const [filter, setFilter] = useState(filterParams)
  const [OttpId, setOttpId] = useState(searchedOttpId)
  const [selectedCityIdx, setCityIdx] = useState("")
  const [selectedStateIdx, setStateIdx] = useState("")
  const [selectedDsoIdx, setDsoIdx] = useState("")
  const [selectedPermitIdx, setPermitIdx] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  /**
   * Payload for fetching ottp's
   */
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
      const selectedFieldIdxFn = eval(`set${fieldName}Idx`)
      console.log("selectedFieldFn", selectedFieldIdxFn)
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

  /**
   * Updates the ottp payload with filter option
   */
  if (filter.length > 0 && isFilterApplied === true) {
    ottpReqParams.filter = filter
  }

  if (filter.length > 0 && isFilterApplied === false) {
    //sets the filtered fields as default value to filter fields
    filter.map((item) => {
      setSelectedDropDownValue(item)
    })
    setIsFilterApplied(true)
  }

  /**
   * OnChange in activePage/limit/filter, it fetches the ottp's
   */
  useEffect(() => {
    fetchAllOttps(ottpReqParams)
  }, [activePage, limit, filter])

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

  /**
   * Navigates to next page
   * @param {object} pagerObj - Passed from pagination component
   * @param {Integer} pagerObj.activePage - Used to calculate the offset to fetch next set of ottp
   * @param {Integer} pagerObj.pageSize - Used as limit to fetch next set of ottp
   */
  const handlePageChange = (pagerObj) => {
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
    setActivePage(1)
    setFilter([filterObj])
    setIsSearchApplied(true)
    props.history.push(`/home/ottp-management?${(getQueryUri(urlParams))}`)
  }

  /**
  * Clears the applied filter/search and renders all the ottp 
  */
  const clearSearchResults = () => {
    if (filter.length > 0) {
      props.history.push(`/home/ottp-management`)
      setIsFilterApplied(false)
      setFilter([])
    }
    setDsoIdx("")
    setCityIdx("")
    setStateIdx("")
    setPermitIdx("")
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
    const uniqueFilter = appliedFilter.reduce((acc, current) => {
      const isFoundFilter = acc.find(item => item.filterby === current.filterby);
      if (!isFoundFilter) {
        return acc.concat([current]);
      } else {
        const foundFilterIdx = acc.findIndex(item => item.filterby === current.filterby)
        acc[foundFilterIdx] = { ...acc[foundFilterIdx], ...current }
        return acc
      }
    }, []);

    setLimit(10)
    setActivePage(1)
    setFilter(uniqueFilter)
    setIsFilterApplied(isFilterApplied)

    const queryObj = {
      limit: 10,
      activePage: 1,
      filter: JSON.stringify(uniqueFilter)
    }

    props.history.push(`/home/ottp-management?${getQueryUri(queryObj)}`)
    mountFilterModal()
  }

  /**
   * Toggles[mount and unmounts] the filter component
   */
  const mountFilterModal = () => {
    setMountFilter(!mountFilter)
  }

  const handleRowClick = (data) => {
    props.history.push(`/home/ottp-details/${data.ottp_info.ottp_id}`)
  }

  return (
    <React.Fragment >
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
          isFilterApplied && !isSearchApplied &&
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
            applyFilter={applyFilter}
            fromDate={fromDate}
            toDate={toDate}
            selectedCityIdx={selectedCityIdx}
            selectedDsoIdx={selectedDsoIdx}
            selectedPermitIdx={selectedPermitIdx}
            selectedStateIdx={selectedStateIdx}
          >
          </Filter>
        </div>
      </div>
      <div style={{
        background: '#fff',
        margin: '60px',
        padding: '60px'
      }}>
        {(
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
            >
              {
                ottpData.length > 0 &&
                ottpData.map((item, i) => {
                  return (
                    <tr key={i} onClick={() => { handleRowClick(item) }} className="clickable">
                      <td>{item.ottp_info.ottp_id}</td>
                      <td>{Moment(item.ottp_info.issued_at).format("YYYY/MM/DD, h:mm A")}</td>
                      <td>{item.dso.name}</td>
                      <td>{item.retailer.name}</td>
                      <td>{item.consumer.city}</td>
                      <td>₹ {item.order.total}</td>
                      <td>{item.order.total_volume}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', color: "#000" }}>
                          <span style={{ marginRight: '5px' }}>
                            {item.ottp_info.status === "ongoing" ? <Icon name="active" /> : <Icon name="expired" />}
                          </span>
                          <span>{item.ottp_info.status}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', color: "#000" }}>
                          <span style={{ marginRight: '5px' }}>
                            {item.consumer.is_verified ? <Icon name="greenFlag" /> : <Icon name="yellowFlag" />}
                          </span>
                          <span>{item.consumer.is_verified ? "Verified" : "Pending"}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </DataTable>
          </div>
        }
      </div>
    </React.Fragment >
  )
}

export default ManageOTTP