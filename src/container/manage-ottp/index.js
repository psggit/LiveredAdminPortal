import React, { useState, useEffect } from "react"
import * as Api from "./../../api"
import Pagination from "Components/pagination"
import PageHeader from "Components/pageheader"
import Icon from "Components/icon"
import Loader from "Components/loader"
import { getQueryObj, getQueryUri } from "Utils/url-utils"
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

const permitStatus = [
  { text: 'ONGOING', value: 1 },
  { text: 'CLOSED', value: 2 },
]

const ManageOTTP = ({ history }) => {

  const [activePage, setActivePage] = useState(1)
  const [dsoList, setDsoList] = useState([])
  const [cityList, setCityList] = useState([])
  const [stateList, setStateList] = useState([])
  const [mountFilter, setMountFilter] = useState(false)
  const [loadingOttp, setLoadingOttp] = useState(true)
  const [ottpData, setOttpData] = useState([])
  const [ottpDataCount, setOttpDataCount] = useState(0)
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const [limit, setLimit] = useState(10)
  const [filter, setFilter] = useState([])
  const [OttpId, setOttpId] = useState("")
  const [selectedCityIdx, setCityIdx] = useState("")
  const [selectedStateIdx, setStateIdx] = useState("")
  const [selectedDsoIdx, setdsoIdx] = useState("")
  const [selectedPermitIdx, setPermitIdx] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")


  useEffect(() => {
    fetchAllOttps({
      limit,
      offset: 0
    })
    fetchFilterDropDownData()
  }, [])

  const fetchAllOttps = (payload) => {
    Api.fetchAllOttps(payload)
      .then((response) => {
        console.log("response", response)
        setOttpData(response.ottp)
        setOttpDataCount(response.count)
        setLoadingOttp(false)
      })
      .catch((err) => {
        console.log("Error in fetching all ottp's")
      })
  }

  const fetchFilterDropDownData = () => {
    fetchDSOList({
      limit: 10000,
      offset: 0
    })
    fetchStateAndCitiesList()
  }

  const fetchDSOList = (payload) => {
    Api.fetchDSOList(payload)
      .then((response) => {
        let dsoList = response.dso.map((item, i) => {
          return { text: item.dso_name, value: i }
        })
        dsoList = [...dsoList, { text: "All", value: dsoList.length }]
        //this.setState({dsoList})
        setDsoList(dsoList)
      })
      .catch((err) => {
        console.log("Error in fetching dso list", err)
      })
  }

  const formatResponse = (response) => {
    let cityList = response.cities.map((item) => {
      return {
        text: item.city_name,
        value: item.id,
        stateId: item.StateId
      }
    })
    cityList = [...cityList, { text: "All", value: cityList.length + 1 }]

    let stateList = response.states.map((item) => {
      return {
        text: item.state_name,
        value: item.id
      }
    })
    stateList = [...stateList, { text: "All", value: stateList.length + 1 }]

    setStateList(stateList)
    setCityList(cityList)
    // this.setState({stateList, cityList})
  }

  const fetchStateAndCitiesList = () => {
    Api.fetchStateAndCitiesList({})
      .then((response) => {
        formatResponse(response)
      })
      .catch((err) => {
        console.log("Error in fetching state and city list", err)
      })
  }

  /**
 * On clicking each liveOrder it takes to detailed view page of that particular order 
 * @param {object} dataObj - Passed from liveOttpListItem 
 * @param {string} dataObj.ottp_id - Used to get the details of clicked live order
 **/
  const handleRowClick = (dataObj) => {
    history.push(
      `/home/live-orders/${dataObj.ottp_info.ottp_id}`,
      dataObj
    )
  }

  /**
   * Navigates to next page
   * @param {object} pagerObj - Passed from pagination component
   * @param {Integer} pagerObj.activePage - Used to calculate the offset to fetch next set of ottp
   * @param {Integer} pagerObj.pageSize - Used as limit to fetch next set of ottp
   */
  const handlePageChange = (pagerObj) => {
    const queryUri = location.search.slice(1)
    const queryObj = getQueryObj(queryUri)
    let queryParamsObj = {}

    const offset = pagerObj.pageSize * (pagerObj.activePage - 1)
    console.log("pager", pagerObj.activePage)
    setActivePage(pagerObj.activePage)
    setLimit(pagerObj.pageSize)

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
    queryParamsObj = {
      activePage: pagerObj.activePage,
      limit: pagerObj.pageSize
    }

    fetchAllOttps({
      limit: pagerObj.pageSize,
      offset
    })
    //}

    history.push(
      queryParamsObj,
      "ottp listing",
      `/home/ottp-management?${getQueryUri(queryParamsObj)}`
    )
  }

  /**
   * Fetches the ottp(order) of given OttpId
   * @param {string} searchQuery - OttpId passed from searchComponent, used for filtering the ottp's
   */
  const handleSearch = (searchQuery) => {
    const filterObj = {
      filterby: "OttpId",
      value: searchQuery
    }
    const urlParams = {
      limit: 10,
      activePage: 1,
      filter: JSON.stringify([filterObj])
    }

    fetchAllOttps({
      limit: 10,
      offset: 0,
      filter: [filterObj]
    })
    setFilter([filterObj])
    history.push(urlParams, "ottp listing", `/home/ottp-management?${(getQueryUri(urlParams))}`)
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
      history.push(`/home/ottp-management`)
      setIsFilterApplied(false)
    }
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
  const applyFilter = (filterArray) => {
    let appliedFilter = []

    //If filter already applied, then adds the new filter options to it
    if (filter) {
      appliedFilter = filter
      filterArray.map((item) => {
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
    history.push(queryObj, "ottp listing", `/home/ottp-management?${getQueryUri(queryObj)}`)
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
          searchText={OttpId}
          search={handleSearch}
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