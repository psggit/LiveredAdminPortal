import React, { useState, useEffect } from "react"
import * as Api from "./../../api"
import Pagination from "Components/pagination"
import PageHeader from "Components/pageheader"
import { getQueryObjByName, getQueryUri } from "Utils/url-utils"
import DataTable from "Components/table/custom-table"
import Search from "Components/search"
import Button from "Components/button"

const exciseTableHeaders = [
  { title: "Name", icon: "" },
  { title: "State/City", icon: "" },
  { title: "Contact Name", icon: "", tooltipText: "" },
  { title: "Email ID", icon: "", tooltipText: "" },
  { title: "Contact Number", icon: "", tooltipText: "" },
  { title: "Delivery Status", icon: "info", tooltipText: "Current status of delivery operations for the state. Exceptions prevail for specific cities based on special restrictions" },
]

const ManageExcise = (props) => {
  const pageLimit = parseInt(getQueryObjByName("limit")) || 10
  const pageNo = parseInt(getQueryObjByName("activePage")) || 1
  const searchedExciseName = getQueryObjByName("filter") !== undefined &&
    Object.keys(getQueryObjByName("filter")).length > 0 &&
    (JSON.parse(decodeURI(getQueryObjByName("filter")))).find((item) => item.filterby === "DsoName") !== undefined
    ? (JSON.parse(decodeURI(getQueryObjByName("filter")))).find((item) => item.filterby === "DsoName").value
    : ""
  const filterParams = getQueryObjByName("filter") !== undefined && Object.keys(getQueryObjByName("filter")).length > 0 ? JSON.parse(decodeURI(getQueryObjByName("filter"))) : []
  const [activePage, setActivePage] = useState(pageNo)
  const [loadingExcise, setLoadingExcise] = useState(true)
  const [exciseData, setExciseData] = useState([])
  const [exciseDataCount, setExciseDataCount] = useState(0)
  const [isSearchApplied, setIsSearchApplied] = useState(searchedExciseName ? true : false)
  const [limit, setLimit] = useState(pageLimit)
  const [filter, setFilter] = useState(filterParams)
  const [exciseName, setExciseName] = useState(searchedExciseName)

  /**
   * Payload for fetching excise list
   */
  const exciseReqParams = {
    limit,
    offset: limit * parseInt(activePage - 1)
  }

  /**
  * Updates the excise payload with filter option
  */
  if (filter.length > 0) {
    exciseReqParams.filter = filter
  }

  /**
   * OnChange in activePage/limit/filter, it fetches the excise list
   */
  useEffect(() => {
    fetchExciseList(exciseReqParams)
  }, [activePage, limit, filter])

  const fetchExciseList = (payload) => {
    setLoadingExcise(true)
    setExciseData([])
    Api.fetchExciseList(payload)
      .then((response) => {
        setLoadingExcise(false)
        setExciseData(response.excise)
        setExciseDataCount(response.count)
      })
      .catch((err) => {
        console.log("Error in fetching excise list")
      })
  }

  /**
   * Navigates to next page
   * @param {object} pagerObj - Passed from pagination component
   * @param {Integer} pagerObj.activePage - Used to calculate the offset to fetch next set of excise
   * @param {Integer} pagerObj.pageSize - Used as limit to fetch next set of excise
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

    props.history.push(`/home/excise-management?${getQueryUri(queryParamsObj)}`)
  }

  /**
   * Fetches the dso details of given exciseName
   * @param {string} searchQuery - exciseName passed from searchComponent, used for filtering the exciseList
   */
  const handleSearch = () => {
    const filterObj = {
      filterby: "ExciseName",
      value: exciseName
    }
    const urlParams = {
      limit: 10,
      activePage: 1,
      filter: JSON.stringify([filterObj])
    }
    setActivePage(1)
    setFilter([filterObj])
    setIsSearchApplied(true)
    props.history.push(`/home/excise-management?${(getQueryUri(urlParams))}`)
  }

  const addNewExcise = () => {
    props.history.push(`/home/excise/create-details`)
  }

  const handleRowClick = (data) => {
    props.history.push(`/home/excise/view-details?stateId=${data.state_id}&name=${data.name}`)
  }

  /**
  * Clears the applied search and renders all the excise
  */
  const clearSearchResults = () => {
    if (filter.length > 0) {
      props.history.push(`/home/excise-management`)
      setFilter([])
    }
    setExciseName("")
  }

  return (
    <React.Fragment >
      <PageHeader pageName="Excise Departments" />
      <div style={{
        display: "flex",
        marginTop: "30px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: '0px 60px'
      }}
      >
        <Search
          placeholder="Search by excise name"
          setSearchText={setExciseName}
          searchText={exciseName}
          handleSearch={handleSearch}
          clearSearch={clearSearchResults}
        />
        <Button custom
          icon="addWhiteIcon"
          onClick={addNewExcise}
        >
          Add new
        </Button>
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
              totalItemsCount={exciseDataCount}
              onChangePage={handlePageChange}
            />
          </div>
        )}
        {
          <div style={{ overflow: 'auto' }}>
            <DataTable
              headings={exciseTableHeaders}
              loadingData={loadingExcise}
              message="No excise deparments found"
            >
              {
                exciseData.length > 0 &&
                exciseData.map((item, i) => {
                  return (
                    <tr key={i} onClick={() => { handleRowClick(item) }} className="clickable">
                      <td>{item.name}</td>
                      <td>{item.state}</td>
                      <td>{item.primary_contact_name}</td>
                      <td>{item.primary_contact_email}</td>
                      <td>{item.primary_contact_phone}</td>
                      <td>{item.delivery_status ? "Enabled" : "Disabled"}</td>
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

export default ManageExcise