import './EvacuationDashboard.css'

import AccountContext from '../contexts/AccountContext'
import CapacityBarChart from '../fragments/EvacuationDashboard/CapacityBarChart'
import FadeAnimation from '../components/FadeAnimation'
import InfrastructureBarChart from '../fragments/EvacuationDashboard/InfrastructureBarChart'
import Loader from '../components/Loader'
import MunicipalitiesCapacityBarChart from '../fragments/EvacuationDashboard/MunicipalitiesCapacityBarChart'
import MunicipalitiesInfrastructureBarChart from '../fragments/EvacuationDashboard/MunicipalitiesInfrastructureBarChart'
import PageContent from '../components/PageContent'
import React from 'react'
import TotalCard from '../fragments/EvacuationDashboard/TotalCard'
import getDashboard from '../api/getDashboard'

function EvacuationDashboard() {
  const evacuationCenters = getDashboard('/evacuationCenters')

  // INFORMATION STATE
  const Account = React.useContext(AccountContext)
  const [status, setStatus] = React.useState('loading')

  React.useEffect(() => {
    if (evacuationCenters.loading) setStatus('loading')
    if (evacuationCenters.error) setStatus('error')
    if (evacuationCenters.data) {
      setStatus('success')
    }

    return () => setStatus('loading')
  }, [evacuationCenters])

  return (
    <React.Fragment>
      {status === 'loading' && <Loader />}
      <PageContent>
        <FadeAnimation>
          <div className="ped-row-one">
            <InfrastructureBarChart data={evacuationCenters.data} />
            <TotalCard />
            <CapacityBarChart data={evacuationCenters.data} />
          </div>
          <div>
            <MunicipalitiesInfrastructureBarChart data={evacuationCenters.data} />
          </div>
          <div>
            <MunicipalitiesCapacityBarChart data={evacuationCenters.data} />
          </div>
        </FadeAnimation>
      </PageContent>
    </React.Fragment>
  )
}

export default EvacuationDashboard
