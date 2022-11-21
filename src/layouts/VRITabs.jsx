import './Tabs.css'

import { Link } from '@reach/router'
import React from 'react'

function VRITabs(props) {
  function isPartiallyActive({ isPartiallyCurrent }) {
    return isPartiallyCurrent ? { className: 'tabs-item active' } : {}
  }

  return (
    <div className="tabs">
      <div className="tabs-header">
        <div className="tabs-title">Vulnerability and Risk Information</div>
        <div className="tabs-system">Q-DRR MIS</div>
        <div className="tabs-content">
          <Link className="tabs-item" to="/vri/landslide" getProps={isPartiallyActive}>
            Landslide
          </Link>
          <Link className="tabs-item" to="/vri/flood" getProps={isPartiallyActive}>
            Flood
          </Link>
        </div>
      </div>
      <div>{props.children}</div>
    </div>
  )
}

export default VRITabs
