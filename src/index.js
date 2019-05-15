
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
import DSOManagement from "Container/manage-dso"
import DsoDetails from "Container/dso-details"
import OttpDetails from "Container/ottp-details"
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
                      path="/home/ottp-details/:OttpId"
                      render={
                        props => (
                          <OttpDetails {...props} />
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
                      path="/home/dso-details"
                      render={
                        props => (
                          <DsoDetails {...props} />
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
