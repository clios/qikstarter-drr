import './Sider.css'

import { CropGrowth24, Hotel24, Identification24, Industry24, TrafficIncident24 } from '@carbon/icons-react'
import { Dashboard24, HealthCross24, PedestrianFamily24, Power24, TrafficFlow24, UserAvatar24 } from '@carbon/icons-react'

import AccountContext from '../contexts/AccountContext'
import FadeAnimation from '../components/FadeAnimation'
import Panel from '../components/Panel'
import PanelLink from '../components/PanelLink'
import PanelSection from '../components/PanelSection'
import React from 'react'
import axios from 'axios'
import getAccount from '../api/getAccount'
import { navigate } from '@reach/router'

function Sider({ children }) {
  // SEND GET ACCOUNT REQUEST
  const has_token = localStorage.getItem('q-drr-web-token') ? true : false
  const Account = getAccount(has_token, { refreshInterval: 300000 })

  // INFORMATION STATE
  const [status, setStatus] = React.useState('loading')

  // ON FETCH ACCOUNT
  React.useEffect(() => {
    if (has_token && Account.loading) setStatus('loading')
    if (Account.error) setStatus('error')
    if (Account.data) setStatus('success')
  }, [Account.loading, Account.error, Account.data])

  // SEND SIGN OUT REQUEST
  function signOut() {
    const URL = process.env.BASE_URL + '/logout'
    const CONFIG = { headers: { Authorization: `Bearer ${localStorage.getItem('q-drr-web-token')}` } }

    axios
      .post(URL, null, CONFIG)
      .then((response) => {
        if (response.status === 204) {
          localStorage.removeItem('q-drr-web-token')
          navigate('/', { replace: true })
        } else if (response.status === 403) toast.error('User credential is forbidden')
        else if (response.status === 500) toast.error('Unexpected server error occurs')
      })
      .catch((error) => console.log(error))
  }

  // IF NO TOKEN, SIGN OUT
  if (!has_token) {
    navigate('/', { replace: true })
    location.reload()
  }

  // IF EXISTING ACCOUNT SESSION, SIGN OUT
  if (Account.error?.response?.status === 403) {
    localStorage.removeItem('q-drr-web-token')
    navigate('/', { replace: true })
    location.reload()
  }

  return (
    <FadeAnimation>
      <div className="sider">
        {status === 'success' && (
          <Panel>
            <PanelSection>
              <PanelLink to="/your-account" tooltip={`Your Account: ${Account.data.name}`}>
                <UserAvatar24 />
              </PanelLink>
              <PanelLink to="/vri" tooltip="Vulnerability and Risk Information">
                <Dashboard24 />
              </PanelLink>
              <PanelLink to="/population" tooltip="Population">
                <PedestrianFamily24 />
              </PanelLink>
              <PanelLink to="/incidents" tooltip="Incidents">
                <TrafficIncident24 />
              </PanelLink>
              <PanelLink to="/evacuation" tooltip="Evacuation">
                <HealthCross24 />
              </PanelLink>
              <PanelLink to="/users" tooltip="User Accounts">
                <Identification24 />
              </PanelLink>
              <div className="panel-link" onClick={signOut} title="Sign Out">
                <Power24 />
              </div>
            </PanelSection>
          </Panel>
        )}
        <div>{Account.data && <AccountContext.Provider value={Account.data}>{children}</AccountContext.Provider>}</div>
      </div>
    </FadeAnimation>
  )
}

export default Sider
