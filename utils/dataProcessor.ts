import { CovidData, ProcessedData, CountryData, TimeSeriesData, PredictionData, StateData } from '@/types'

export function processCovidData(rawData: CovidData[]): ProcessedData {
  // Aggregate global data
  const globalStats = {
    totalCases: 0,
    activeCases: 0,
    recovered: 0,
    deaths: 0,
    vaccinated: 0,
    population: 0,
  }

  // Group by country
  const countryMap = new Map<string, CovidData[]>()
  
  rawData.forEach(entry => {
    globalStats.totalCases += entry.totalCases || 0
    globalStats.activeCases += entry.activeCases || 0
    globalStats.recovered += entry.recovered || 0
    globalStats.deaths += entry.deaths || 0
    globalStats.vaccinated += entry.vaccinated || 0
    globalStats.population += entry.population || 0

    if (!countryMap.has(entry.country)) {
      countryMap.set(entry.country, [])
    }
    countryMap.get(entry.country)!.push(entry)
  })

  // Process countries
  const countries: CountryData[] = Array.from(countryMap.entries()).map(([country, entries]) => {
    const countryStats = entries.reduce(
      (acc, entry) => ({
        totalCases: acc.totalCases + (entry.totalCases || 0),
        activeCases: acc.activeCases + (entry.activeCases || 0),
        recovered: acc.recovered + (entry.recovered || 0),
        deaths: acc.deaths + (entry.deaths || 0),
        vaccinated: acc.vaccinated + (entry.vaccinated || 0),
        population: acc.population + (entry.population || 0),
      }),
      { totalCases: 0, activeCases: 0, recovered: 0, deaths: 0, vaccinated: 0, population: 0 }
    )

    const states: StateData[] = entries
      .filter(e => e.state)
      .map(e => ({
        state: e.state!,
        totalCases: e.totalCases || 0,
        activeCases: e.activeCases || 0,
        recovered: e.recovered || 0,
        deaths: e.deaths || 0,
        vaccinated: e.vaccinated || 0,
        population: e.population || 100000,
      }))

    const coords = getCountryCoordinates(country)
    const trend = calculateTrend(entries)

    return {
      country,
      ...countryStats,
      vaccinationRate: countryStats.population > 0 
        ? (countryStats.vaccinated / countryStats.population) * 100 
        : 0,
      trend: trend.direction,
      trendValue: trend.value,
      latitude: coords.lat,
      longitude: coords.lng,
      states: states.length > 0 ? states : undefined,
    }
  })

  // Generate time series (mock for demo)
  const timeSeries = generateTimeSeries()
  
  // Generate predictions
  const predictions = generatePredictions(timeSeries)

  return {
    global: {
      ...globalStats,
      vaccinationRate: globalStats.population > 0 
        ? (globalStats.vaccinated / globalStats.population) * 100 
        : 0,
    },
    countries,
    timeSeries,
    predictions,
  }
}

function calculateTrend(entries: CovidData[]): { direction: 'up' | 'down' | 'stable'; value: number } {
  if (entries.length < 2) return { direction: 'stable', value: 0 }
  
  const sorted = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const recent = sorted.slice(-7)
  const previous = sorted.slice(-14, -7)
  
  const recentAvg = recent.reduce((sum, e) => sum + (e.totalCases || 0), 0) / recent.length
  const previousAvg = previous.reduce((sum, e) => sum + (e.totalCases || 0), 0) / previous.length
  
  const change = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0
  
  return {
    direction: change > 2 ? 'up' : change < -2 ? 'down' : 'stable',
    value: Math.abs(change),
  }
}

function generateTimeSeries(): TimeSeriesData[] {
  const series: TimeSeriesData[] = []
  const startDate = new Date('2023-01-01')
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    series.push({
      date: date.toISOString().split('T')[0],
      cases: Math.floor(500000 + Math.random() * 200000 + i * 1000),
      deaths: Math.floor(10000 + Math.random() * 5000 + i * 50),
      recovered: Math.floor(400000 + Math.random() * 150000 + i * 800),
      vaccinated: Math.floor(1000000 + i * 50000),
    })
  }
  
  return series
}

function generatePredictions(timeSeries: TimeSeriesData[]): PredictionData[] {
  const predictions: PredictionData[] = []
  const lastDate = new Date(timeSeries[timeSeries.length - 1].date)
  const lastCases = timeSeries[timeSeries.length - 1].cases
  const lastDeaths = timeSeries[timeSeries.length - 1].deaths
  const lastVaccinated = timeSeries[timeSeries.length - 1].vaccinated
  
  for (let i = 1; i <= 90; i++) {
    const date = new Date(lastDate)
    date.setDate(date.getDate() + i)
    
    const growthRate = 0.005
    const predictedCases = Math.floor(lastCases * Math.pow(1 + growthRate, i))
    const predictedDeaths = Math.floor(lastDeaths * Math.pow(1 + growthRate * 0.5, i))
    const predictedVaccinated = Math.floor(lastVaccinated + i * 50000)
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      predictedCases,
      predictedDeaths,
      predictedVaccinated,
      lowerBound: Math.floor(predictedCases * 0.9),
      upperBound: Math.floor(predictedCases * 1.1),
    })
  }
  
  return predictions
}

