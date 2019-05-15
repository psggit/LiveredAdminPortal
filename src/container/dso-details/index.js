import React, { useState, useEffect } from "react"
// import { getQueryObjByName, getQueryUri } from "Utils/url-utils"
import * as Api from "./../../api"
import PageHeader from "Components/pageheader"
import Icon from "Components/icon"
import Moment from "moment"
import Button from "Components/button"
import "./dso-details.scss"
// import DeliveryAgentDetails from "./delivery-agent-details"
// import OrderDetails from "./order-details"
// import ConsumerDetails from "./customer-details"
import { getQueryObjByName } from "Utils/url-utils"

const DsoDetails = (props) => {
  const dsoName = getQueryObjByName("name")
  const dsoId = getQueryObjByName("id")
  const [dsoDetailsData, setDsoDetails] = useState({})
  const [loadingDsoDetails, setLoadingDsoDetails] = useState(true)

  const dsoDetailsReqParams = {
    dso_id: dsoId
  }

  useEffect(() => {
    setLoadingDsoDetails(true)
    fetchDsoDetails()
  }, [])

  const fetchDsoDetails = () => {
    Api.fetchDsoDetails(dsoDetailsReqParams)
      .then((response) => {
        console.log("response", response.ottp)
        setDsoDetails(response.ottp)
        setLoadingDsoDetails(false)
      })
      .catch((err) => {
        console.log("Error in fetching dso details", err)
      })
  }

  return (
    <React.Fragment>
      <PageHeader pageName="Delivery Service Operators" text={dsoName} />
      <div style={{
        display: "flex",
        marginTop: "30px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: '0px 60px'
      }}
      >
        {
          !loadingDsoDetails &&
          <React.Fragment>
            <div id="dsoDetails">
              <div className="main-header">
                <a href={"/home/dso/details"} className="active">Details</a>
                <a>Credits</a>
                <a>Users</a>
                <a>Contact</a>
              </div>
              <div>
                <div className="title-section">
                  <span>Basic Details</span>
                  <Button custom icon="editIcon">
                    <span>Edit</span>
                  </Button>
                </div>
              </div>
            </div>
          </React.Fragment>
        }
      </div>
    </React.Fragment>
  )
}

export default DsoDetails
