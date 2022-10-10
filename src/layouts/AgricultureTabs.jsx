import './Tabs.css'

import { Flood24, Mountain24 } from '@carbon/icons-react'

import { Link } from '@reach/router'
import PageTitle from '../components/PageTitle'
import React from 'react'

function AgricultureTabs(props) {
  function isPartiallyActive({ isPartiallyCurrent }) {
    return isPartiallyCurrent ? { className: 'tabs-item active' } : {}
  }

  return (
    <div className="tabs">
      <div className="tabs-header">
        <PageTitle title="Agriculture" />
        <div className="tabs-content">
          <Link className="tabs-item" to="/agriculture/landslide" getProps={isPartiallyActive}>
            <Mountain24 /> Landslide
          </Link>
          <Link className="tabs-item" to="/agriculture/flood" getProps={isPartiallyActive}>
            <Flood24 /> Flood
          </Link>
        </div>
      </div>
      <div>{props.children}</div>
    </div>
  )
}

export default AgricultureTabs
