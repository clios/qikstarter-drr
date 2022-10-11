import './CriticalInfrastructureFlood.css'

import BridgeBarChart from '../fragments/CriticalInfrastructureFlood/BridgeBarChart'
import BridgeTotalBarChartMunicipalities from '../fragments/CriticalInfrastructureFlood/BridgeTotalBarChartMunicipalities'
import BuildingBarChart from '../fragments/CriticalInfrastructureFlood/BuildingBarChart'
import BuildingTotalBarChartMunicipalities from '../fragments/CriticalInfrastructureFlood/BuildingTotalBarChartMunicipalities'
import FadeAnimation from '../components/FadeAnimation'
import PageContent from '../components/PageContent'
import React from 'react'
import TotalCard from '../fragments/CriticalInfrastructureFlood/TotalCard'

function CriticalInfrastructureFlood() {
  return (
    <PageContent>
      <FadeAnimation>
        <div className="pcif-row-one">
          <BuildingBarChart />
          <TotalCard />
          <BridgeBarChart />
        </div>
        <div className="pcif-row-two">
          <BuildingTotalBarChartMunicipalities />
          <BridgeTotalBarChartMunicipalities />
        </div>
      </FadeAnimation>
    </PageContent>
  )
}

export default CriticalInfrastructureFlood
