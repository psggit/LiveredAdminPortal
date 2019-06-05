
import React from 'react'
import 'babel-polyfill'
import ReactDOM from "react-dom"
import { createBrowserHistory as createHistory } from 'history'
import { Route, Switch } from 'react-router-dom'
import { Router } from 'react-router'
import Header from 'Components/header'
import SideMenu from 'Components/sidemenu'
import { menuItems } from './constants/nav-items'
import 'Sass/app.scss'
import { Api } from 'Utils/config'
import Login from './login'
import Layout from 'Components/layout'
import OTTPManagement from 'Container/manage-ottp'
import ViewCreditDetails from "Container/manage-credits/view-credits"
import EditCreditDetails from "Container/manage-credits/edit-credits"
import ExciseManagement from "Container/manage-excise"
import CreateExcise from "Container/excise-details/create-excise-details"
import ViewExciseDetails from "Container/excise-details/view-excise-details"
import EditExciseDetails from "Container/excise-details/edit-excise-details"
import ViewExciseOperations from "Container/manage-operations"
import DSOManagement from "Container/manage-dso"
import CreateDso from "Container/dso-details/create-dso-details"
import ViewDsoDetails from "Container/dso-details/view-dso-details"
import EditDsoDetails from "Container/dso-details/edit-dso-details"
import CreateLocationDetails from "Container/manage-locations/create-location"
import ViewLocationDetails from "Container/manage-locations/view-location"
import EditLocationDetails from "Container/manage-locations/edit-location"
import OttpDetails from "Container/ottp-details"
import ViewRules from "Container/rule-engine/view-rules"
import EditRules from "Container/rule-engine/edit-rules"
import Reports from "Container/manage-reports"
import { createSession } from './login/session'

const history = createHistory()

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      currentRoute: location.pathname.split('/')[2] || '',
      key: 0,
      isLoggedIn: true
    }
    this.checkUserLoggedIn = this.checkUserLoggedIn.bind(this)
  }

  componentDidMount() {
    //this.checkUserLoggedIn()
    history.listen((loction) => {
      const newRoute = location.pathname.split('/')[2]
      const { key } = this.state
      console.log("key", key)
      this.setState({ key: key + 1, currentRoute: newRoute })
    })
  }

  checkUserLoggedIn() {
    const fetchOptions = {
      method: 'get',
      credentials: 'include',
      mode: 'cors',
      'x-hasura-role': 'user'
    }

    fetch(`${Api.authUrl}/user/account/info`, fetchOptions)
      .then((response) => {
        console.log("location", location.pathname)
        if (response.status !== 200) {
          console.log(`Looks like there was a problem. Status Code: ${response.status}`)
          if (location.pathname !== '/login') {
            location.href = '/login'
          }
          return
        }
        response.json().then((data) => {
          this.setState({ isLoggedIn: true })
          if (!location.pathname.includes('home') && !location.pathname.includes('support')) {
            location.href = '/home/'
          }
        })
      })
      .catch((err) => {
        console.log('Fetch Error :-S', err)
        if (location.pathname !== '/login') {
          location.href = '/login'
        }
      })
  }

  render() {
    console.log("location.path", location.pathname)
    const { isLoggedIn } = this.state
    return (
      <Router history={history}>
        <div>
          <Route path="/login" component={Login} />
          {
            location.pathname.includes("home") &&
            <div
              style={{
                backgroundColor: '#fbfbfb',
                width: '100%',
                //maxWidth: '1980px',
                margin: '0 auto',
                height: '100vh',
                overflow: 'auto'
              }}
            >
              <Header isLoggedIn={isLoggedIn} />
              <div>
                {
                  this.state.isLoggedIn &&
                  <SideMenu
                    history={history}
                    menuItems={menuItems}
                    currentRoute={this.state.currentRoute}
                  />
                }
                <Layout isLoggedIn={isLoggedIn}>
                  <Switch>
                    <Route
                      exact
                      path="/home/ottp-management"
                      render={
                        props => (
                          <OTTPManagement {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/excise/view-operations"
                      render={
                        props => (
                          <ViewExciseOperations {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/ottp-details/:OttpId"
                      render={
                        props => (
                          <OttpDetails {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/excise-management"
                      render={
                        props => (
                          <ExciseManagement {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/excise/view-details"
                      render={
                        props => (
                          <ViewExciseDetails {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/excise/edit-details"
                      render={
                        props => (
                          <EditExciseDetails {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/excise/create-details"
                      render={
                        props => (
                          <CreateExcise {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/dso-management"
                      render={
                        props => (
                          <DSOManagement {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/dso/view-credits"
                      render={
                        props => (
                          <ViewCreditDetails {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/dso/edit-credits"
                      render={
                        props => (
                          <EditCreditDetails {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/rules"
                      render={
                        props => (
                          <ViewRules {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/rules/edit"
                      render={
                        props => (
                          <EditRules {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/dso/view-details"
                      render={
                        props => (
                          <ViewDsoDetails {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/dso/edit-details"
                      render={
                        props => (
                          <EditDsoDetails {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/dso/create-details"
                      render={
                        props => (
                          <CreateDso {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/dso/view-locations"
                      render={
                        props => (
                          <ViewLocationDetails {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/dso/edit-locations"
                      render={
                        props => (
                          <EditLocationDetails {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/dso/create-locations"
                      render={
                        props => (
                          <CreateLocationDetails {...props} />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/home/reports"
                      render={
                        props => (
                          <Reports {...props} />
                        )
                      }
                    />
                  </Switch>
                </Layout>
              </div>
            </div>
          }
        </div>
      </Router>
    )
  }
}
ReactDOM.render(<App />, document.getElementById('root'))

export default App
