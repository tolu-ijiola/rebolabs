'use client'

import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ChartData {
  name: string
  [key: string]: string | number
}

interface ChartProps {
  data: ChartData[]
  type: 'line' | 'bar' | 'pie'
  height?: number
  width?: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function Chart({ data, type, height = 300, width }: ChartProps) {
  // Get all numeric keys except 'name' for multi-series charts
  const getDataKeys = () => {
    if (data.length === 0) return []
    const keys = Object.keys(data[0]).filter(key => key !== 'name')
    return keys.filter(key => typeof data[0][key] === 'number')
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        const lineKeys = getDataKeys()
        return (
          <ResponsiveContainer width={width || '100%'} height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {lineKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case 'bar':
        const barKeys = getDataKeys()
        return (
          <ResponsiveContainer width={width || '100%'} height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {barKeys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case 'pie':
        // Pie chart still uses 'value' key
        return (
          <ResponsiveContainer width={width || '100%'} height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {renderChart()}
    </div>
  )
}
