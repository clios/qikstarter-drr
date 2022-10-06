import './Tabs.css'

import { Information24 } from '@carbon/icons-react'
import { Link } from '@reach/router'
import PageTitle from '../components/PageTitle'
import React from 'react'

function YourAccountTabs(props) {
  function isPartiallyActive({ isPartiallyCurrent }) {
    return isPartiallyCurrent ? { className: 'tabs-item active' } : {}
  }

  return (
    <div className="tabs">
      <div className="tabs-header">
        <PageTitle title="Your Account" />
        <div className="tabs-content">
          <Link className="tabs-item" to="/your-account/information" getProps={isPartiallyActive}>
            <Information24 /> Information
          </Link>
        </div>
      </div>
      <div>{props.children}</div>
    </div>
  )
}

export default YourAccountTabs
