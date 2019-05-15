import React, { useState, useEffect } from "react"
import * as Api from "./../../api"
import Pagination from "Components/pagination"
import PageHeader from "Components/pageheader"
import Icon from "Components/icon"
import { getQueryObjByName, getQueryUri } from "Utils/url-utils"
import DataTable from "Components/table/custom-table"
import Search from "Components/search"

const dsoTableHeaders = [
  { title: "Name", icon: "" },
  { title: "Head Quaters", icon: "" },
  { title: "States Servicable", icon: "info", tooltipText: "" },
  { title: "Validation Status", icon: "info", tooltipText: "Validation status of Delivery Service Operator by Excise Department" },
  { title: "Delivery Service Status", icon: "info", tooltipText: "Current status of Delivery Operator if their service is enabled or disabled" }
]

const ManageDSO = (props) => {
  const pageLimit = parseInt(getQueryObjByName("limit")) || 10
  const pageNo = parseInt(getQueryObjByName("activePage")) || 1
  const searchedDsoName = getQueryObjByName("filter") !== undefined &&
    Object.keys(getQueryObjByName("filter")).length > 0 &&
    (JSON.parse(decodeURI(getQueryObjByName("filter")))).find((item) => item.filterby === "DsoName") !== undefined
    ? (JSON.parse(decodeURI(getQueryObjByName("filter")))).find((item) => item.filterby === "DsoName").value
    : ""
  const filterParams = getQueryObjByName("filter") !== undefined && Object.keys(getQueryObjByName("filter")).length > 0 ? JSON.parse(decodeURI(getQueryObjByName("filter"))) : []
  const [activePage, setActivePage] = useState(pageNo)
  const [loadingDso, setLoadingDso] = useState(true)
  const [dsoData, setDsoData] = useState([])
  const [dsoDataCount, setDsoDataCount] = useState(0)
  const [isSearchApplied, setIsSearchApplied] = useState(searchedDsoName ? true : false)
  const [limit, setLimit] = useState(pageLimit)
  const [filter, setFilter] = useState(filterParams)
  const [dsoName, setDsoName] = useState(searchedDsoName)

  /**
   * Payload for fetching dso list
   */
  const dsoReqParams = {
    limit,
    offset: limit * parseInt(activePage - 1)
  }

  /**
  * Updates the dso payload with filter option
  */
  if (filter.length > 0) {
    dsoReqParams.filter = filter
  }

  /**
   * OnChange in activePage/limit/filter, it fetches the dso list
   */
  useEffect(() => {
    fetchDsoList(dsoReqParams)
  }, [activePage, limit, filter])

  const fetchDsoList = (payload) => {
    setLoadingDso(true)
    setDsoData([])
    Api.fetchDSOList(payload)
      .then((response) => {
        setLoadingDso(false)
        setDsoData(response.dso)
        setDsoDataCount(response.count)
      })
      .catch((err) => {
        console.log("Error in fetching dso list")
      })
  }

  /**
   * Navigates to next page
   * @param {object} pagerObj - Passed from pagination component
   * @param {Integer} pagerObj.activePage - Used to calculate the offset to fetch next set of dso's
   * @param {Integer} pagerObj.pageSize - Used as limit to fetch next set of dos's
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

    props.history.push(`/home/dso-management?${getQueryUri(queryParamsObj)}`)
  }

  /**
   * Fetches the dso details of given dsoName
   * @param {string} searchQuery - dsoName passed from searchComponent, used for filtering the dsoList
   */
  const handleSearch = () => {
    const filterObj = {
      filterby: "DsoName",
      value: dsoName
    }
    const urlParams = {
      limit: 10,
      activePage: 1,
      filter: JSON.stringify([filterObj])
    }
    setActivePage(1)
    setFilter([filterObj])
    setIsSearchApplied(true)
    props.history.push(`/home/dso-management?${(getQueryUri(urlParams))}`)
  }

  /**
  * Clears the applied search and renders all the dso
  */
  const clearSearchResults = () => {
    if (filter.length > 0) {
      props.history.push(`/home/dso-management`)
      setFilter([])
    }
    setDsoName("")
  }

  const handleRowClick = (data) => {
    props.history.push(`/home/dso-details?id=${data.dso_id}&name=${data.dso_name}`)
  }

  return (
    <React.Fragment >
      <PageHeader pageName="Delivery Service Operators" />
      <div style={{
        display: "flex",
        marginTop: "30px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: '0px 60px'
      }}
      >
        <Search
          placeholder="Search by dso name"
          setSearchText={setDsoName}
          searchText={dsoName}
          handleSearch={handleSearch}
          clearSearch={clearSearchResults}
        />
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
              totalItemsCount={dsoDataCount}
              onChangePage={handlePageChange}
            />
          </div>
        )}
        {
          <div style={{ overflow: 'auto' }}>
            <DataTable
              headings={dsoTableHeaders}
              loadingData={loadingDso}
            >
              {
                dsoData.length > 0 &&
                dsoData.map((item, i) => {
                  return (
                    <tr key={i} onClick={() => { handleRowClick(item) }} className="clickable">
                      <td>{item.dso_name}</td>
                      <td>{item.head_office.city}</td>
                      <td></td>
                      <td>{item.is_validated ? "Validated" : "Not Validated"}</td>
                      <td>{item.is_active ? "Enabled" : "Disabled"}</td>
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

export default ManageDSO