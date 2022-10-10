import './PopulationByAgeAndSex.css'

import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryLegend, VictoryStack } from 'victory'

import React from 'react'

function PopulationByAgeAndSex() {
  const dataA = [
    { x: '1 - 10', y: 57 },
    { x: '11 - 20', y: 40 },
    { x: '21 - 30', y: 38 },
    { x: '31 - 40', y: 37 },
    { x: '41 - 50', y: 25 },
    { x: '51 - 60', y: 19 },
    { x: '61 - 70', y: 15 },
    { x: '71 - 80', y: 13 },
    { x: '81 - 90', y: 11 },
    { x: '91 - 100', y: 8 },
    { x: 'Above 100', y: 5 }
  ]

  const dataB = dataA.map((point) => {
    const y = Math.round(point.y + 3 * (Math.random() - 0.5))
    return { ...point, y }
  })

  const width = 400
  const height = 200

  return (
    <div>
      <VictoryChart horizontal height={height} width={width} padding={40}>
        <VictoryStack style={{ data: { width: 10 }, labels: { fontSize: 7, fill: '#FFFFFF' } }}>
          <VictoryBar
            style={{ data: { fill: '#20A8DF' } }}
            data={dataA}
            y={(data) => -Math.abs(data.y)}
            labels={({ datum }) => `${Math.abs(datum.y)}%`}
          />
          <VictoryBar style={{ data: { fill: '#DFDF20' } }} data={dataB} labels={({ datum }) => `${Math.abs(datum.y)}%`} />
        </VictoryStack>
        <VictoryAxis
          axisLabelComponent={<VictoryLabel dy={-80} angle={0} />}
          label="Population by Age Bracket"
          style={{
            axisLabel: { fill: '#DF9C20', fontSize: 8, padding: 0 },
            tickLabels: { opacity: 0 }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: 'transparent' },
            ticks: { stroke: 'transparent' },
            tickLabels: { fontSize: 7, fill: '#FFFFFF', strokeWidth: 0.4, fontWeight: 600 }
          }}
          tickLabelComponent={<VictoryLabel x={width / 2} textAnchor="middle" />}
          tickValues={dataA.map((point) => point.x).reverse()}
        />
        <VictoryLegend
          x={160}
          y={20}
          orientation="horizontal"
          gutter={20}
          colorScale={['#20A8DF', '#DFDF20']}
          data={[{ name: 'Male' }, { name: 'Female' }]}
          style={{ labels: { fontSize: 6, fill: 'white', textAlign: 'center' } }}
        />
      </VictoryChart>
    </div>
  )
}

export default PopulationByAgeAndSex
