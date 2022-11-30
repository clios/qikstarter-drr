import './VRI.css'

import AgriAnnualBarChart from '../fragments/VRI/AgricultureLandslide/AnnualBarChart'
import AgriAnnualTotalBarChartMunicipalities from '../fragments/VRI/AgricultureLandslide/AnnualTotalBarChartMunicipalities'
import AgriPerennialBarChart from '../fragments/VRI/AgricultureLandslide/PerennialBarChart'
import AgriPerennialTotalBarChartMunicipalities from '../fragments/VRI/AgricultureLandslide/PerennialTotalBarChartMunicipalities'
import AgriTotalCard from '../fragments/VRI/AgricultureLandslide/TotalCard'
import CIBridgeBarChart from '../fragments/VRI/CriticalInfrastructureLandslide/BridgeBarChart'
import CIBridgeTotalBarChartMunicipalities from '../fragments/VRI/CriticalInfrastructureLandslide/BridgeTotalBarChartMunicipalities'
import CIBuildingBarChart from '../fragments/VRI/CriticalInfrastructureLandslide/BuildingBarChart'
import CIBuildingTotalBarChartMunicipalities from '../fragments/VRI/CriticalInfrastructureLandslide/BuildingTotalBarChartMunicipalities'
import CITotalCard from '../fragments/VRI/CriticalInfrastructureLandslide/TotalCard'
import FadeAnimation from '../components/FadeAnimation'
import PageContent from '../components/PageContent'
import PaperView from '../components/PaperView'
import RLRoadClassificationBarChart from '../fragments/VRI/RoadLifelineLandslide/RoadClassificationBarChart'
import RLRoadLengthMatrix from '../fragments/VRI/RoadLifelineLandslide/RoadLengthMatrix'
import RLRoadTypeTable from '../fragments/VRI/RoadLifelineLandslide/RoadTypeTable'
import RLSusceptibilityBarChart from '../fragments/VRI/RoadLifelineLandslide/SusceptibilityBarChart'
import RLSusceptibilityBarChartMunicipalities from '../fragments/VRI/RoadLifelineLandslide/SusceptibilityBarChartMunicipalities'
import RLTotalBarChartMunicipalities from '../fragments/VRI/RoadLifelineLandslide/TotalBarChartMunicipalities'
import RLTotalCard from '../fragments/VRI/RoadLifelineLandslide/TotalCard'
import React from 'react'
import SASusceptibilityAreaChart from '../fragments/VRI/SettlementAreaLandslide/SusceptibilityAreaChart'
import SASusceptibilityBarChart from '../fragments/VRI/SettlementAreaLandslide/SusceptibilityBarChart'
import SASusceptibilityBarChartMunicipalities from '../fragments/VRI/SettlementAreaLandslide/SusceptibilityBarChartMunicipalities'
import SATotalBarChartMunicipalities from '../fragments/VRI/SettlementAreaLandslide/TotalBarChartMunicipalities'
import SATotalCard from '../fragments/VRI/SettlementAreaLandslide/TotalCard'

function VRILandslide() {
  return (
    <PageContent>
      <FadeAnimation>
        <PaperView>
          <div className="vri-title">Settlement Area</div>
          <div className="psal-row-one">
            <SASusceptibilityBarChart />
            <SATotalCard />
            <SASusceptibilityAreaChart />
          </div>
          <div className="pal-row-two">
            <SATotalBarChartMunicipalities />
          </div>
          <div className="psal-row-three">
            <SASusceptibilityBarChartMunicipalities />
          </div>
        </PaperView>

        <PaperView>
          <div className="vri-title">Agriculture</div>
          <div className="psal-row-one">
            <AgriAnnualBarChart />
            <AgriTotalCard />
            <AgriPerennialBarChart />
          </div>
          <div className="psal-row-two">
            <AgriAnnualTotalBarChartMunicipalities />
            <AgriPerennialTotalBarChartMunicipalities />
          </div>
        </PaperView>

        <PaperView>
          <div className="vri-title">Critical Infrastructure</div>
          <div className="psal-row-one">
            <CIBuildingBarChart />
            <CITotalCard />
            <CIBridgeBarChart />
          </div>
          <div className="psal-row-two">
            <CIBuildingTotalBarChartMunicipalities />
            <CIBridgeTotalBarChartMunicipalities />
          </div>
        </PaperView>

        <PaperView>
          <div className="vri-title">Road Lifeline</div>
          <div className="psal-row-one">
            <RLSusceptibilityBarChart />
            <RLTotalCard />
            <RLRoadClassificationBarChart />
          </div>
          <div className="prll-row-two">
            <RLTotalBarChartMunicipalities />
          </div>
          <div>
            <RLRoadTypeTable />
          </div>
          <div>
            <RLSusceptibilityBarChartMunicipalities />
          </div>
          <div>
            <RLRoadLengthMatrix />
          </div>
        </PaperView>
      </FadeAnimation>
    </PageContent>
  )
}

export default VRILandslide
