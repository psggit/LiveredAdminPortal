import React from 'react'
import Icon from './../icon'

const textStyle = {
  fontSize: '23px',
  color: '#00b4a0',
  cursor: 'pointer'
}

const headerStyle = {
  color: '#2d3f49',
  fontSize: '23px',
  cursor: 'pointer'
}

const handleClick = (pathname) => {
  console.log("pathname", pathname)
  location.href = pathname
}

const PageHeader = ({ pageName, text, pathname }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    //marginBottom: '60px',
    background: '#fff',
    padding: '18px 36px',
  }}
  >
    <span style={text ? textStyle : headerStyle} onClick={() => handleClick(pathname)}>{pageName}</span>
    {
      text &&
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ margin: '0px 20px' }}><Icon name="rightArrowBlack" /></span>
        <span>{text}</span>
      </div>
    }
  </div>
)

export default PageHeader