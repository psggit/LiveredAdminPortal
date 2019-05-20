import React, { useState, useEffect } from "react"
import * as Api from "./../../api"
import Pagination from "Components/pagination"
import PageHeader from "Components/pageheader"
import Icon from "Components/icon"
import Moment from "moment"
import { getQueryObjByName, getQueryUri } from "Utils/url-utils"
import DataTable from "Components/table/custom-table"

const creditTableHeaders = [
  { title: "Transaction ID", icon: "" },
  { title: "Date", icon: "" },
  { title: "Time", icon: "", tooltipText: "" },
  { title: "Mode of Payment", icon: "", tooltipText: "" },
  { title: "Total Amount", icon: "", tooltipText: "" }
]

const ManageCredits = (props) => {
  const pageLimit = parseInt(getQueryObjByName("limit")) || 10
  const pageNo = parseInt(getQueryObjByName("activePage")) || 1
  const [activePage, setActivePage] = useState(pageNo)
  const [loadingCredits, setLoadingCredits] = useState(true)
  const [creditsData, setCreditsData] = useState([])
  const [creditsDataCount, setCreditsDataCount] = useState(0)
  const [limit, setLimit] = useState(pageLimit)
  const [dsoName, setDsoName] = useState(getQueryObjByName("name")) || ""

  /**
   * Payload for fetching credit list
   */
  const creditsReqParams = {
    limit,
    offset: limit * parseInt(activePage - 1)
  }

  /**
   * OnChange in activePage/limit/filter, it fetches the credit list
   */
  useEffect(() => {
    fetchCreditsList(creditsReqParams)
  }, [activePage, limit])

  const fetchCreditsList = (payload) => {
    setLoadingCredits(true)
    setCreditsData([])
    Api.fetchCreditsList(payload)
      .then((response) => {
        setLoadingCredits(false)
        setCreditsData(response.dso)
        setCreditsDataCount(response.count)
      })
      .catch((err) => {
        console.log("Error in fetching credits list")
      })
  }

  /**
   * Navigates to next page
   * @param {object} pagerObj - Passed from pagination component
   * @param {Integer} pagerObj.activePage - Used to calculate the offset to fetch next set of credits
   * @param {Integer} pagerObj.pageSize - Used as limit to fetch next set of credits
   */
  const handlePageChange = (pagerObj) => {
    let queryParamsObj = {}
    setActivePage(pagerObj.activePage)
    setLimit(pagerObj.pageSize)

    queryParamsObj = {
      activePage: pagerObj.activePage,
      limit: pagerObj.pageSize
    }

    props.history.push(`/home/credit-management?${getQueryUri(queryParamsObj)}`)
  }

  return (
    <React.Fragment >
      <PageHeader pageName="Delivery Service Operators" text={dsoName} />
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
              totalItemsCount={creditsDataCount}
              onChangePage={handlePageChange}
            />
          </div>
        )}
        {
          <div style={{ overflow: 'auto' }}>
            <DataTable
              headings={creditTableHeaders}
              loadingData={loadingCredits}
            >
              {
                creditsData.length > 0 &&
                creditsData.map((item, i) => {
                  return (
                    <tr key={i}>
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

export default ManageCredits