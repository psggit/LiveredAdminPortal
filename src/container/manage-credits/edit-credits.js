import React, { useState, useEffect } from "react"
import * as Api from "../../api"
import Pagination from "Components/pagination"
import PageHeader from "Components/pageheader"
import Icon from "Components/icon"
import Button from "Components/button"
import Label from "Components/label"
import Moment from "moment"
import { getQueryObjByName, getQueryUri } from "Utils/url-utils"
import DataTable from "Components/table/custom-table"
import DsoNavbar from "../dso-details/dso-navbar"
import TitleBar from "Components/titlebar"

const creditTableHeaders = [
  { title: "Transaction ID", icon: "" },
  { title: "Date", icon: "" },
  { title: "Time", icon: "", tooltipText: "" },
  { title: "Mode of Payment", icon: "", tooltipText: "" },
  { title: "Total Amount", icon: "", tooltipText: "" }
]

const EditCredits = (props) => {
  const pageLimit = parseInt(getQueryObjByName("limit")) || 10
  const pageNo = parseInt(getQueryObjByName("activePage")) || 1
  const [activePage, setActivePage] = useState(pageNo)
  const [amount, setAmount] = useState(0)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loadingCredits, setLoadingCredits] = useState(true)
  const [enableEdit, setEnableEdit] = useState(true)
  const [file, setFile] = useState()
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
    setLimit(pagerObj.pageSize)

    queryParamsObj = {
      activePage: pagerObj.activePage,
      limit: pagerObj.pageSize
    }

    props.history.push(`/home/view-credits?${getQueryUri(queryParamsObj)}`)
  }

  const toggleEnableEdit = () => {
    setEnableEdit(false)
    props.history.push(`/home/view-credits?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
  }

  const handleTextFieldChange = (e) => {
    console.log("e.validity", e.target.validity)
    if (!e.target.validity.patternMismatch) {
      setAmount(e.target.value)
    }
  }

  const handleUploadChange = (e) => {
    const file = e.target.files[0]
    console.log("file", file)
    setFile(file)
    submitUploadedImage()
  }

  const submitUploadedImage = () => {
    const formData = new FormData()
    formData.append('file', file)
    setUploadingImage(true)
    // POST({
    //   api: '/upload',
    //   type: 'FormData',
    //   apiBase: 'api2',
    //   data: formData,
    //   handleError: true
    // })
    //   .then((json) => {
    //     this.uploadedImageUrl = `${Api.api2}/get?fs_url=${json[0]}`
    //     this.setState({ isImageUploaded: true, isImageUploading: false, image_url: json[0] })
    //   })
  }

  return (
    <React.Fragment>
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
        <div id="credits" style={{ width: '100%' }}>
          <DsoNavbar />
          <div className="content">
            <TitleBar
              title="Edit Credits"
              enableEdit={enableEdit}
              handleCancel={toggleEnableEdit}
            />
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
                          <td>{item.payment_mode}</td>
                          <td>{item.amount}</td>
                        </tr>
                      )
                    })
                  }
                </DataTable>
              </div>
            }
            <div className="item">
              <div className="icon">
                <span><Icon name="addIcon" /></span>
                <Label>Add credits</Label>
              </div>
            </div>
            <div className="item">
              <Label>Amount</Label>
              <input
                type="text"
                name="amount"
                pattern="[0-9]*"
                value={amount}
                onChange={(e) => handleTextFieldChange(e)}
              />
            </div>
            <div className="item">
              <Label>Upload supporting document</Label>
              {
                <div class="input-group">
                  <input type="text" className="form-control" value={file ? file.name : ""} readonly />
                  <div className="input-group-btn">
                    <span className="fileUpload">
                      <Button primary>UPLOAD</Button>
                      <input type="file" className="upload up" id="up" onChange={handleUploadChange} />
                    </span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </React.Fragment >
  )
}

export default EditCredits