export function generateMockData(): ProcessedData {
  const mockCountries = [
    { name: 'United States', lat: 37.0902, lng: -95.7129, population: 331000000 },
    { name: 'India', lat: 20.5937, lng: 78.9629, population: 1380000000 },
    { name: 'Brazil', lat: -14.2350, lng: -51.9253, population: 212000000 },
    { name: 'United Kingdom', lat: 55.3781, lng: -3.4360, population: 67000000 },
    { name: 'Russia', lat: 61.5240, lng: 105.3188, population: 145000000 },
    { name: 'France', lat: 46.2276, lng: 2.2137, population: 65000000 },
    { name: 'Germany', lat: 51.1657, lng: 10.4515, population: 83000000 },
    { name: 'Italy', lat: 41.8719, lng: 12.5674, population: 60000000 },
    { name: 'Spain', lat: 40.4637, lng: -3.7492, population: 47000000 },
    { name: 'Canada', lat: 56.1304, lng: -106.3468, population: 38000000 },
  ]

  const countries: CountryData[] = mockCountries.map(country => {
    const totalCases = Math.floor(Math.random() * 10000000) + 1000000
    const deaths = Math.floor(totalCases * 0.02)
    const recovered = Math.floor(totalCases * 0.85)
    const activeCases = totalCases - deaths - recovered
    const vaccinated = Math.floor(country.population * (0.6 + Math.random() * 0.3))

    return {
      country: country.name,
      totalCases,
      activeCases,
      recovered,
      deaths,
      vaccinated,
      vaccinationRate: (vaccinated / country.population) * 100,
      trend: Math.random() > 0.5 ? 'down' : Math.random() > 0.5 ? 'up' : 'stable',
      trendValue: Math.random() * 10,
      latitude: country.lat,
      longitude: country.lng,
      states: country.name === 'United States' ? generateUSStates() : 
              country.name === 'India' ? generateIndiaStates() : undefined,
    }
  })

  const globalStats = countries.reduce(
    (acc, country) => ({
      totalCases: acc.totalCases + country.totalCases,
      activeCases: acc.activeCases + country.activeCases,
      recovered: acc.recovered + country.recovered,
      deaths: acc.deaths + country.deaths,
      vaccinated: acc.vaccinated + country.vaccinated,
    }),
    { totalCases: 0, activeCases: 0, recovered: 0, deaths: 0, vaccinated: 0 }
  )

  const totalPopulation = mockCountries.reduce((sum, c) => sum + c.population, 0)

  return {
    global: {
      ...globalStats,
      vaccinationRate: (globalStats.vaccinated / totalPopulation) * 100,
    },
    countries,
    timeSeries: generateTimeSeries(),
    predictions: generatePredictions(generateTimeSeries()),
  }
}

function generateUSStates(): StateData[] {
  const states = ['California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois', 'Ohio', 'Georgia']
  return states.map(state => ({
    state,
    totalCases: Math.floor(Math.random() * 2000000) + 500000,
    activeCases: Math.floor(Math.random() * 100000) + 10000,
    recovered: Math.floor(Math.random() * 1800000) + 400000,
    deaths: Math.floor(Math.random() * 50000) + 5000,
    vaccinated: Math.floor(Math.random() * 20000000) + 5000000,
    population: Math.floor(Math.random() * 30000000) + 5000000,
  }))
}

function generateIndiaStates(): StateData[] {
  const states = ['Maharashtra', 'Kerala', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Delhi', 'West Bengal']
  return states.map(state => ({
    state,
    totalCases: Math.floor(Math.random() * 5000000) + 1000000,
    activeCases: Math.floor(Math.random() * 200000) + 50000,
    recovered: Math.floor(Math.random() * 4500000) + 900000,
    deaths: Math.floor(Math.random() * 100000) + 10000,
    vaccinated: Math.floor(Math.random() * 50000000) + 10000000,
    population: Math.floor(Math.random() * 100000000) + 20000000,
  }))
}

function getCountryCoordinates(country: string): { lat: number; lng: number } {
  const coords: { [key: string]: { lat: number; lng: number } } = {
    'United States': { lat: 37.0902, lng: -95.7129 },
    'India': { lat: 20.5937, lng: 78.9629 },
    'Brazil': { lat: -14.2350, lng: -51.9253 },
    'United Kingdom': { lat: 55.3781, lng: -3.4360 },
    'Russia': { lat: 61.5240, lng: 105.3188 },
    'France': { lat: 46.2276, lng: 2.2137 },
    'Germany': { lat: 51.1657, lng: 10.4515 },
    'Italy': { lat: 41.8719, lng: 12.5674 },
    'Spain': { lat: 40.4637, lng: -3.7492 },
    'Canada': { lat: 56.1304, lng: -106.3468 },
  }
  return coords[country] || { lat: 0, lng: 0 }
}
