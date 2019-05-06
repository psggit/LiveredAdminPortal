import React from 'react'

const mainDivStyleWithSideMenu = {
  display: 'inline-block', 
  width: 'calc(100% - 250px)', 
  verticalAlign: 'top', 
  padding: '60px', 
  backgroundColor: '#f8f8f8', 
  height: 'calc(100vh - 76px)', 
  overflow: 'auto',
  marginLeft: '250px' 
}

const mainDivStyleWithoutSideMenu = {
  display: 'inline-block', 
  width: '100%', 
  verticalAlign: 'top', 
  padding: '60px', 
  backgroundColor: '#f8f8f8', 
  height: 'calc(100vh - 76px)', 
  overflow: 'auto',
  //marginLeft: '250px' 
}


const Layout = ({ isLoggedIn, children }) => {
  const style = isLoggedIn ? mainDivStyleWithSideMenu : mainDivStyleWithoutSideMenu

  return (
    <div
      style={style}
    >
      { children }
    </div>
  )
}

export default Layout
