import './CriticalInfrastructureLandslide.css'

import BridgeBarChart from '../fragments/CriticalInfrastructureLandslide/BridgeBarChart'
import BridgeTotalBarChartMunicipalities from '../fragments/CriticalInfrastructureLandslide/BridgeTotalBarChartMunicipalities'
import BuildingBarChart from '../fragments/CriticalInfrastructureLandslide/BuildingBarChart'
import BuildingTotalBarChartMunicipalities from '../fragments/CriticalInfrastructureLandslide/BuildingTotalBarChartMunicipalities'
import FadeAnimation from '../components/FadeAnimation'
import PageContent from '../components/PageContent'
import React from 'react'
import TotalCard from '../fragments/CriticalInfrastructureLandslide/TotalCard'

function CriticalInfrastructureLandslide() {
  return (
    <PageContent>
      <FadeAnimation>
        <div className="pcil-row-one">
          <BuildingBarChart />
          <TotalCard />
          <BridgeBarChart />
        </div>
        <div className="pcil-row-two">
          <BuildingTotalBarChartMunicipalities />
          <BridgeTotalBarChartMunicipalities />
        </div>
      </FadeAnimation>
    </PageContent>
  )
}

export default CriticalInfrastructureLandslide
