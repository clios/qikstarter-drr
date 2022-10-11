import './RoadLifelineLandslide.css'

import FadeAnimation from '../components/FadeAnimation'
import PageContent from '../components/PageContent'
import React from 'react'
import RoadClassificationBarChart from '../fragments/RoadLifelineLandslide/RoadClassificationBarChart'
import SusceptibilityBarChart from '../fragments/RoadLifelineLandslide/SusceptibilityBarChart'
import TotalCard from '../fragments/RoadLifelineLandslide/TotalCard'

function RoadLifelineLandslide() {
  return (
    <PageContent>
      <FadeAnimation>
        <div className="prll-row-one">
          <SusceptibilityBarChart />
          <TotalCard />
          <RoadClassificationBarChart />
        </div>
      </FadeAnimation>
    </PageContent>
  )
}

export default RoadLifelineLandslide
