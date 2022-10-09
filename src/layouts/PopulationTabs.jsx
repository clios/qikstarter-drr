import './Tabs.css'

import { Dashboard24 } from '@carbon/icons-react'
import { Link } from '@reach/router'
import PageTitle from '../components/PageTitle'
import React from 'react'

function PopulationTabs(props) {
  function isPartiallyActive({ isPartiallyCurrent }) {
    return isPartiallyCurrent ? { className: 'tabs-item active' } : {}
  }

  return (
    <div className="tabs">
      <div className="tabs-header">
        <PageTitle title="Population" />
        <div className="tabs-content">
          <Link className="tabs-item" to="/population/dashboard" getProps={isPartiallyActive}>
            <Dashboard24 /> Dashboard
          </Link>
        </div>
      </div>
      <div>{props.children}</div>
    </div>
  )
}

export default PopulationTabs
