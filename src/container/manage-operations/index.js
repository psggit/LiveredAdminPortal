import React, { useState, useEffect } from "react"
import * as Api from "./../../api"
import Pagination from "Components/pagination"
import PageHeader from "Components/pageheader"
import Icon from "Components/icon"
import { getQueryObjByName, getQueryUri } from "Utils/url-utils"
import DataTable from "Components/table/custom-table"
import Moment from "moment"
import Dialog from "Components/dialog"
import Button from "Components/button"
import FilteredParams from "Components/filteredParams"
import Filter from "Components/filterModal"

const exciseOperationTableHeaders = [
  { title: "City", icon: "", tooltipText: "" },
  { title: "State", icon: "" },
  { title: "Delivery Operator", icon: "", tooltipText: "" },
  { title: "Delivery Status", icon: "info", tooltipText: "Current status of delivery operations for a specific city associated to a specific delivery operator" },
]
const toggleExciseDeliveryReqParams = {}

const ManageOperations = (props) => {
  const pageLimit = parseInt(getQueryObjByName("limit")) || 10
  const pageNo = parseInt(getQueryObjByName("activePage")) || 1
  const filterParams = getQueryObjByName("filter") !== undefined && Object.keys(getQueryObjByName("filter")).length > 0 ? JSON.parse(decodeURI(getQueryObjByName("filter"))) : []
  const [activePage, setActivePage] = useState(pageNo)
  const [mountFilter, setMountFilter] = useState(false)
  const [loadingOperations, setLoadingOperations] = useState(true)
  const [operationsData, setOperationsData] = useState([])
  const [operationsDataCount, setOperationsDataCount] = useState(0)
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const [limit, setLimit] = useState(pageLimit)
  const [mountModal, setMountModal] = useState(false)
  const [togglingDeliveryStatus, setToggleDeliveryStatus] = useState(false)
  const [filter, setFilter] = useState(filterParams)
  const [selectedCityIdx, setCityIdx] = useState(-1)
  const [key, setKey] = useState(0)
  //const [selectedStateIdx, setStateIdx] = useState("")
  const [selectedDsoIdx, setDsoIdx] = useState(-1)
  const [selectedDeliveryStatusIdx, setDeliveryStatusIdx] = useState(-1)

  /**
   * Payload for fetching ottp's
   */
  const operationsReqParams = {
    state_id: parseInt(getQueryObjByName("stateId")),
    limit,
    offset: limit * parseInt(activePage - 1)
  }

  /**
   * Sets the dropdown field with selected value
   * @param {String} name - selected dropdown field name
   * @param {String} value - selected dropdown field index
   */
  const setFilteredFieldState = (fieldName, value) => {
    const selectedFieldIdxFn = eval(`set${fieldName}Idx`)
    console.log("selectedFieldFn", selectedFieldIdxFn)
    selectedFieldIdxFn(value)
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
      case 'Delivery Status':
        setFilteredFieldState('DeliveryStatus', item.idx)
        break;
    }
  }

  /**
   * Updates the ottp payload with filter option
   */
  if (filter.length > 0 && isFilterApplied === true) {
    operationsReqParams.filter = filter
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
    fetchAllOperations(operationsReqParams)
  }, [activePage, limit, filter, key])

  const fetchAllOperations = (payload) => {
    setLoadingOperations(true)
    setOperationsData([])
    Api.fetchAllOperations(payload)
      .then((response) => {
        setLoadingOperations(false)
        setOperationsData(response.locations)
        setOperationsDataCount(response.count)
      })
      .catch((err) => {
        console.log("Error in fetching all operations")
      })
  }

  /**
   * Navigates to next page
   * @param {object} pagerObj - Passed from pagination component
   * @param {Integer} pagerObj.activePage - Used to calculate the offset to fetch next set of operation
   * @param {Integer} pagerObj.pageSize - Used as limit to fetch next set of operation
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

    props.history.push(`/home/excise/view-operations?${getQueryUri(queryParamsObj)}`)
  }

  /**
  * Clears the applied filter/search and renders all the operations
  */
  const clearSearchResults = () => {
    if (filter.length > 0) {
      props.history.push(`/home/excise/view-operations?stateId=${getQueryObjByName("stateId")}`)
      setIsFilterApplied(false)
      setFilter([])
    }
    setDsoIdx(-1)
    setCityIdx(-1)
    setDeliveryStatusIdx(-1)
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
    setIsFilterApplied(true)

    const queryObj = {
      limit: 10,
      activePage: 1,
      stateId: getQueryObjByName("stateId"),
      filter: JSON.stringify(uniqueFilter)
    }

    props.history.push(`/home/excise/view-operations?${getQueryUri(queryObj)}`)
    mountFilterModal()
  }

  /**
   * Toggles[mount and unmounts] the filter component
   */
  const mountFilterModal = () => {
    setMountFilter(!mountFilter)
  }

  const updateKey = () => {
    setKey(key + 1)
  }

  const unmountActionModal = () => {
    setMountModal(false)
  }

  const mountActionModal = (e, exciseDetail) => {
    e.stopPropagation()
    toggleExciseDeliveryReqParams.city_id = exciseDetail.city_id
    toggleExciseDeliveryReqParams.dso_id = exciseDetail.dso_id
    toggleExciseDeliveryReqParams.service_status = !exciseDetail.service_status
    setMountModal(true)
  }

  const toggleDeliveryStatus = () => {
    setToggleDeliveryStatus(true)
    Api.changeExciseDeliveryStatus(toggleExciseDeliveryReqParams)
      .then((response) => {
        updateKey()
        setToggleDeliveryStatus(false)
        unmountActionModal()
      })
      .catch((err) => {
        console.log("Error in changing excise delivery status", err)
      })
  }

  return (
    <React.Fragment >
      <PageHeader pageName="Excise Departments" text={getQueryObjByName("name")} />
      <div style={{
        display: "flex",
        margin: "30px 0 20px 0",
        justifyContent: "space-between",
        alignItems: "center",
        padding: '0px 60px'
      }}
        key={key}
      >
        <div style={{ color: "#2d3f49", fontSize: '24px' }}>Operations</div>
        <div style={{ marginLeft: '46px', position: 'relative' }}>
          {
            <span style={{ marginRight: '10px' }}>
              <Button secondary onClick={resetFilter}>
                <span>Reset</span>
              </Button>
            </span>
          }
          <Button primary onClick={mountFilterModal}>
            <Icon name="filter" />
            <span style={{ position: 'relative', top: '-2px', marginLeft: '5px' }}>Filter</span>
          </Button>
          <Filter
            filterName="exciseOperations"
            showFilter={mountFilter}
            applyFilter={applyFilter}
            selectedCityIdx={selectedCityIdx}
            selectedDsoIdx={selectedDsoIdx}
            selectedDeliveryStatusIdx={selectedDeliveryStatusIdx}
          //selectedStateIdx={selectedStateIdx}
          >
          </Filter>
        </div>
      </div>
      {
        isFilterApplied &&
        <FilteredParams data={filter} />
      }
      <div style={{
        background: '#fff',
        margin: '20px 60px',
        padding: '60px'
      }}>
        {(
          <div>
            <Pagination
              activePage={activePage}
              pageSize={limit}
              totalItemsCount={operationsDataCount}
              onChangePage={handlePageChange}
            />
          </div>
        )}
        {
          <div style={{ overflow: 'auto' }}>
            <DataTable
              headings={exciseOperationTableHeaders}
              loadingData={loadingOperations}
              message="No DSO’s associated with Excise Department of Telanagana found, please go to DSO section to update or add new DSOs"
            >
              {
                operationsData.length > 0 &&
                operationsData.map((item, i) => {
                  return (
                    <tr key={i} className="clickable">
                      <td>{item.city}</td>
                      <td>{item.state}</td>
                      <td>{item.dso_name}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {
                            item.service_status
                              ? <span style={{ marginRight: '10px' }} onClick={(e) => mountActionModal(e, item)}>
                                <Icon name="toggleGreen" />
                              </span>
                              : <span style={{ marginRight: '10px' }} onClick={(e) => mountActionModal(e, item)}>
                                <Icon name="toggleRed" />
                              </span>
                          }
                          <span
                            onClick={(e) => mountActionModal(e, item)}
                            style={{ cursor: 'pointer' }}
                          >
                            {item.service_status ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </DataTable>
          </div>
        }
        {
          mountModal &&
          <Dialog
            title="Are you sure you want to perform this action?"
            onClick={unmountActionModal}
            actions={[
              <Button disabled={togglingDeliveryStatus} onClick={() => unmountActionModal()} secondary>
                No
              </Button>,
              <Button disabled={togglingDeliveryStatus} onClick={() => toggleDeliveryStatus()} primary>
                Yes
              </Button>
            ]}
          />
        }
      </div>
    </React.Fragment >
  )
}

export default ManageOperations