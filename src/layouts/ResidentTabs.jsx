import './Tabs.css'

import { Map24, Meter24, TableOfContents24 } from '@carbon/icons-react'

import { Link } from '@reach/router'
import PageTitle from '../components/PageTitle'
import React from 'react'

function ResidentTabs(props) {
  function isPartiallyActive({ isPartiallyCurrent }) {
    return isPartiallyCurrent ? { className: 'tabs-item active' } : {}
  }

  return (
    <div className="tabs">
      <div className="tabs-header">
        <div className="tabs-title">Residents</div>
        <div className="tabs-system">Q-DRR MIS</div>
        <div className="tabs-content">
          <Link className="tabs-item" to="/residents/dashboard" getProps={isPartiallyActive}>
            Dashboard
          </Link>
          <Link className="tabs-item" to="/residents/records" getProps={isPartiallyActive}>
            Records
          </Link>
          <Link className="tabs-item" to="/residents/map" getProps={isPartiallyActive}>
            <Map24 /> Map
          </Link>
        </div>
      </div>
      <div>{props.children}</div>
    </div>
  )
}

export default ResidentTabs
