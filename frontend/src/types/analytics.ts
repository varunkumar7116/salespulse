export interface ForecastPoint {
  date: string;
  actual?: number;
  predicted: number;
  confidenceLower: number;
  confidenceUpper: number;
}

export interface TrendPoint {
  date: string;
  revenue: number;
  profit: number;
  orders: number;
}

export interface SalesByCategory {
  category: string;
  revenue: number;
  profit: number;
  percentage: number;
}

export interface RegionalSales {
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  revenue: number;
  salesVolume: number;
}

export interface SeasonalityIndex {
  period: string; // e.g. "January" or "Q1" or "Monday"
  indexValue: number; // e.g. 1.2 for 20% higher than average
}

export interface AnalyticsKpiSummary {
  revenue: number;
  revenueChange: number;
  profit: number;
  profitChange: number;
  orders: number;
  ordersChange: number;
  averageMargin: number;
  averageMarginChange: number;
}
