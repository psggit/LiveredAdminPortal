import React, { useState, useEffect } from "react"
import * as Api from "./../../api"
import Pagination from "Components/pagination"
import PageHeader from "Components/pageheader"
import { getQueryObjByName, getQueryUri } from "Utils/url-utils"
import DataTable from "Components/table/custom-table"
import ExciseNavbar from "./../excise-details/excise-navbar"

const exciseTableHeaders = [
  { title: "Name", icon: "" },
  { title: "Email", icon: "" },
  { title: "Designation", icon: "", tooltipText: "" },
  { title: "Role", icon: "", tooltipText: "" },
  { title: "User Status", icon: "", tooltipText: "" }
]

const ManageExciseUsers = (props) => {
  const pageLimit = parseInt(getQueryObjByName("limit")) || 10
  const pageNo = parseInt(getQueryObjByName("activePage")) || 1
  const [activePage, setActivePage] = useState(pageNo)
  const [loadingExcise, setLoadingExcise] = useState(true)
  const [exciseData, setExciseData] = useState([])
  const [filter, setFilter] = useState([{
    filterby: "state_id",
    value: getQueryObjByName("stateId")
  }])
  const [exciseDataCount, setExciseDataCount] = useState(0)
  const [limit, setLimit] = useState(pageLimit)

  /**
   * Payload for fetching excise list
   */
  const exciseReqParams = {
    limit,
    offset: limit * parseInt(activePage - 1),
    filter: [{
      filterby: "state_id",
      value: getQueryObjByName("stateId")
    }]
  }

  /**
   * OnChange in activePage/limit/filter, it fetches the excise list
   */
  useEffect(() => {
    fetchExciseUsers(exciseReqParams)
  }, [activePage, limit])

  const fetchExciseUsers = (payload) => {
    setLoadingExcise(true)
    setExciseData([])
    Api.fetchExciseUsers(payload)
      .then((response) => {
        setLoadingExcise(false)
        setExciseData(response.excise_users)
        setExciseDataCount(response.count)
      })
      .catch((err) => {
        console.log("Error in fetching excise users")
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
    setLimit(parseInt(pagerObj.pageSize))
    if (filter.length > 0) {
      queryParamsObj = {
        activePage: pagerObj.activePage,
        limit: pagerObj.pageSize,
        stateId: getQueryObjByName("stateId"),
        name: getQueryObjByName("name"),
        filter: JSON.stringify(filter)
      }
    } else {
      queryParamsObj = {
        activePage: pagerObj.activePage,
        limit: pagerObj.pageSize,
        stateId: getQueryObjByName("stateId"),
        name: getQueryObjByName("name"),
      }
    }

    props.history.push(`/home/excise/view-users?${getQueryUri(queryParamsObj)}`)
  }

  return (
    <React.Fragment >
      <PageHeader
        pageName="Excise Departments"
        text={getQueryObjByName("name")}
        pathname="/home/excise-management"
      />
      <div style={{
        background: '#fff',
        margin: '60px',
      }}>
        <ExciseNavbar />
        <div style={{ padding: '30px' }}>
          <p style={{ fontSize: '24px', color: '#2d3f49', marginBottom: '30px' }}>Users</p>
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
                message="No excise users found"
              >
                {
                  exciseData.length > 0 &&
                  exciseData.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.designation}</td>
                        <td>{item.roles[0].name}</td>
                        <td>{item.is_active ? "Active" : "Inactive"}</td>
                      </tr>
                    )
                  })
                }
              </DataTable>
            </div>
          }
        </div>
      </div>
    </React.Fragment >
  )
}

export default ManageExciseUsers