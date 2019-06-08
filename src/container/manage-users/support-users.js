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

const supportUserTableHeaders = [
  { title: "Name", icon: "" },
  { title: "Email Address", icon: "" },
  { title: "Designation", icon: "", tooltipText: "" },
  { title: "Role", icon: "", tooltipText: "" },
  { title: "User Type", icon: "", tooltipText: "" },
  { title: "User Status", icon: "info", tooltipText: "Activity status of a user" },
  { title: "", icon: "", tooltipText: "" }
]

let selectedUser = {}

const ManageSupportUser = (props) => {
  const pageLimit = parseInt(getQueryObjByName("limit")) || 10
  const pageNo = parseInt(getQueryObjByName("activePage")) || 1
  const searchedName = getQueryObjByName("filter") !== undefined &&
    Object.keys(getQueryObjByName("filter")).length > 0 &&
    (JSON.parse(decodeURI(getQueryObjByName("filter")))).find((item) => item.filterby === "name") !== undefined
    ? (JSON.parse(decodeURI(getQueryObjByName("filter")))).find((item) => item.filterby === "name").value
    : ""
  const filterParams = getQueryObjByName("filter") !== undefined && Object.keys(getQueryObjByName("filter")).length > 0 ? JSON.parse(decodeURI(getQueryObjByName("filter"))) : []
  const [activePage, setActivePage] = useState(pageNo)
  const [loadingSupportUsers, setLoadingSupportUsers] = useState(true)
  const [supportUsers, setSupportUsers] = useState([])
  const [supportUsersCount, setSupportUsersCount] = useState(0)
  const [isSearchApplied, setIsSearchApplied] = useState(searchedName ? true : false)
  const [limit, setLimit] = useState(pageLimit)
  const [filter, setFilter] = useState(filterParams)
  const [name, setName] = useState(searchedName)
  const [showDeleteUserConfirmationModal, setDeleteUserConfirmationModal] = useState(false)
  const [showEditUserConfirmationModal, setEditUserConfirmationModal] = useState(false)
  const [deactivatingUser, setDeactivatingUser] = useState(false)
  const [editingUser, setEditingUser] = useState(false)
  const [key, setKey] = useState(0)
  /**
   * Payload for fetching support list
   */
  const supportUsersReqParams = {
    limit,
    offset: limit * parseInt(activePage - 1)
  }

  /**
  * Updates the support payload with filter option
  */
  if (filter.length > 0) {
    supportUsersReqParams.filter = filter
  }

  /**
   * OnChange in activePage/limit/filter, it fetches the support list
   */
  useEffect(() => {
    fetchSupportUserList(supportUsersReqParams)
  }, [activePage, limit, filter, key])


  useEffect(() => {
    document.addEventListener("click", unmountTableActionsMenu)
    return function cleanup() {
      document.removeEventListener("click", unmountTableActionsMenu)
    }
  }, [])

  const fetchSupportUserList = (payload) => {
    setLoadingSupportUsers(true)
    setSupportUsers([])
    Api.fetchSupportList(payload)
      .then((response) => {
        setLoadingSupportUsers(false)
        setSupportUsers(response.support_users)
        setSupportUsersCount(response.count)
      })
      .catch((err) => {
        console.log("Error in fetching support users list")
      })
  }

  /**
   * Navigates to next page
   * @param {object} pagerObj - Passed from pagination component
   * @param {Integer} pagerObj.activePage - Used to calculate the offset to fetch next set of support
   * @param {Integer} pagerObj.pageSize - Used as limit to fetch next set of support users
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

    props.history.push(`/home/support-users?${getQueryUri(queryParamsObj)}`)
  }

  /**
   * Fetches the dso details of given name
   * @param {string} searchQuery - name passed from searchComponent, used for filtering the supportUserList
   */
  const handleSearch = () => {
    const filterObj = {
      filterby: "name",
      value: name
    }
    const urlParams = {
      limit: 10,
      activePage: 1,
      filter: JSON.stringify([filterObj])
    }
    setActivePage(1)
    setFilter([filterObj])
    setIsSearchApplied(true)
    props.history.push(`/home/support-users?${(getQueryUri(urlParams))}`)
  }

  const addSupportUser = () => {
    props.history.push(`/home/support-users/create`)
  }

  /**
  * Clears the applied search and renders all the support
  */
  const clearSearchResults = () => {
    if (filter.length > 0) {
      props.history.push(`/home/support-users`)
      setFilter([])
    }
    setName("")
  }

  const showOptions = (e, item) => {
    const position = getPositionBasedOnContainer(e.target)
    selectedUser = item
    const actionItems = [
      "Edit User Settings",
      item.is_active ? "Deactivate User" : "Activate User"
    ]
    mountTableActionsMenu(position, actionItems, mountConfirmationModal)
  }

  const handleEditUser = () => {
    console.log("data", selectedUser)
  }

  const handleDeactivateUser = () => {
    setDeactivatingUser(true)
    Api.deactivateSupportUser({
      id: selectedUser.id,
      is_active: !selectedUser.is_active
    })
      .then((response) => {
        setDeactivatingUser(false)
        setDeleteUserConfirmationModal(false)
        setKey(key + 1)
      })
      .catch((err) => {
        setDeactivatingUser(false)
        console.log("Error in deactivating support user", err)
      })
  }

  const mountConfirmationModal = (action) => {
    if (action === "editUser") {
      setEditUserConfirmationModal(true)
    } else {
      setDeleteUserConfirmationModal(true)
    }
  }

  const addNewUser = () => {
    props.history.push("/home/support-user/create")
  }

  const unmountConfirmationModal = (action) => {
    if (action === "editUser") {
      setEditUserConfirmationModal(false)
    } else {
      setDeleteUserConfirmationModal(false)
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
              placeholder="Search by name"
              setSearchText={setName}
              searchText={name}
              handleSearch={handleSearch}
              clearSearch={clearSearchResults}
            />
          </div>
          {(
            <div>
              <Pagination
                activePage={activePage}
                pageSize={limit}
                totalItemsCount={supportUsersCount}
                onChangePage={handlePageChange}
              />
            </div>
          )}
          {
            <div style={{ overflow: 'auto' }}>
              <DataTable
                headings={supportUserTableHeaders}
                loadingData={loadingSupportUsers}
                message="No users found"
              >
                {
                  supportUsers.length > 0 &&
                  supportUsers.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.designation}</td>
                        <td>{item.roles[0].name}</td>
                        <td>Support</td>
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
        (showDeleteUserConfirmationModal || showEditUserConfirmationModal) &&
        <Dialog
          title="Do you want to perform this action?"
          onClick={unmountConfirmationModal}
          actions={[
            <Button disabled={deactivatingUser || editingUser} onClick={() => unmountConfirmationModal(showDeleteUserConfirmationModal ? "deleteUser" : "editUser")} secondary>
              No
            </Button>,
            <Button disabled={deactivatingUser || editingUser} onClick={showDeleteUserConfirmationModal ? () => handleDeactivateUser() : () => handleEditUser()} primary>
              Yes
            </Button>
          ]}
        />
      }
    </React.Fragment>
  )
}

export default ManageSupportUser