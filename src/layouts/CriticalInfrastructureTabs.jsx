import './Tabs.css'

import { Link } from '@reach/router'
import React from 'react'

function CriticalInfrastructureTabs(props) {
  function isPartiallyActive({ isPartiallyCurrent }) {
    return isPartiallyCurrent ? { className: 'tabs-item active' } : {}
  }

  return (
    <div className="tabs">
      <div className="tabs-header">
        <div className="tabs-title">Critical Infrastructure</div>
        <div className="tabs-system">Q-DRR MIS</div>
        <div className="tabs-content">
          <Link className="tabs-item" to="/critical-infrastructure/landslide" getProps={isPartiallyActive}>
            Landslide
          </Link>
          <Link className="tabs-item" to="/critical-infrastructure/flood" getProps={isPartiallyActive}>
            Flood
          </Link>
        </div>
      </div>
      <div>{props.children}</div>
    </div>
  )
}

export default CriticalInfrastructureTabs
