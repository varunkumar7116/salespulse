import { create } from "zustand";
import { SalesRecord, SalesKpis, SalesFilters, Invoice } from "../types";

// Seed initial transactions representing typical corporate data
const INITIAL_SALES: SalesRecord[] = [
  {
    id: "tx_101",
    transactionId: "TX-2026-0001",
    customerId: "cust_301",
    customerName: "Acme Corporation",
    productId: "prod_001",
    productName: "SalesPulse Analytics Pro",
    category: "Software",
    quantity: 5,
    unitPrice: 1200,
    totalAmount: 6000,
    discount: 0.1,
    netAmount: 5400,
    costOfGoodsSold: 800,
    profit: 4600,
    margin: 0.85,
    region: "North America",
    country: "United States",
    city: "San Francisco",
    salesChannel: "direct",
    status: "completed",
    transactionDate: "2026-06-15T10:30:00Z",
    createdAt: "2026-06-15T10:30:00Z",
  },
  {
    id: "tx_102",
    transactionId: "TX-2026-0002",
    customerId: "cust_302",
    customerName: "Global Retail Systems",
    productId: "prod_002",
    productName: "Enterprise Integration Hub",
    category: "Infrastructure",
    quantity: 1,
    unitPrice: 15000,
    totalAmount: 15000,
    discount: 0.0,
    netAmount: 15000,
    costOfGoodsSold: 3500,
    profit: 11500,
    margin: 0.76,
    region: "Europe",
    country: "Germany",
    city: "Berlin",
    salesChannel: "wholesale",
    status: "completed",
    transactionDate: "2026-06-18T14:15:00Z",
    createdAt: "2026-06-18T14:15:00Z",
  },
  {
    id: "tx_103",
    transactionId: "TX-2026-0003",
    customerId: "cust_303",
    customerName: "Apex Digital Solutions",
    productId: "prod_003",
    productName: "Real-time Forecasting Engine",
    category: "AI & ML",
    quantity: 2,
    unitPrice: 4500,
    totalAmount: 9000,
    discount: 0.15,
    netAmount: 7650,
    costOfGoodsSold: 1200,
    profit: 6450,
    margin: 0.84,
    region: "Asia Pacific",
    country: "Singapore",
    city: "Singapore",
    salesChannel: "partner",
    status: "completed",
    transactionDate: "2026-06-20T08:45:00Z",
    createdAt: "2026-06-20T08:45:00Z",
  },
  {
    id: "tx_104",
    transactionId: "TX-2026-0004",
    customerId: "cust_304",
    customerName: "Nova Laboratories",
    productId: "prod_001",
    productName: "SalesPulse Analytics Pro",
    category: "Software",
    quantity: 10,
    unitPrice: 1200,
    totalAmount: 12000,
    discount: 0.05,
    netAmount: 11400,
    costOfGoodsSold: 1600,
    profit: 9800,
    margin: 0.85,
    region: "North America",
    country: "Canada",
    city: "Toronto",
    salesChannel: "direct",
    status: "completed",
    transactionDate: "2026-06-25T11:20:00Z",
    createdAt: "2026-06-25T11:20:00Z",
  },
  {
    id: "tx_105",
    transactionId: "TX-2026-0005",
    customerId: "cust_305",
    customerName: "Zenith Retail",
    productId: "prod_004",
    productName: "Inventory Tracking Tool",
    category: "Hardware",
    quantity: 50,
    unitPrice: 150,
    totalAmount: 7500,
    discount: 0.2,
    netAmount: 6000,
    costOfGoodsSold: 4000,
    profit: 2000,
    margin: 0.33,
    region: "Latin America",
    country: "Brazil",
    city: "Sao Paulo",
    salesChannel: "online",
    status: "completed",
    transactionDate: "2026-06-28T16:00:00Z",
    createdAt: "2026-06-28T16:00:00Z",
  },
  {
    id: "tx_106",
    transactionId: "TX-2026-0006",
    customerId: "cust_306",
    customerName: "Integra Systems",
    productId: "prod_003",
    productName: "Real-time Forecasting Engine",
    category: "AI & ML",
    quantity: 1,
    unitPrice: 4500,
    totalAmount: 4500,
    discount: 0.0,
    netAmount: 4500,
    costOfGoodsSold: 600,
    profit: 3900,
    margin: 0.86,
    region: "Europe",
    country: "United Kingdom",
    city: "London",
    salesChannel: "direct",
    status: "completed",
    transactionDate: "2026-07-02T09:10:00Z",
    createdAt: "2026-07-02T09:10:00Z",
  },
  {
    id: "tx_107",
    transactionId: "TX-2026-0007",
    customerId: "cust_307",
    customerName: "Starlight Media",
    productId: "prod_005",
    productName: "Notification Cloud API",
    category: "Infrastructure",
    quantity: 150,
    unitPrice: 20,
    totalAmount: 3000,
    discount: 0.1,
    netAmount: 2700,
    costOfGoodsSold: 500,
    profit: 2200,
    margin: 0.81,
    region: "North America",
    country: "United States",
    city: "New York",
    salesChannel: "online",
    status: "completed",
    transactionDate: "2026-07-05T13:40:00Z",
    createdAt: "2026-07-05T13:40:00Z",
  },
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv_201",
    invoiceNumber: "INV-2026-0001",
    customerId: "cust_301",
    customerName: "Acme Corporation",
    customerEmail: "billing@acme.com",
    billingAddress: {
      street: "100 California St",
      city: "San Francisco",
      state: "CA",
      postalCode: "94111",
      country: "United States",
    },
    issueDate: "2026-06-15",
    dueDate: "2026-07-15",
    status: "paid",
    subtotal: 6000,
    taxAmount: 480,
    discountAmount: 600,
    totalAmount: 5880,
    paymentMethod: "ach",
    paymentDate: "2026-06-15",
    items: [
      {
        id: "item_201_1",
        productId: "prod_001",
        productName: "SalesPulse Analytics Pro",
        quantity: 5,
        unitPrice: 1200,
        totalPrice: 6000,
      },
    ],
  },
  {
    id: "inv_202",
    invoiceNumber: "INV-2026-0002",
    customerId: "cust_302",
    customerName: "Global Retail Systems",
    customerEmail: "finance@globalretail.de",
    billingAddress: {
      street: "Friedrichstraße 95",
      city: "Berlin",
      state: "Berlin",
      postalCode: "10117",
      country: "Germany",
    },
    issueDate: "2026-06-18",
    dueDate: "2026-07-18",
    status: "paid",
    subtotal: 15000,
    taxAmount: 2850,
    discountAmount: 0,
    totalAmount: 17850,
    paymentMethod: "wire_transfer",
    paymentDate: "2026-06-20",
    items: [
      {
        id: "item_202_1",
        productId: "prod_002",
        productName: "Enterprise Integration Hub",
        quantity: 1,
        unitPrice: 15000,
        totalPrice: 15000,
      },
    ],
  },
  {
    id: "inv_203",
    invoiceNumber: "INV-2026-0003",
    customerId: "cust_303",
    customerName: "Apex Digital Solutions",
    customerEmail: "accounts@apexdigital.sg",
    billingAddress: {
      street: "8 Marina View",
      city: "Singapore",
      state: "Singapore",
      postalCode: "018960",
      country: "Singapore",
    },
    issueDate: "2026-06-20",
    dueDate: "2026-07-20",
    status: "unpaid",
    subtotal: 9000,
    taxAmount: 630,
    discountAmount: 1350,
    totalAmount: 8280,
    paymentMethod: "wire_transfer",
    items: [
      {
        id: "item_203_1",
        productId: "prod_003",
        productName: "Real-time Forecasting Engine",
        quantity: 2,
        unitPrice: 4500,
        totalPrice: 9000,
      },
    ],
  },
];

