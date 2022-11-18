import './SectionBody.css'

import CustomSkeleton from './CustomSkeleton'
import React from 'react'

function SectionBody(props) {
  if (props.status === 'loading')
    return (
      <div className="section-body-loader bg-dark">
        <CustomSkeleton w="100%" h="5rem" />
      </div>
    )
  return (
    <React.Fragment>
      {props.title && <div className="section-body-title">{props.title}</div>}
      <div className="section-body">
        {props.text}
        {props.children}
      </div>
    </React.Fragment>
  )
}

export default SectionBody
