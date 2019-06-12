import React, { useState, useEffect } from "react"
import * as Api from "../../api"
import Pagination from "Components/pagination"
import PageHeader from "Components/pageheader"
import { getQueryObjByName, getQueryUri } from "Utils/url-utils"
import DataTable from "Components/table/custom-table"
import Search from "Components/search"
import Dialog from "Components/dialog"
import Button from "Components/button"
import Icon from "Components/icon"
import UserNavbar from "./user-navbar"
import { getPositionBasedOnContainer } from "Utils/helpers"
import { mountTableActionsMenu } from "Components/table/utils"
import { unmountTableActionsMenu } from "Components/table/utils"
import "./user.scss"

const dsoUserTableHeaders = [
  { title: "Name", icon: "" },
  { title: "Email Address", icon: "" },
  { title: "Designation", icon: "", tooltipText: "" },
  { title: "Role", icon: "", tooltipText: "" },
  { title: "User Type", icon: "", tooltipText: "" },
  { title: "User Status", icon: "info", tooltipText: "Activity status of a user" },
  { title: "", icon: "", tooltipText: "" }
]

let selectedUser = {}

const ManageDsoUser = (props) => {
  const pageLimit = parseInt(getQueryObjByName("limit")) || 10
  const pageNo = parseInt(getQueryObjByName("activePage")) || 1
  const searchedDsoName = getQueryObjByName("filter") !== undefined &&
    Object.keys(getQueryObjByName("filter")).length > 0 &&
    (JSON.parse(decodeURI(getQueryObjByName("filter")))).find((item) => item.filterby === "name") !== undefined
    ? (JSON.parse(decodeURI(getQueryObjByName("filter")))).find((item) => item.filterby === "name").value
    : ""
  const filterParams = getQueryObjByName("filter") !== undefined && Object.keys(getQueryObjByName("filter")).length > 0
    ? JSON.parse(decodeURI(getQueryObjByName("filter")))
    : []
  const [activePage, setActivePage] = useState(pageNo)
  const [loadingDsoUsers, setLoadingDsoUsers] = useState(true)
  const [dsoUsers, setDsoUsers] = useState([])
  const [dsoUsersCount, setDsoUsersCount] = useState(0)
  const [isSearchApplied, setIsSearchApplied] = useState(searchedDsoName ? true : false)
  const [limit, setLimit] = useState(pageLimit)
  const [filter, setFilter] = useState(filterParams)
  const [dsoName, setDsoName] = useState(searchedDsoName)
  const [showDeactivateUserConfirmationModal, setDeactivateUserConfirmationModal] = useState(false)
  const [showDeleteUserConfirmationModal, setDeleteUserConfirmationModal] = useState(false)
  const [deactivatingUser, setDeactivatingUser] = useState(false)
  const [deletingUser, setDeletingUser] = useState(false)
  const [key, setKey] = useState(0)
  /**
   * Payload for fetching dso list
   */
  const dsoUsersReqParams = {
    limit,
    offset: limit * parseInt(activePage - 1),
    filter: []
  }

  /**
  * Updates the dso payload with filter option
  */
  if (filter.length > 0) {
    dsoUsersReqParams.filter = filter
  }

  /**
   * OnChange in activePage/limit/filter, it fetches the dso list
   */
  useEffect(() => {
    fetchDsoUserList(dsoUsersReqParams)
  }, [activePage, limit, filter, key])


  useEffect(() => {
    document.addEventListener("click", unmountTableActionsMenu)
    return function cleanup() {
      document.removeEventListener("click", unmountTableActionsMenu)
    }
  }, [])

  const fetchDsoUserList = (payload) => {
    setLoadingDsoUsers(true)
    setDsoUsers([])
    Api.fetchDsoUsers(payload)
      .then((response) => {
        setLoadingDsoUsers(false)
        setDsoUsers(response.dso_users)
        setDsoUsersCount(response.count)
      })
      .catch((err) => {
        console.log("Error in fetching dso users list")
      })
  }

  /**
   * Navigates to next page
   * @param {object} pagerObj - Passed from pagination component
   * @param {Integer} pagerObj.activePage - Used to calculate the offset to fetch next set of dso
   * @param {Integer} pagerObj.pageSize - Used as limit to fetch next set of dso users
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

    props.history.push(`/home/dso-users?${getQueryUri(queryParamsObj)}`)
  }

  /**
   * Fetches the dso details of given name
   * @param {string} searchQuery - name passed from searchComponent, used for filtering the exciseUserList
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
    props.history.push(`/home/dso-users?${(getQueryUri(urlParams))}`)
  }

  // const addDsoUser = () => {
  //   props.history.push(`/home/dso-users/create`)
  // }

  /**
  * Clears the applied search and renders all the excise
  */
  const clearSearchResults = () => {
    if (filter.length > 0) {
      props.history.push(`/home/dso-users`)
      setFilter([])
    }
    setDsoName("")
  }

  const showOptions = (e, item) => {
    const position = getPositionBasedOnContainer(e.target)
    selectedUser = item
    const actionItems = [
      "Delete User",
      item.is_active ? "Deactivate User" : "Activate User"
    ]
    mountTableActionsMenu(position, actionItems, mountConfirmationModal)
  }

  const handleDeleteUser = () => {
    setDeletingUser(true)
    Api.deleteDsoUser({
      id: selectedUser.id
    })
      .then((response) => {
        setDeletingUser(false)
        setDeleteUserConfirmationModal(false)
        setKey(key + 1)
      })
      .catch((err) => {
        setDeletingUser(false)
        console.log("Error in deleting dso user", err)
      })
  }

  const handleDeactivateUser = () => {
    setDeactivatingUser(true)
    Api.deactivateDsoUser({
      id: selectedUser.id,
      is_active: !selectedUser.is_active
    })
      .then((response) => {
        setDeactivatingUser(false)
        setDeactivateUserConfirmationModal(false)
        setKey(key + 1)
      })
      .catch((err) => {
        setDeactivatingUser(false)
        console.log("Error in deactivating dso user", err)
      })
  }

  const mountConfirmationModal = (action) => {
    if (action === "deleteUser") {
      setDeleteUserConfirmationModal(true)
    } else {
      setDeactivateUserConfirmationModal(true)
    }
  }

  const addNewUser = () => {
    props.history.push("/home/dso-user/create")
  }

  const unmountConfirmationModal = (action) => {
    if (action === "deleteUser") {
      setDeleteUserConfirmationModal(false)
    } else {
      setDeactivateUserConfirmationModal(false)
    }
  }

  return (
    <React.Fragment>
      <div id="User" key={key}>
        <PageHeader pageName="Users & Roles" />

        <div className="navbar">
          <UserNavbar addNewUser={addNewUser} />
        </div>

        <div className="container">
          <div className="search-container">
            <Search
              placeholder="Search by dso name"
              setSearchText={setDsoName}
              searchText={dsoName}
              handleSearch={handleSearch}
              clearSearch={clearSearchResults}
            />
          </div>
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
                headings={dsoUserTableHeaders}
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
                        <td>DSO</td>
                        <td>{item.is_active ? "Active" : "Inactive"}</td>
                        <td>
                          <span onMouseOver={(e) => showOptions(e, item)}>
                            <Icon name="optionIcon" />
                          </span>
                        </td>
                      </tr>
                    )
                  })
                }
              </DataTable>
            </div>
          }
        </div>
      </div>
      {
        (showDeactivateUserConfirmationModal || showDeleteUserConfirmationModal) &&
        <Dialog
          title={`Do you want to ${showDeactivateUserConfirmationModal ? selectedUser.is_active ? 'deactivate' : 'activate' : 'delete'} user: ${selectedUser.name}?`}
          onClick={unmountConfirmationModal}
          actions={[
            <Button
              disabled={deactivatingUser || deletingUser}
              onClick={() => unmountConfirmationModal(showDeactivateUserConfirmationModal ? "deleteUser" : "editUser")}
              secondary
            >
              No
            </Button>,
            <Button
              disabled={deactivatingUser || deletingUser}
              onClick={showDeactivateUserConfirmationModal ? () => handleDeactivateUser() : () => handleDeleteUser()}
              primary
            >
              Yes
            </Button>
          ]}
        />
      }
    </React.Fragment>
  )
}

export default ManageDsoUser