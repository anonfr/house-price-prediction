// Simple house price prediction model

type HouseData = {
  bedrooms: number
  bathrooms: number
  floors: number
  yearBuilt: number
  squareFeet: number
  location: string
  futureYears: number
}

// Base price coefficients (simplified model for Indian market)
const BASE_PRICE = 5000000 // 50 lakhs base price
const BEDROOM_VALUE = 1000000 // 10 lakhs per bedroom
const BATHROOM_VALUE = 500000 // 5 lakhs per bathroom
const FLOOR_VALUE = 300000 // 3 lakhs per floor
const SQFT_VALUE = 3000 // 3000 rupees per sqft
const LOCATION_MULTIPLIERS = {
  urban: 1.5,
  suburban: 1.0,
  rural: 0.7,
}

// Age depreciation factor (older houses are worth less)
const AGE_DEPRECIATION = 50000 // per year

// Future appreciation rate (per year)
const ANNUAL_APPRECIATION_RATE = 0.05 // 5% annual appreciation for Indian real estate

export async function predictHousePrice(
  data: HouseData,
): Promise<{ currentPrice: number; futurePrice: number; futureYears: number }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Calculate base price based on features
  let price = BASE_PRICE
  price += data.bedrooms * BEDROOM_VALUE
  price += data.bathrooms * BATHROOM_VALUE
  price += data.floors * FLOOR_VALUE
  price += data.squareFeet * SQFT_VALUE

  // Apply location multiplier
  const locationMultiplier = LOCATION_MULTIPLIERS[data.location as keyof typeof LOCATION_MULTIPLIERS] || 1.0
  price *= locationMultiplier

  // Apply age depreciation
  const currentYear = new Date().getFullYear()
  const ageInYears = currentYear - data.yearBuilt
  price -= ageInYears * AGE_DEPRECIATION

  // Add some randomness to make predictions more realistic (±5%)
  const randomFactor = 0.95 + Math.random() * 0.1
  price *= randomFactor

  // Ensure minimum price
  price = Math.max(price, 2000000) // 20 lakhs minimum

  // Round to nearest lakh (100,000)
  const currentPrice = Math.round(price / 100000) * 100000

  // Calculate future price based on selected years
  const futureYears = data.futureYears || 5 // Default to 5 years if not specified
  const futurePrice = Math.round((currentPrice * Math.pow(1 + ANNUAL_APPRECIATION_RATE, futureYears)) / 100000) * 100000

  return {
    currentPrice,
    futurePrice,
    futureYears,
  }
}

