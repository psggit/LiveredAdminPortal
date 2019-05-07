import React from 'react'
import './loader.scss'

const Loader = ({ absolute }) => (
  <div style={absolute ? { position: 'absolute' } : {}} className="browser-screen-loading-content">
    <div className="loading-dots dark-gray">
      <i />
      <i />
      <i />
      <i />
    </div>
  </div>
)

export default Loader
