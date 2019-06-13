import React, { useState, useEffect } from "react"
import * as Api from "./../../api"
import Pagination from "Components/pagination"
import PageHeader from "Components/pageheader"
import { getQueryObjByName, getQueryUri } from "Utils/url-utils"
import DataTable from "Components/table/custom-table"
import DsoNavbar from "./../dso-details/dso-navbar"

const dsoUsersTableHeaders = [
  { title: "Name", icon: "" },
  { title: "Email", icon: "" },
  { title: "Designation", icon: "", tooltipText: "" },
  { title: "Role", icon: "", tooltipText: "" },
  { title: "User Status", icon: "", tooltipText: "" }
]

const ManageDsoUsers = (props) => {
  const pageLimit = parseInt(getQueryObjByName("limit")) || 10
  const pageNo = parseInt(getQueryObjByName("activePage")) || 1
  const [activePage, setActivePage] = useState(pageNo)
  const [loadingDsoUsers, setLoadingDsoUsers] = useState(true)
  const [dsoUsers, setDsoUsers] = useState([])
  const [dsoUsersCount, setDsoUsersCount] = useState(0)
  const [limit, setLimit] = useState(pageLimit)
  const [filter, setFilter] = useState([{
    filterby: "dso_id",
    value: getQueryObjByName("id")
  }])
  const [dsoName, setDsoName] = useState(getQueryObjByName("name")) || ""

  /**
   * Payload for fetching dso user list
   */
  const dsoUserReqParams = {
    limit,
    offset: limit * parseInt(activePage - 1),
    filter
  }

  /**
   * OnChange in activePage/limit/filter, it fetches the dso user list
   */
  useEffect(() => {
    fetchDsoUsers(dsoUserReqParams)
  }, [activePage, limit])

  const fetchDsoUsers = (payload) => {
    setLoadingDsoUsers(true)
    setDsoUsers([])
    Api.fetchDsoUsers(payload)
      .then((response) => {
        setLoadingDsoUsers(false)
        setDsoUsers(response.dso_users)
        setDsoUsersCount(response.count)
      })
      .catch((err) => {
        console.log("Error in fetching dso users")
      })
  }

  /**
   * Navigates to next page
   * @param {object} pagerObj - Passed from pagination component
   * @param {Integer} pagerObj.activePage - Used to calculate the offset to fetch next set of dso users
   * @param {Integer} pagerObj.pageSize - Used as limit to fetch next set of dso users
   */
  const handlePageChange = (pagerObj) => {
    let queryParamsObj = {}
    setActivePage(pagerObj.activePage)
    setLimit(parseInt(pagerObj.pageSize))
    if (filter.length > 0) {
      queryParamsObj = {
        activePage: pagerObj.activePage,
        limit: pagerObj.pageSize,
        filter: JSON.stringify(filter),
        id: getQueryObjByName("id"),
        name: getQueryObjByName("name")
      }
    } else {
      queryParamsObj = {
        activePage: pagerObj.activePage,
        limit: pagerObj.pageSize,
        id: getQueryObjByName("id"),
        name: getQueryObjByName("name")
      }
    }

    props.history.push(`/home/dso/view-users?${getQueryUri(queryParamsObj)}`)
  }

  return (
    <React.Fragment >
      <PageHeader pageName="Delivery Service Operators" text={dsoName} />
      <div style={{
        background: '#fff',
        margin: '60px',
      }}>
        <DsoNavbar />
        <div style={{ padding: '30px' }}>
          <p style={{ fontSize: '24px', color: '#2d3f49', marginBottom: '30px' }}>Users</p>
          {(
            <div>
              <Pagination
                activePage={activePage}
                pageSize={limit}
                totalItemsCount={dsoUsersCount}
                onChangePage={handlePageChange}
              />
            </div>
          )}
          {
            <div style={{ overflow: 'auto' }}>
              <DataTable
                headings={dsoUsersTableHeaders}
                loadingData={loadingDsoUsers}
                message="No dso users found"
              >
                {
                  dsoUsers.length > 0 &&
                  dsoUsers.map((item, i) => {
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
          <p style={{ fontSize: '14px', color: "#152935", margin: '10px 0' }}>Note: To add users, go to Users and Roles section</p>
        </div>
      </div>
    </React.Fragment >
  )
}

export default ManageDsoUsers
