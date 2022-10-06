import './Sider.css'

import { Identification24, Power24 } from '@carbon/icons-react'
import { User24, UserAvatar24 } from '@carbon/icons-react'

import FadeAnimation from '../components/FadeAnimation'
import Panel from '../components/Panel'
import PanelLink from '../components/PanelLink'
import PanelSection from '../components/PanelSection'
import React from 'react'
import { navigate } from '@reach/router'

function Sider({ children }) {
  return (
    <FadeAnimation>
      <div className="sider">
        <Panel>
          <PanelSection>
            <PanelLink to="/your-account">
              <UserAvatar24 /> <p>Your Account</p>
            </PanelLink>
            <PanelLink to="/residents">
              <User24 /> <p>Residents</p>
            </PanelLink>
            <PanelLink to="/users">
              <Identification24 /> <p>Users</p>
            </PanelLink>
            <div className="panel-link" onClick={() => navigate('/', { replace: true })}>
              <Power24 /> <p>Sign Out</p>
            </div>
          </PanelSection>
        </Panel>
        <div>{children}</div>
      </div>
    </FadeAnimation>
  )
}

export default Sider
