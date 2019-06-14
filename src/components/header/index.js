import React, { useState, useEffect } from "react"
import "./header.scss";
import Icon from "./../icon";
import Dialog from "./../dialog";
import Button from "./../button";
import { POST } from "Utils/fetch";

const Header = () => {
  const [showLogoutModal, updateShowLogoutModal] = useState(false)

  const mountLogoutModal = () => updateShowLogoutModal(true)

  const unMountLogoutModal = () => updateShowLogoutModal(false)

  const isLoggedIn = localStorage.getItem("hasura-id")

  const logout = () => {
    updateShowLogoutModal(false)
    localStorage.clear()
    document.cookie = "livered=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.href = "/login"
    // POST({
    //   api: "/retailer/auth/user/logout",
    //   apiBase: "api1",
    //   handleError: false,
    //   cors: true
    // })
    //   .then(response => {
    //     if (response.status !== 200) {
    //       console.log(
    //         `Looks like there was a problem. Status Code: ${response.status}`
    //       )
    //       localStorage.clear()
    //       location.href = "/login"
    //       return
    //     }
    //     response.json().then(data => {
    //       localStorage.clear()
    //       location.href = "/login"
    //     })
    //   })
    //   .catch(err => {
    //     console.log("Fetch Error :-S", err)
    //     localStorage.clear()
    //     location.href = "/login"
    //   })
  }

  return (
    <div id="pageHeader" className="page-header">
      <div className="logo">
        <Icon name="liveredLogo" />
        {
          isLoggedIn &&
          <p onClick={mountLogoutModal}>Logout</p>
        }
      </div>
      {
        showLogoutModal &&
        (
          <Dialog
            title="Do you want to logout?"
            onClick={unMountLogoutModal}
            actions={[
              <Button onClick={() => unMountLogoutModal()} secondary>
                No
              </Button>,
              <Button onClick={() => logout()} primary>
                Yes
              </Button>
            ]}
          />
        )
      }
    </div>
  )
}

export default Header