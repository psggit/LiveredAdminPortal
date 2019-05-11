import React, { useState, useEffect } from "react"
// import { getQueryObjByName, getQueryUri } from "Utils/url-utils"
import * as Api from "./../../api"
import PageHeader from "Components/pageheader"
import Icon from "Components/icon"
import Moment from "moment"
import Button from "Components/button"
import "./ottp-details.scss"
import DsoDetails from "./dso-details"

const OttpDetails = (props) => {
  const OttpId = props.match.params.OttpId
  const [ottpDetailsData, setOttpDetails] = useState({})
  const [loadingOttpDetails, setLoadingOttpDetails] = useState(true)

  const OttpDetailsReqParams = {
    ottp_info: {
      ottp_id: props.match.params.OttpId
    }
  }
  useEffect(() => {
    console.log("hello")
    setLoadingOttpDetails(true)
    fetchOttpDetails()
  }, [])

  const fetchOttpDetails = () => {
    Api.fetchOttpDetails(OttpDetailsReqParams)
      .then((response) => {
        console.log("response", response.ottp)
        setOttpDetails(response.ottp)
        setLoadingOttpDetails(false)
      })
      .catch((err) => {
        console.log("Error in fetching ottp details", err)
      })
  }
  console.log("ottp", ottpDetailsData)
  return (
    <React.Fragment>
      <PageHeader pageName="Ottp Management" text={OttpId} />
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
              <div className="header">
                <div>
                  <span><Icon name="active" /></span>
                  <span>{ottpDetailsData.ottp_info.status}</span>
                </div>
                <div>
                  <span>Issued on</span>
                  <span>{Moment(ottpDetailsData.ottp_info.issued_at).format("DD-MM-YYYY")}</span>
                  <span>at</span>
                  <span>{Moment(ottpDetailsData.ottp_info.issued_at).format("h:mm A")}</span>
                </div>
                <div>
                  <Button danger>Cancel OTTP</Button>
                </div>
              </div>
              <div>
                <DsoDetails data={ottpDetailsData.ottp_info.dso} />
                {/* <DsoDetails data={ottpDetailsData.ottp_info.dso} /> */}
              </div>
            </div>
          </React.Fragment>
        }

      </div>
    </React.Fragment>
  )
}

export default OttpDetails

