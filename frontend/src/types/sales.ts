export type PaymentMethod = "credit_card" | "wire_transfer" | "paypal" | "ach" | "stripe";
export type TransactionStatus = "completed" | "pending" | "failed" | "refunded";
export type InvoiceStatus = "paid" | "unpaid" | "overdue" | "draft" | "cancelled";

export interface SalesRecord {
  id: string;
  transactionId: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  discount: number; // Percentage, e.g., 0.15 for 15%
  netAmount: number;
  costOfGoodsSold: number;
  profit: number;
  margin: number; // Percentage, e.g., 0.42 for 42%
  region: string;
  country: string;
  city: string;
  salesChannel: "online" | "direct" | "partner" | "wholesale";
  status: TransactionStatus;
  notes?: string;
  transactionDate: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentDate?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SalesKpis {
  totalRevenue: number;
  revenueGrowth: number; // Percentage
  totalProfit: number;
  profitGrowth: number; // Percentage
  totalOrders: number;
  ordersGrowth: number; // Percentage
  averageOrderValue: number;
  aovGrowth: number; // Percentage
  conversionRate: number;
  conversionGrowth: number; // Percentage
}

export interface SalesFilters extends BaseQueryFilters {
  status?: TransactionStatus;
  category?: string;
  region?: string;
  salesChannel?: string;
  minAmount?: number;
  maxAmount?: number;
}

import { BaseQueryFilters } from "./api";
