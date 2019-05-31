import React, { Component } from 'react'
import { unmountComponentAtNode } from "react-dom"
import Icon from './../icon'

class Notification extends Component {

    constructor(props) {

      super(props)

      let { message, type } = this.props

      this.state = {
        message,
        type,
        style: this.initialStyle()
      }

      this.mountNotify = this.mountNotify.bind(this)
      this.unmountNotify = this.unmountNotify.bind(this)

    }

    initialStyle() {
      return {
        opacity: 0,
        transition: 'all 0.4s ease',
      }
    }

    unmountNotify() {

      this.setState({
        style: this.initialStyle()
      })

      setTimeout(() => {
        unmountComponentAtNode(document.querySelector('.notification-container'))
      }, 1000)

    }

    mountNotify() {

      this.setState({

        style: {
          opacity: 1,
          transition: 'all 0.4s ease',
        }

      })

    }


    componentDidMount() {

      setTimeout(this.mountNotify, 500)

      setTimeout(() => {
        this.unmountNotify()
      }, 3500)

    }

    render() {

      const { message, type, style } = this.state

      return (

        <div
            className={`notification ${type}`}
            style={style}
        >
          <div className="notification-message">
            <span className="__type-icon">
                {/* {
                    getIcon(type)
                } */}
                <Icon name={type} />
            </span>
            <span>{message}</span>
          </div>

          <span className="__close-icon" onClick={this.unmountNotify}>
            {
                (type === "warning" ?  <Icon name="close-grey" /> :  <Icon name="close-white" />)
            }
          </span>
        </div>

      )
    }
}

export default Notification