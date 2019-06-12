import React, { useState } from "react"
import Button from "Components/button"
import Dialog from "Components/dialog"
import { POST } from "Utils/fetch"
import { createSession } from "./session"
import Header from "Components/header"
import Label from "Components/label"
import './login.scss'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isSubmitting, setLoggingInStatus] = useState(false)
  const [showLoginErr, setShowLoginErr] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [showSuccessMessageModal, setShowSuccessMessageModal] = useState(false)
  const [emailErr, setEmailErr] = useState({ value: "", status: false })
  const [passwordErr, setPasswordErr] = useState({ value: "", status: false })

  const handleKeyPress = (e) => {
    e.preventDefault()
    if (e.keyCode === 13) {
      handleLogin()
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    console.log("email", email, password)
    if (password.length && email.length) {
      setLoggingInStatus(true)
      POST({
        api: "/retailer/auth/login",
        apiBase: "api1",
        handleError: false,
        data: { email, password }
      })
        .then((json) => {
          if (json.data) {
            Notify(JSON.parse(json.data).message, "warning")
          } else {
            createSession(json)
            window.location.href = "/home/overview"
          }
        })
        .catch((error) => {
          setShowLoginErr(true)
        })
    }
  }

  const handlePasswordChange = (evt) => {
    const value = (evt.target.validity.valid || evt.target.validity.valueMissing) ? evt.target.value : eval((evt.target.name));
    setPassword(evt.target.value)
  }

  const handleEmailChange = (evt) => {
    //this.setState({ [evt.target.name]:  evt.target.value});
    setEmail(evt.target.value)
  }

  const handleClick = () => {
    location.href = "/home/support"
  }

  const resetPassword = () => {
    console.log("email", this.state.forgotPasswordEmail)
    setShowForgotPasswordModal(false)
    setShowSuccessMessageModal(true)
    //this.setState({showForgotPasswordModal: false, showSuccessMessageModal: true})
  }

  const mountModal = () => {
    setShowForgotPasswordModal(true)
  }

  const unMountModal = (modalName) => {
    switch (modalName) {
      case 'showForgotPasswordModal':
        setShowForgotPasswordModal(false)
        break;
      case 'showSuccessMessageModal':
        setShowSuccessMessageModal(false)
        break;
      default:
        break;
    }
  }

  const handleTextChange = (e) => {
    setNewPassword(e.target.value)
  }

  return (
    <React.Fragment>
      <Header isLoggedIn={false} />
      <div id="login">
        <div className="container">
          <h3 className="title">
            Login
          </h3>
          <div className="body">
            <React.Fragment>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <Label>Email Id</Label>
                  <input
                    type="text"
                    name="email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    onInput={handleEmailChange}
                    value={email}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label>Password</Label>
                  <input
                    type="password"
                    name="password"
                    pattern="^[a-zA-Z0-9!#@]*$"
                    onInput={handlePasswordChange}
                    value={password}
                    required
                  />
                </div>
                <div className="form-group" style={{ textAlign: "center" }}>
                  <Button
                    // onClick={handleLogin}
                    primary
                  >
                    Login
                  </Button>
                </div>
                <p onClick={mountModal}>Forgot your password?</p>
              </form>
            </React.Fragment>
          </div>
          {showLoginErr && (
            <p className="login-error">
              Wrong username or password
            </p>
          )}
        </div>
        {/* <p style={{
          textAlign: "center",
          marginTop: "24px",
          cursor: "pointer",
        }}
          onClick={handleClick}
        >
          Having trouble? Contact Support
        </p> */}
      </div>
      {showForgotPasswordModal && (
        <Dialog
          title="Forgot your password?"
          subtitle="Enter your email address to reset your password"
          onClick={() => unMountModal('showForgotPasswordModal')}
          actions={[
            <Button onClick={() => resetPassword()} primary>
              Submit
            </Button>,
            <Button onClick={() => unMountModal('showForgotPasswordModal')} secondary>
              Cancel
            </Button>
          ]}
        >
          <input type="text" className="large" onChange={handleTextChange} />
        </Dialog>
      )}
      {showSuccessMessageModal && (
        <Dialog
          title="Please check your email to reset your password"
          icon="success"
          onClick={() => unMountModal('showSuccessMessageModal')}
          actions={[
            <Button onClick={() => unMountModal('showSuccessMessageModal')} primary>
              Done
            </Button>, ``
          ]}
        />
      )}
    </React.Fragment>
  )
}

export default Login
