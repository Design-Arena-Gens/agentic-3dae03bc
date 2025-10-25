'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import DataPanels from '@/components/DataPanels'
import ChartsSection from '@/components/ChartsSection'
import UploadSection from '@/components/UploadSection'
import { CovidData, ProcessedData } from '@/types'
import { processCovidData, generateMockData } from '@/utils/dataProcessor'

const GlobeVisualization = dynamic(() => import('@/components/GlobeVisualization'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="spinner"></div>
    </div>
  ),
})

export default function Home() {
  const [currentView, setCurrentView] = useState<'globe' | 'country' | 'predictions' | 'upload'>('globe')
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [covidData, setCovidData] = useState<ProcessedData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize with mock data
    const mockData = generateMockData()
    setCovidData(mockData)
    setLoading(false)
  }, [])

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country)
    setCurrentView('country')
  }

  const handleStateSelect = (state: string) => {
    setSelectedState(state)
  }

  const handleDataUpload = (data: CovidData[]) => {
    setLoading(true)
    setTimeout(() => {
      const processed = processCovidData(data)
      setCovidData(processed)
      setLoading(false)
      setCurrentView('globe')
    }, 500)
  }

  const handleViewChange = (view: 'globe' | 'country' | 'predictions' | 'upload') => {
    setCurrentView(view)
    if (view === 'globe') {
      setSelectedCountry(null)
      setSelectedState(null)
    }
  }

  if (loading || !covidData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-300">Loading COVID-19 Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation currentView={currentView} onViewChange={handleViewChange} />
      
      <div className="container mx-auto px-4 py-6">
        {currentView === 'upload' ? (
          <UploadSection onDataUpload={handleDataUpload} />
        ) : (
          <>
            <DataPanels 
              data={covidData} 
              selectedCountry={selectedCountry}
              selectedState={selectedState}
            />

            {currentView === 'globe' && (
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 h-[600px]">
                  <h2 className="text-2xl font-bold mb-4 text-white">Global COVID-19 Map</h2>
                  <GlobeVisualization 
                    data={covidData}
                    onCountrySelect={handleCountrySelect}
                  />
                </div>
                <div className="space-y-6">
                  <ChartsSection data={covidData} view="global" />
                </div>
              </div>
            )}

            {currentView === 'country' && selectedCountry && (
              <div className="mt-6">
                <div className="glass-card p-6 mb-6">
                  <h2 className="text-3xl font-bold mb-2 text-white">{selectedCountry}</h2>
                  <p className="text-gray-300">State-level breakdown and detailed analysis</p>
                </div>
                <ChartsSection 
                  data={covidData} 
                  view="country" 
                  country={selectedCountry}
                  onStateSelect={handleStateSelect}
                />
              </div>
            )}

            {currentView === 'predictions' && (
              <div className="mt-6">
                <ChartsSection data={covidData} view="predictions" />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
