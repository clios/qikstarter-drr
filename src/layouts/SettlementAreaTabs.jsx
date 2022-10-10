import './Tabs.css'

import { Flood24, Mountain24 } from '@carbon/icons-react'

import { Link } from '@reach/router'
import PageTitle from '../components/PageTitle'
import React from 'react'

function SettlementAreaTabs(props) {
  function isPartiallyActive({ isPartiallyCurrent }) {
    return isPartiallyCurrent ? { className: 'tabs-item active' } : {}
  }

  return (
    <div className="tabs">
      <div className="tabs-header">
        <PageTitle title="Settlement Area" />
        <div className="tabs-content">
          <Link className="tabs-item" to="/settlement-area/landslide" getProps={isPartiallyActive}>
            <Mountain24 /> Landslide
          </Link>
          <Link className="tabs-item" to="/settlement-area/flood" getProps={isPartiallyActive}>
            <Flood24 /> Flood
          </Link>
        </div>
      </div>
      <div>{props.children}</div>
    </div>
  )
}

export default SettlementAreaTabs