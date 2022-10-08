import './SettlementAreaLandslide.css'

import FadeAnimation from '../components/FadeAnimation'
import PageContent from '../components/PageContent'
import React from 'react'
import SusceptibilityAreaChart from '../fragments/SettlementAreaLandslide/SusceptibilityAreaChart'
import SusceptibilityBarChart from '../fragments/SettlementAreaLandslide/SusceptibilityBarChart'
import SusceptibilityBarChartMunicipalities from '../fragments/SettlementAreaLandslide/SusceptibilityBarChartMunicipalities'
import TotalBarChartMinicipalities from '../fragments/SettlementAreaLandslide/TotalBarChartMinicipalities'
import TotalCard from '../fragments/SettlementAreaLandslide/TotalCard'

function SettlementAreaLandslide() {
  return (
    <PageContent>
      <FadeAnimation>
        <div className="psal-row-one">
          <SusceptibilityBarChart />
          <TotalCard />
          <SusceptibilityAreaChart />
        </div>
        <div className="psal-row-two">
          <TotalBarChartMinicipalities />
        </div>
        <div className="psal-row-three">
          <SusceptibilityBarChartMunicipalities />
        </div>
      </FadeAnimation>
    </PageContent>
  )
}

export default SettlementAreaLandslide