// Helper to compute KPIs dynamically based on sales records
function calculateSalesKpis(records: SalesRecord[]): SalesKpis {
  const totalRevenue = records.reduce((sum, r) => sum + r.netAmount, 0);
  const totalProfit = records.reduce((sum, r) => sum + r.profit, 0);
  const totalOrders = records.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Set reasonable growths for mock visualization
  return {
    totalRevenue,
    revenueGrowth: 14.8,
    totalProfit,
    profitGrowth: 16.2,
    totalOrders,
    ordersGrowth: 8.5,
    averageOrderValue,
    aovGrowth: 5.8,
    conversionRate: 3.42,
    conversionGrowth: 1.2,
  };
}

interface SalesState {
  salesRecords: SalesRecord[];
  kpis: SalesKpis;
  invoices: Invoice[];
  filters: SalesFilters;
  uploadSales: (newRecords: SalesRecord[]) => void;
  setFilters: (filters: Partial<SalesFilters>) => void;
  resetFilters: () => void;
  deleteRecord: (id: string) => void;
  addInvoice: (invoice: Invoice) => void;
}

export const useSalesStore = create<SalesState>((set) => ({
  salesRecords: INITIAL_SALES,
  kpis: calculateSalesKpis(INITIAL_SALES),
  invoices: INITIAL_INVOICES,
  filters: {
    page: 1,
    limit: 50,
  },

  uploadSales: (newRecords) =>
    set((state) => {
      const updatedRecords = [...newRecords, ...state.salesRecords];
      return {
        salesRecords: updatedRecords,
        kpis: calculateSalesKpis(updatedRecords),
      };
    }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () =>
    set({
      filters: {
        page: 1,
        limit: 50,
      },
    }),

  deleteRecord: (id) =>
    set((state) => {
      const updatedRecords = state.salesRecords.filter((r) => r.id !== id);
      return {
        salesRecords: updatedRecords,
        kpis: calculateSalesKpis(updatedRecords),
      };
    }),

  addInvoice: (invoice) =>
    set((state) => ({
      invoices: [invoice, ...state.invoices],
    })),
}));
