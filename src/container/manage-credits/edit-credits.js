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
import TitleBarAndSave from "Components/titlebarAndSave"
import { POST, GET } from 'Utils/fetch'
import Dialog from "Components/dialog"
import { dso as DSO } from "./../../api"
const creditTableHeaders = [
  { title: "Transaction ID", icon: "" },
  { title: "Date", icon: "" },
  { title: "Time", icon: "", tooltipText: "" },
  { title: "Total Amount", icon: "", tooltipText: "" }
]

let uploadedImageUrl = ""

const EditCredits = (props) => {
  const pageLimit = parseInt(getQueryObjByName("limit")) || 10
  const pageNo = parseInt(getQueryObjByName("activePage")) || 1
  const [activePage, setActivePage] = useState(pageNo)
  const [amount, setAmount] = useState()
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loadingCredits, setLoadingCredits] = useState(true)
  const [enableEdit, setEnableEdit] = useState(true)
  const [addingCredits, setAddingCredits] = useState(false)
  const [file, setFile] = useState({})
  const [creditsData, setCreditsData] = useState([])
  const [creditsDataCount, setCreditsDataCount] = useState(0)
  const [limit, setLimit] = useState(pageLimit)
  const [dsoId, setDsoId] = useState(getQueryObjByName("id"))
  const [mountModal, setMountModal] = useState(false)
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

  const addDsoCredits = () => {
    setAddingCredits(true)
    Api.addDsoCredits({
      dso_id: dsoId,
      amount: parseFloat(amount),
      supporting_document: uploadedImageUrl
    })
      .then((response) => {
        setAddingCredits(false)
        props.history.push(`/home/dso/view-credits?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
      })
      .catch((err) => {
        setAddingCredits(false)
        setMountModal(true)
        //Notify(err.message, "warning")
        console.log("Error in adding credits", err)
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

    props.history.push(`/home/dso/view-credits?${getQueryUri(queryParamsObj)}`)
  }

  const toggleEnableEdit = () => {
    setEnableEdit(false)
    props.history.push(`/home/dso/view-credits?id=${getQueryObjByName("id")}&name=${getQueryObjByName("name")}`)
  }

  const handleTextFieldChange = (e) => {
    //document.getElementById([e.target.name]).className = "pristine"
    if (!e.target.validity.patternMismatch) {
      setAmount(e.target.value)
    }
  }

  const handleUploadChange = (e) => {
    const file = e.target.files[0]
    setFile(file)
    submitUploadedImage(file)
  }

  const handleSubmit = e => {
    e.preventDefault()
    addDsoCredits()
  }

  const submitUploadedImage = (file) => {
    const formData = new FormData()
    formData.append('file', file)
    setUploadingImage(true)
    POST({
      api: `${DSO}/livered/dso/uploadFile`,
      type: 'FormData',
      data: formData,
      prependBaseUrl: false,
      handleError: true
    })
      .then((json) => {
        setUploadingImage(false)
        uploadedImageUrl = json.url
      })
  }

  const unMountModal = () => {
    setMountModal(false)
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
        <div id="credits" style={{ width: '100%', position: 'relative' }}>
          <DsoNavbar />
          <div className="content">
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
            <form onSubmit={handleSubmit}>
              <TitleBarAndSave
                title="Edit Credits"
                enableEdit={enableEdit}
                handleCancel={toggleEnableEdit}
                //handleClick={addDsoCredits}
                disableBtn={addingCredits || uploadingImage}
              />
              <div className="item">
                <div className="icon">
                  <span><Icon name="addIcon" /></span>
                  <Label>Add credits</Label>
                </div>
              </div>
              <div className="item">
                <Label>Amount</Label>
                <input
                  id="amount"
                  required
                  type="text"
                  name="amount"
                  pattern="[0-9.]*"
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
                        <Button primary disabled={uploadingImage}>UPLOAD</Button>
                        <input type="file" className="upload up" id="up" onChange={handleUploadChange} />
                      </span>
                    </div>
                  </div>
                }
              </div>
            </form>
          </div>
        </div>
      </div>
      {
        mountModal &&
        <Dialog
          title="Error in adding credits"
          onClick={unMountModal}
          actions={[
            <Button onClick={() => unMountModal()} primary>
              Done
            </Button>
          ]}
        />
      }
    </React.Fragment >
  )
}

export default EditCredits