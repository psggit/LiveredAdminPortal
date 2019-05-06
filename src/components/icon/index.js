import React from 'react'
import Icons from './icons'
// import styled from 'styled-components'

function Icon({ name }) {
  return Icons[name]
}

// Icon.Element = styled.span`
//   display: inline-block;
//   position: relative;
//   width: ${props => props.width === undefined ? props.width : 20}px;
//   height: ${props => props.height === undefined ? props.height : 20}px;
//   svg {
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     width: ${props => props.width === undefined ? props.width : 20}px;
//     height: ${props => props.height === undefined ? props.height : 20}px;
//     fill: ${props => props.color};
//   }
// `

export default Icon
