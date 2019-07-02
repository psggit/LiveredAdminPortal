import React, { useState, useEffect } from "react"
// import { getQueryObjByName, getQueryUri } from "Utils/url-utils"
import * as Api from "./../../api"
import PageHeader from "Components/pageheader"
import Icon from "Components/icon"
import Moment from "moment"
import Button from "Components/button"
import "./ottp-details.scss"
import DsoDetails from "./dso-details"
import DeliveryAgentDetails from "./delivery-agent-details"
import OrderDetails from "./order-details"
import ConsumerDetails from "./customer-details"
import Dialog from "Components/dialog"
import Select from "Components/select"
//import { getQueryObjByName } from "Utils/url-utils"

const OttpDetails = (props) => {
  const OttpId = props.match.params.OttpId
  const [ottpDetailsData, setOttpDetails] = useState({})
  const [loadingOttpDetails, setLoadingOttpDetails] = useState(true)
  const [showCancelOtpModal, setShowCancelOtpModal] = useState(false)
  const [cancellingOttp, setCancellingOttp] = useState(false)
  const [cancelOttpReasonIdx, setCancelOttpReason] = useState(-1)
  //const [showSuccessCancelOtpModal, setSuccessCancelOtpModal] = useState(false)

  const OttpDetailsReqParams = {
    ottp_info: {
      ottp_id: props.match.params.OttpId
    }
  }

  const cancelOttpOptions = [
    { text: "Invalid user", value: 1 },
    { text: "Technical issues", value: 2 },
    { text: "Other", value: 3 }
  ]

  useEffect(() => {
    setLoadingOttpDetails(true)
    fetchOttpDetails()
  }, [])

  const fetchOttpDetails = () => {
    Api.fetchOttpDetails(OttpDetailsReqParams)
      .then((response) => {
        setOttpDetails(response.ottp)
        setLoadingOttpDetails(false)
      })
      .catch((err) => {
        console.log("Error in fetching ottp details", err)
      })
  }

  const handleChange = (e) => {
    setCancelOttpReason(e.target.value)
  }

  const cancelOttp = () => {
    if (cancelOttpReasonIdx !== -1) {
      setCancellingOttp(true)
      Api.cancelOttp({
        ottp_info: {
          ottp_id: OttpId,
          status: "cancelled"
        },
        changed_by: "admin",
        reason: cancelOttpOptions.find((item) => item.value === parseInt(cancelOttpReasonIdx)).text
      })
        .then((response) => {
          setShowCancelOtpModal(false)
          setCancellingOttp(false)
          window.location = location.href
        })
        .catch((err) => {
          setCancellingOttp(false)
          console.log("Error in cancelling ottp", err)
        })
    }
  }

  const mountModal = () => {
    //const showModalFn = eval(`setShow${modalName}Modal`)
    setShowCancelOtpModal(true)
  }

  const unmountModal = () => {
    //const showModalFn = eval(`setShow${modalName}Modal`)
    setShowCancelOtpModal(false)
  }

  return (
    <React.Fragment>
      <PageHeader
        pageName="Ottp Management"
        text={OttpId}
        pathname="/home/ottp-management"
      />
      <div style={{
        display: "flex",
        marginTop: "30px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: '0px 60px'
      }}
      >
        {
          !loadingOttpDetails &&
          <React.Fragment>
            <div id="ottpDetails">
              <div className="main-header">
                <div>
                  {
                    ottpDetailsData.ottp_info.status === "ongoing"
                      ? <span><Icon name="active" /></span>
                      : <span><Icon name="expired" /></span>
                  }
                  <span>{ottpDetailsData.ottp_info.status === "ongoing" ? "ONGOING" : "EXPIRED"}</span>
                </div>
                <div>
                  <span>Issued on</span>
                  <span>{Moment(ottpDetailsData.ottp_info.issued_at).format("DD-MM-YYYY")}</span>
                  <span>at</span>
                  <span>{Moment(ottpDetailsData.ottp_info.issued_at).format("h:mm A")}</span>
                  {
                    ottpDetailsData.ottp_info.status === "closed" &&
                    <React.Fragment>
                      <span>|</span>
                      <span>Expired on</span>
                      <span>{Moment(ottpDetailsData.ottp_info.expiry_at).format("DD-MM-YYYY")}</span>
                      <span>at</span>
                      <span>{Moment(ottpDetailsData.ottp_info.expiry_at).format("h:mm A")}</span>
                    </React.Fragment>
                  }
                </div>
                {
                  ottpDetailsData.ottp_info.status === "ongoing"
                    ? <div>
                      <Button danger onClick={mountModal}>Cancel OTTP</Button>
                    </div>
                    : <div></div>
                }
              </div>
              <div className="card-container">
                <DsoDetails
                  dsoName={ottpDetailsData.dso.name}
                  retailerName={ottpDetailsData.retailer.name}
                  retailerAddress={ottpDetailsData.retailer.address}
                />
                <DeliveryAgentDetails
                  name={ottpDetailsData.delivery_agent.name}
                  phoneNumber={ottpDetailsData.delivery_agent.phone_number}
                  verificationDoc={ottpDetailsData.delivery_agent.verification_doc}
                  vehicleNumber={ottpDetailsData.delivery_agent.vehicle_number}
                  licenseNumber={ottpDetailsData.delivery_agent.license_number}
                />
                <OrderDetails
                  ottpId={ottpDetailsData.ottp_info.ottp_id}
                  orderStatus={ottpDetailsData.ottp_info.status}
                  orders={ottpDetailsData.order}
                />
                <ConsumerDetails
                  ottpId={ottpDetailsData.ottp_info.ottp_id}
                  orderStatus={ottpDetailsData.ottp_info.status}
                  name={ottpDetailsData.consumer.name}
                  dob={ottpDetailsData.consumer.dob}
                  address={ottpDetailsData.consumer.address}
                  otpStatus={ottpDetailsData.consumer.is_verified}
                />
              </div>
            </div>
          </React.Fragment>
        }
        {
          showCancelOtpModal &&
          <Dialog
            title="Are you sure you want to cancel the OTTP?"
            onClick={() => unmountModal()}
            actions={[
              <Button disabled={cancellingOttp} onClick={() => unmountModal()} secondary>
                No
              </Button>,
              <Button disabled={cancellingOttp} onClick={cancelOttp} primary>
                Yes
              </Button>
            ]}
          >
            <div style={{ margin: '20px 0' }}>
              <Select
                options={cancelOttpOptions}
                name="cancelOttpReasonIdx"
                large
                placeholder="reason"
                onChange={e => handleChange(e)}
                value={cancelOttpReasonIdx}
              />
            </div>
          </Dialog>
        }
        {/* {
        showSuccessCancelOtpModal &&
        <Dialog
          title="OTP has been resent successfully"
          onClick={() => unmountModal("SuccessOtp")}
          actions={[
            <Button onClick={() => unmountModal("SuccessOtp")} primary>
              Done
            </Button>
          ]}
        />
      } */}
      </div>
    </React.Fragment>
  )
}

export default OttpDetails

