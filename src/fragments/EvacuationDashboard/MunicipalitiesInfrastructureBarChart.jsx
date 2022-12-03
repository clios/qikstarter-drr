import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryLegend, VictoryVoronoiContainer } from 'victory'

import React from 'react'

function MunicipalitiesInfrastructureBarChart({ data }) {
  return (
    <div>
      {data && (
        <VictoryChart
          domainPadding={{ x: [50, 50], y: [0, 8] }}
          padding={{ left: 16, right: 16, bottom: 32, top: 32 }}
          height={160}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labelComponent={
                <VictoryLabel
                  textAnchor="middle"
                  verticalAnchor="start"
                  labelPlacement="perpendicular"
                  backgroundPadding={8}
                  backgroundStyle={{ fill: '#22282A', opacity: 0.7, stroke: '#FFFFFF' }}
                  style={{ fill: '#FFFFFF', fontSize: 8 }}
                />
              }
              labels={({ datum }) => {
                if (datum.childName === 'bar-chart-group-2-0') return `Government: ${datum.y}`
                if (datum.childName === 'bar-chart-group-2-1') return `Private: ${datum.y}`
              }}
            />
          }>
          <VictoryAxis
            label="Total Infrastructure of Municipalities"
            style={{
              axis: { stroke: 'white' },
              axisLabel: { fill: '#DF9C20', fontSize: 8, padding: -122 },
              tickLabels: { padding: 2, fontSize: 6, fontWeight: 100, fill: '#FFFFFF' },
              grid: { stroke: '#73858C', strokeDasharray: '7' }
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { opacity: 0 },
              grid: { stroke: '#73858C', strokeDasharray: '7' }
            }}
          />
          <VictoryGroup offset={18}>
            {/* GOVERNMENT */}
            <VictoryBar
              style={{ data: { fill: '#DF2020', fillOpacity: 0.7, width: 15 }, labels: { fontSize: 6 } }}
              data={[
                { x: 'Aglipay', y: data?.total_infrastructure_government_aglipay || 0 },
                { x: 'Cabarroguis', y: data?.total_infrastructure_government_cabarroguis || 0 },
                { x: 'Diffun ', y: data?.total_infrastructure_government_diffun || 0 },
                { x: 'Maddela ', y: data?.total_infrastructure_government_maddela || 0 },
                { x: 'Nagtipunan', y: data?.total_infrastructure_government_nagtipunan || 0 },
                { x: 'Saguday', y: data?.total_infrastructure_government_saguday || 0 }
              ]}
            />
            {/* PRIVATE */}
            <VictoryBar
              style={{ data: { fill: '#20A8DF', fillOpacity: 0.7, width: 15 }, labels: { fontSize: 6 } }}
              data={[
                { x: 'Aglipay', y: data?.total_infrastructure_private_aglipay || 0 },
                { x: 'Cabarroguis', y: data?.total_infrastructure_private_cabarroguis || 0 },
                { x: 'Diffun ', y: data?.total_infrastructure_private_diffun || 0 },
                { x: 'Maddela ', y: data?.total_infrastructure_private_maddela || 0 },
                { x: 'Nagtipunan', y: data?.total_infrastructure_private_nagtipunan || 0 },
                { x: 'Saguday', y: data?.total_infrastructure_private_saguday || 0 }
              ]}
            />
          </VictoryGroup>
          <VictoryLegend
            x={177}
            y={15}
            orientation="horizontal"
            gutter={20}
            colorScale={['#DF2020', '#20A8DF']}
            data={[{ name: 'Government' }, { name: 'Private' }]}
            style={{ labels: { fontSize: 6, fill: 'white', textAlign: 'center' } }}
          />
        </VictoryChart>
      )}
    </div>
  )
}

export default MunicipalitiesInfrastructureBarChart
