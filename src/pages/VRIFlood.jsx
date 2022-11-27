import AgriAnnualBarChart from '../fragments/VRI/AgricultureFlood/AnnualBarChart'
import AgriAnnualTotalBarChartMunicipalities from '../fragments/VRI/AgricultureFlood/AnnualTotalBarChartMunicipalities'
import AgriPerennialBarChart from '../fragments/VRI/AgricultureFlood/PerennialBarChart'
import AgriPerennialTotalBarChartMunicipalities from '../fragments/VRI/AgricultureFlood/PerennialTotalBarChartMunicipalities'
import AgriTotalCard from '../fragments/VRI/AgricultureFlood/TotalCard'
import CIBridgeBarChart from '../fragments/VRI/CriticalInfrastructureFlood/BridgeBarChart'
import CIBridgeTotalBarChartMunicipalities from '../fragments/VRI/CriticalInfrastructureFlood/BridgeTotalBarChartMunicipalities'
import CIBuildingBarChart from '../fragments/VRI/CriticalInfrastructureFlood/BuildingBarChart'
import CIBuildingTotalBarChartMunicipalities from '../fragments/VRI/CriticalInfrastructureFlood/BuildingTotalBarChartMunicipalities'
import CITotalCard from '../fragments/VRI/CriticalInfrastructureFlood/TotalCard'
import FadeAnimation from '../components/FadeAnimation'
import PageContent from '../components/PageContent'
import PaperView from '../components/PaperView'
import RLRoadClassificationBarChart from '../fragments/VRI/RoadLifelineFlood/RoadClassificationBarChart'
import RLRoadLengthMatrix from '../fragments/VRI/RoadLifelineFlood/RoadLengthMatrix'
import RLRoadTypeTable from '../fragments/VRI/RoadLifelineFlood/RoadTypeTable'
import RLSusceptibilityBarChart from '../fragments/VRI/RoadLifelineFlood/SusceptibilityBarChart'
import RLSusceptibilityBarChartMunicipalities from '../fragments/VRI/RoadLifelineFlood/SusceptibilityBarChartMunicipalities'
import RLTotalBarChartMunicipalities from '../fragments/VRI/RoadLifelineFlood/TotalBarChartMunicipalities'
import RLTotalCard from '../fragments/VRI/RoadLifelineFlood/TotalCard'
import React from 'react'
import SASusceptibilityAreaChart from '../fragments/VRI/SettlementAreaFlood/SusceptibilityAreaChart'
import SASusceptibilityBarChart from '../fragments/VRI/SettlementAreaFlood/SusceptibilityBarChart'
import SASusceptibilityBarChartMunicipalities from '../fragments/VRI/SettlementAreaFlood/SusceptibilityBarChartMunicipalities'
import SATotalBarChartMunicipalities from '../fragments/VRI/SettlementAreaFlood/TotalBarChartMunicipalities'
import SATotalCard from '../fragments/VRI/SettlementAreaFlood/TotalCard'

function VRIFlood() {
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

export default VRIFlood
