import React from 'react'
import Icon from './../icon'

const PageHeader = ({ pageName }) => (
  <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      //marginBottom: '60px',
      background: '#fff',
      padding: '18px 36px',
      color: '#2d3f49'
    }}
  >
    {/* <Icon name="box" /> */}
    <span style={{ fontSize: '23px' }}>{ pageName }</span>
  </div>
)

export default PageHeader