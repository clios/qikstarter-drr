import './IncidentDashboard.css'

import AccountContext from '../contexts/AccountContext'
import FadeAnimation from '../components/FadeAnimation'
import IncidentAreaChart from '../fragments/IncidentDashboard/IncidentAreaChart'
import IncidentBarChart from '../fragments/IncidentDashboard/IncidentBarChart'
import Loader from '../components/Loader'
import PageContent from '../components/PageContent'
import React from 'react'
import VictimAreaChart from '../fragments/IncidentDashboard/VictimAreaChart'
import VictimBarChart from '../fragments/IncidentDashboard/VictimBarChart'
import getDashboard from '../api/getDashboard'

function IncidentDashboard() {
  const IncidentsPerType = getDashboard('/incidents/perType')
  const IncidentsPerMunicipal = getDashboard('/incidents/perMunicipal')
  const IncidentsPerMonth = getDashboard('/incidents/perMonth')
  const VictimsPerStatus = getDashboard('/victims/perStatus')
  const VictimsPerMunicipal = getDashboard('/victims/perMunicipal')
  const VictimsPerMonth = getDashboard('/victims/perMonth')

  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('loading')

  React.useEffect(() => {
    if (
      IncidentsPerType.loading ||
      IncidentsPerMunicipal.loading ||
      IncidentsPerMonth.loading ||
      VictimsPerStatus.loading ||
      VictimsPerMunicipal.loading ||
      VictimsPerMonth.loading
    ) {
      setStatus('loading')
    }

    if (IncidentsPerType.error) setStatus('error')

    if (
      IncidentsPerType.data &&
      IncidentsPerMunicipal.data &&
      IncidentsPerMonth.data &&
      VictimsPerStatus.data &&
      VictimsPerMunicipal.data &&
      VictimsPerMonth.data
    ) {
      setStatus('success')
    }

    return () => setStatus('loading')
  }, [IncidentsPerType, IncidentsPerMunicipal, IncidentsPerMonth, VictimsPerStatus, VictimsPerMunicipal, VictimsPerMonth])

  return (
    <React.Fragment>
      {status === 'loading' && <Loader />}
      <PageContent>
        <FadeAnimation>
          <div className="pid-row-one">
            <IncidentBarChart data={IncidentsPerType.data} />
            <VictimBarChart data={VictimsPerStatus.data} />
          </div>
          <div>
            <IncidentAreaChart data={IncidentsPerMonth.data} />
          </div>
          <div>
            <VictimAreaChart data={VictimsPerMonth.data} />
          </div>
        </FadeAnimation>
      </PageContent>
    </React.Fragment>
  )
}

export default IncidentDashboard
