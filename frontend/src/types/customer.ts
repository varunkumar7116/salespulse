export type CustomerSegment = "enterprise" | "mid_market" | "smb" | "high_value" | "at_risk" | "churned";

export interface Customer {
  id: string;
  name: string;
  email: string;
  companyName: string;
  phone?: string;
  segment: CustomerSegment;
  status: "active" | "inactive";
  lifetimeValue: number;
  totalOrders: number;
  averageOrderValue: number;
  lastPurchaseDate: string;
  riskScore: number; // 0 to 100
  churnProbability: number; // Percentage, e.g. 0.25
  createdAt: string;
  updatedAt: string;
}

export interface CustomerGrowthMetric {
  date: string;
  newCustomers: number;
  activeCustomers: number;
  churnedCustomers: number;
  netGrowth: number;
}

export interface CustomerAnalyticsSummary {
  totalCustomers: number;
  newCustomersThisMonth: number;
  growthRate: number; // Percentage
  averageClv: number;
  churnRate: number; // Percentage
  retentionRate: number; // Percentage
  segmentsBreakdown: Record<CustomerSegment, { count: number; revenue: number }>;
}
