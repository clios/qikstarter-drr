import './FormRow.css'

import CustomSkeleton from './CustomSkeleton'
import React from 'react'

function FormRow(props) {
  if (props.status === 'loading')
    return (
      <div className="form-row-loading bg-dark">
        <CustomSkeleton w="100%" h="5rem" />
      </div>
    )

  return (
    <React.Fragment>
      {props.title && <div className="form-row-title">{props.title}</div>}
      <div className="form-row">{props.children}</div>
    </React.Fragment>
  )
}

export default FormRow
