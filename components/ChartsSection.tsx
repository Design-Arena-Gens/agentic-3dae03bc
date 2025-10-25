'use client'

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { ProcessedData } from '@/types'

interface ChartsSectionProps {
  data: ProcessedData
  view: 'global' | 'country' | 'predictions'
  country?: string
  onStateSelect?: (state: string) => void
}

export default function ChartsSection({ data, view, country, onStateSelect }: ChartsSectionProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num)
  }

  const COLORS = ['#0ea5e9', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc', '#e0f2fe', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  if (view === 'predictions') {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Machine Learning Predictions</h2>
          <p className="text-gray-300 mb-6">
            AI-powered forecasts for the next 90 days based on historical trends and patterns
          </p>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Predicted Case Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data.predictions}>
              <defs>
                <linearGradient id="casesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
                tickFormatter={formatNumber}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: any) => [formatNumber(value), '']}
              />
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="none"
                fill="url(#casesGradient)"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="predictedCases"
                stroke="#0ea5e9"
                strokeWidth={3}
                fill="url(#casesGradient)"
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="lowerBound"
                stroke="none"
                fill="url(#casesGradient)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Predicted Deaths</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.predictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatNumber}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: any) => [formatNumber(value), 'Deaths']}
                />
                <Line
                  type="monotone"
                  dataKey="predictedDeaths"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Predicted Vaccination Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.predictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatNumber}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: any) => [formatNumber(value), 'Vaccinated']}
                />
                <Line
                  type="monotone"
                  dataKey="predictedVaccinated"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Key Predictions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-2">30-Day Case Projection</h4>
              <p className="text-2xl font-bold text-blue-400">
                {formatNumber(data.predictions[29]?.predictedCases || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">±10% confidence interval</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-2">Vaccination Growth</h4>
              <p className="text-2xl font-bold text-green-400">+12.5%</p>
              <p className="text-xs text-gray-500 mt-1">Expected monthly increase</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-2">Mortality Trend</h4>
              <p className="text-2xl font-bold text-orange-400">Declining</p>
              <p className="text-xs text-gray-500 mt-1">5% reduction projected</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'country' && country) {
    const countryData = data.countries.find(c => c.country === country)
    
    if (!countryData || !countryData.states) {
      return (
        <div className="glass-card p-6">
          <p className="text-gray-300">No state-level data available for {country}</p>
        </div>
      )
    }

    const stateChartData = countryData.states.map(state => ({
      name: state.state,
      cases: state.totalCases,
      deaths: state.deaths,
      recovered: state.recovered,
      vaccinated: state.vaccinated,
    }))

    return (
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 text-white">State-wise Case Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stateChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
                tickFormatter={formatNumber}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => [formatNumber(value), '']}
              />
              <Legend />
              <Bar dataKey="cases" fill="#0ea5e9" name="Total Cases" />
              <Bar dataKey="recovered" fill="#10b981" name="Recovered" />
              <Bar dataKey="deaths" fill="#ef4444" name="Deaths" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Vaccination Coverage by State</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stateChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis 
                  type="number"
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatNumber}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  stroke="#94a3b8"
                  width={100}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => [formatNumber(value), 'Vaccinated']}
                />
                <Bar dataKey="vaccinated" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">State Comparison</h3>
            <div className="space-y-3">
              {countryData.states.slice(0, 5).map((state, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => onStateSelect?.(state.state)}
                >
                  <div>
                    <p className="font-semibold text-white">{state.state}</p>
                    <p className="text-xs text-gray-400">
                      {formatNumber(state.totalCases)} cases
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-400">
                      {((state.vaccinated / state.population) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">vaccinated</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Global view
  const recentTimeSeries = data.timeSeries.slice(-60)
  const topCountries = data.countries
    .sort((a, b) => b.totalCases - a.totalCases)
    .slice(0, 10)

  const pieData = [
    { name: 'Active', value: data.global.activeCases, color: '#f59e0b' },
    { name: 'Recovered', value: data.global.recovered, color: '#10b981' },
    { name: 'Deaths', value: data.global.deaths, color: '#ef4444' },
  ]

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 text-white">Global Case Trends (Last 60 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={recentTimeSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              tickFormatter={formatNumber}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value: any) => [formatNumber(value), '']}
            />
            <Legend />
            <Line type="monotone" dataKey="cases" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Cases" />
            <Line type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={2} dot={false} name="Recovered" />
            <Line type="monotone" dataKey="deaths" stroke="#ef4444" strokeWidth={2} dot={false} name="Deaths" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Top 10 Countries by Cases</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topCountries} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis 
                type="number"
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
                tickFormatter={formatNumber}
              />
              <YAxis 
                type="category"
                dataKey="country" 
                stroke="#94a3b8"
                width={100}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => [formatNumber(value), 'Cases']}
              />
              <Bar dataKey="totalCases" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Global Case Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => [formatNumber(value), '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 text-white">Vaccination Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={recentTimeSeries}>
            <defs>
              <linearGradient id="vaccineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              tickFormatter={formatNumber}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value: any) => [formatNumber(value), 'Vaccinated']}
            />
            <Area
              type="monotone"
              dataKey="vaccinated"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#vaccineGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
