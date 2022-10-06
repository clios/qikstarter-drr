import './TableToolbar.css'

import CustomSkeleton from './CustomSkeleton'
import React from 'react'

function TableToolbar(props) {
  if (props.status === 'loading') return <CustomSkeleton w="100%" h="2rem" />
  return <div className="table-toolbar bg-gray">{props.children}</div>
}

export default TableToolbar
