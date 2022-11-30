import './VictimAreaChart.css'

import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryLine } from 'victory'

import React from 'react'

function VictimAreaChart({ data }) {
  const date = new Date()
  const colList = [
    new Date(date.setMonth(date.getMonth())).toLocaleDateString('en-us', { month: 'short', day: '2-digit' }),
    new Date(date.setMonth(date.getMonth() - 1)).toLocaleDateString('en-us', { month: 'short', day: '2-digit' }),
    new Date(date.setMonth(date.getMonth() - 1)).toLocaleDateString('en-us', { month: 'short', day: '2-digit' }),
    new Date(date.setMonth(date.getMonth() - 1)).toLocaleDateString('en-us', { month: 'short', day: '2-digit' }),
    new Date(date.setMonth(date.getMonth() - 1)).toLocaleDateString('en-us', { month: 'short', day: '2-digit' }),
    new Date(date.setMonth(date.getMonth() - 1)).toLocaleDateString('en-us', { month: 'short', day: '2-digit' }),
    new Date(date.setMonth(date.getMonth() - 1)).toLocaleDateString('en-us', { month: 'short', day: '2-digit' }),
    new Date(date.setMonth(date.getMonth() - 1)).toLocaleDateString('en-us', { month: 'short', day: '2-digit' }),
    new Date(date.setMonth(date.getMonth() - 1)).toLocaleDateString('en-us', { month: 'short', day: '2-digit' }),
    new Date(date.setMonth(date.getMonth() - 1)).toLocaleDateString('en-us', { month: 'short', day: '2-digit' }),
    new Date(date.setMonth(date.getMonth() - 1)).toLocaleDateString('en-us', { month: 'short', day: '2-digit' }),
    new Date(date.setMonth(date.getMonth() - 1)).toLocaleDateString('en-us', { month: 'short', day: '2-digit' })
  ]

  return (
    <div>
      {data && (
        <VictoryChart domainPadding={{ x: [30, 30], y: [0, 24] }} padding={{ left: 16, right: 16, bottom: 32, top: 32 }} height={170}>
          <VictoryBar
            labelComponent={<VictoryLabel dy={-5} />}
            labels={({ datum }) => `${datum.y.toLocaleString()}`}
            style={{ data: { fill: '#20A8DF', fillOpacity: 0.5, width: 24 }, labels: { fill: '#DF9C20', fontSize: 10 } }}
            data={[
              { x: colList[11], y: data[11] },
              { x: colList[10], y: data[10] },
              { x: colList[9], y: data[9] },
              { x: colList[8], y: data[8] },
              { x: colList[7], y: data[7] },
              { x: colList[6], y: data[6] },
              { x: colList[5], y: data[5] },
              { x: colList[4], y: data[4] },
              { x: colList[3], y: data[3] },
              { x: colList[2], y: data[2] },
              { x: colList[1], y: data[1] },
              { x: colList[0], y: data[0] }
            ]}
          />
          <VictoryLine
            interpolation="step"
            style={{ data: { stroke: '#DF9C20', strokeWidth: 1 } }}
            data={[
              { x: colList[11], y: data[11] },
              { x: colList[10], y: data[10] },
              { x: colList[9], y: data[9] },
              { x: colList[8], y: data[8] },
              { x: colList[7], y: data[7] },
              { x: colList[6], y: data[6] },
              { x: colList[5], y: data[5] },
              { x: colList[4], y: data[4] },
              { x: colList[3], y: data[3] },
              { x: colList[2], y: data[2] },
              { x: colList[1], y: data[1] },
              { x: colList[0], y: data[0] }
            ]}
          />
          <VictoryAxis
            label="Victims in the last year"
            style={{
              axisLabel: { fill: '#DF9C20', fontSize: 9, padding: -130 },
              tickLabels: { opacity: 0 }
            }}
          />
          <VictoryAxis
            label={`${data?.reduce((a, b) => a + b, 0)} Victims`}
            style={{
              axisLabel: { fill: '#FFFFFF', fontSize: 9, padding: -120 },
              tickLabels: { opacity: 0 }
            }}
          />
          <VictoryAxis
            style={{
              axis: { stroke: 'white' },
              tickLabels: { padding: 2, fontSize: 7, fontWeight: 100, fill: '#FFFFFF' },
              grid: { stroke: '#73858C', strokeDasharray: '7' }
            }}
          />
          <VictoryAxis dependentAxis style={{ tickLabels: { opacity: 0 }, grid: { stroke: '#73858C', strokeDasharray: '7' } }} />
        </VictoryChart>
      )}
    </div>
  )
}

export default VictimAreaChart
