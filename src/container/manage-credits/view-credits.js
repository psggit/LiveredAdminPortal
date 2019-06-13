import React, { useState, useEffect } from "react"
import * as Api from "../../api"
import Pagination from "Components/pagination"
import PageHeader from "Components/pageheader"
import Icon from "Components/icon"
import Moment from "moment"
import { getQueryObjByName, getQueryUri } from "Utils/url-utils"
import DataTable from "Components/table/custom-table"
import DsoNavbar from "../dso-details/dso-navbar"
import TitleBarAndSave from "Components/titlebarAndSave"

const creditTableHeaders = [
  { title: "Transaction ID", icon: "" },
  { title: "Date", icon: "" },
  { title: "Time", icon: "", tooltipText: "" },
  { title: "Total Amount", icon: "", tooltipText: "" }
]

const ViewCredits = (props) => {
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
    dso_id: getQueryObjByName("id"),
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
        setCreditsData(response.credit_log)
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
    setLimit(parseInt(pagerObj.pageSize))

    queryParamsObj = {
      activePage: pagerObj.activePage,
      limit: pagerObj.pageSize,
      id: getQueryObjByName("id"),
      name: getQueryObjByName("name")
    }

    props.history.push(`/home/dso/view-credits?${getQueryUri(queryParamsObj)}`)
  }

  const handleEdit = () => {
    props.history.push(`/home/dso/edit-credits?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
  }

  return (
    <React.Fragment >
      <PageHeader pageName="Delivery Service Operators" text={dsoName} />
      <div style={{
        display: "flex",
        marginTop: "30px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: '0px 60px',
        width: '100%'
      }}
      >
        <div id="credits" style={{ width: '100%', position: 'relative' }}>
          <DsoNavbar />
          <div className="content">
            <TitleBarAndSave
              title="Credits"
              enableEdit={false}
              handleClick={handleEdit}
            />
            {(
              <div style={{ marginTop: '50px' }}>
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
                  message={"No credit history found. Click edit to add new credits"}
                >
                  {
                    creditsData.length > 0 &&
                    creditsData.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td>{item.transaction_id}</td>
                          <td>{Moment(item.created_at).format("DD-MM-YYYY")}</td>
                          <td>{Moment(item.created_at).format("h:mm A")}</td>
                          <td>{item.amount}</td>
                        </tr>
                      )
                    })
                  }
                </DataTable>
              </div>
            }
          </div>
        </div>
      </div>
    </React.Fragment >
  )
}

export default ViewCredits