import './PopulationDashboard.css'

import FadeAnimation from '../components/FadeAnimation'
import LeftBarChart from '../fragments/PopulationDashboard/LeftBarChart'
import PWDBarChart from '../fragments/PopulationDashboard/PWDBarChart'
import PageContent from '../components/PageContent'
import React from 'react'
import RightBarChart from '../fragments/PopulationDashboard/RightBarChart'
import SeniorCitizenBarChart from '../fragments/PopulationDashboard/SeniorCitizenBarChart'
import SexBarChart from '../fragments/PopulationDashboard/SexBarChart'
import TotalBarChart from '../fragments/PopulationDashboard/TotalBarChart'
import TotalPopulationPieChart from '../fragments/PopulationDashboard/TotalPopulationPieChart'

function PopulationDashboard() {
  return (
    <PageContent>
      <FadeAnimation>
        <div className="ppd-row-one">
          <LeftBarChart />
          <TotalPopulationPieChart />
          <RightBarChart />
        </div>
        <div className="ppd-row-two">
          <TotalBarChart />
        </div>
        <div className="ppd-row-three">
          <SexBarChart />
        </div>
        <div className="ppd-row-four">
          <SeniorCitizenBarChart />
          <PWDBarChart />
        </div>
      </FadeAnimation>
    </PageContent>
  )
}
export default PopulationDashboard
