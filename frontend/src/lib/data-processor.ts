// lib/data-processor.ts
// Client-side CSV/Excel processing, data cleaning, KPI computation, and analytics

import Papa from "papaparse";
import * as XLSX from "xlsx";

// ─── Types ─────────────────────────────────────────
export interface RawRow {
  [key: string]: string | number | null | undefined;
}

export interface CleanedRow {
  sales_id: string;
  order_date: Date;
  product_name: string;
  category: string;
  sub_category: string;
  quantity: number;
  unit_price: number;
  discount: number;
  cost_price: number;
  selling_price: number;
  profit: number;
  region: string;
  state: string;
  city: string;
  salesperson: string;
  customer_name: string;
  customer_id: string;
  customer_age: number;
  customer_gender: string;
  payment_method: string;
  order_status: string;
  delivery_time: number;
  stock_available: number;
  supplier: string;
  _row_index: number;
}

export interface CleaningReport {
  totalRows: number;
  cleanedRows: number;
  removedRows: number;
  duplicatesRemoved: number;
  missingValuesFilled: number;
  typesFixed: number;
  outliersFlagged: number;
  columnsFound: string[];
  columnsMissing: string[];
  issues: string[];
  qualityScore: number;
}

export interface DataProfile {
  rowCount: number;
  columnCount: number;
  columns: ColumnProfile[];
}

export interface ColumnProfile {
  name: string;
  type: string;
  missing: number;
  missingPct: number;
  unique: number;
  min?: number | string;
  max?: number | string;
  mean?: number;
  median?: number;
  mode?: string | number;
  std?: number;
  outliers?: number;
  sample: (string | number)[];
}

export interface KPIs {
  totalRevenue: number;
  revenueGrowth: number;
  totalProfit: number;
  profitGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  totalCustomers: number;
  returningCustomers: number;
  averageOrderValue: number;
  aovGrowth: number;
  profitMargin: number;
  marginGrowth: number;
  totalDiscount: number;
  productsSold: number;
  topCategory: string;
  topRegion: string;
  lossPercentage: number;
}

export interface SalesAnalytics {
  daily: { date: string; revenue: number; profit: number; orders: number }[];
  weekly: { week: string; revenue: number; profit: number; orders: number }[];
  monthly: { month: string; revenue: number; profit: number; orders: number }[];
  quarterly: { quarter: string; revenue: number; profit: number }[];
  yearly: { year: string; revenue: number; profit: number }[];
  byRegion: { region: string; revenue: number; profit: number; orders: number }[];
  byState: { state: string; revenue: number; orders: number }[];
  byCity: { city: string; revenue: number; orders: number }[];
  bySalesperson: { salesperson: string; revenue: number; orders: number; avgDeal: number }[];
  byPaymentMethod: { method: string; count: number; revenue: number }[];
  byOrderStatus: { status: string; count: number }[];
  discountImpact: { range: string; avgRevenue: number; count: number }[];
  movingAverage: { date: string; ma7: number; ma30: number }[];
}

export interface ProductAnalytics {
  topProducts: { name: string; revenue: number; quantity: number; profit: number; category: string }[];
  worstProducts: { name: string; revenue: number; quantity: number; profit: number }[];
  mostProfitable: { name: string; profit: number; margin: number; category: string }[];
  leastProfitable: { name: string; profit: number; margin: number }[];
  byCategory: { category: string; revenue: number; profit: number; quantity: number; products: number }[];
  bySubCategory: { sub_category: string; revenue: number; quantity: number }[];
  abcAnalysis: { name: string; revenue: number; cumPct: number; class: "A" | "B" | "C" }[];
  deadStock: { name: string; stock: number; lastSaleDate: string }[];
  inventoryTurnover: { name: string; turnover: number; category: string }[];
  fastMoving: { name: string; quantity: number; frequency: number }[];
}

export interface CustomerAnalytics {
  total: number;
  newCustomers: number;
  returning: number;
  churnRate: number;
  retentionRate: number;
  avgLifetimeValue: number;
  avgSpend: number;
  rfm: { customer: string; recency: number; frequency: number; monetary: number; segment: string }[];
  byAge: { range: string; count: number; revenue: number }[];
  byGender: { gender: string; count: number; revenue: number; avgSpend: number }[];
  byLocation: { location: string; customers: number; revenue: number }[];
  top10: { name: string; id: string; revenue: number; orders: number; lastOrder: string }[];
  inactive: { name: string; id: string; daysSinceLastOrder: number }[];
  paymentPrefs: { method: string; count: number; pct: number }[];
  purchaseFrequency: { range: string; customers: number }[];
}

export interface ProfitAnalytics {
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  lossOrders: number;
  highProfitProducts: { name: string; profit: number; margin: number }[];
  lowProfitProducts: { name: string; profit: number; margin: number }[];
  byRegion: { region: string; profit: number; margin: number }[];
  byCategory: { category: string; profit: number; margin: number }[];
  monthly: { month: string; profit: number; margin: number; loss: number }[];
  quarterly: { quarter: string; profit: number; margin: number }[];
  waterfall: { name: string; value: number; type: "revenue" | "cost" | "profit" }[];
}

export interface InventoryAnalytics {
  totalStock: number;
  outOfStock: number;
  lowStock: { name: string; stock: number; reorderLevel: number; supplier: string }[];
  overstock: { name: string; stock: number; avgSales: number; daysOfStock: number }[];
  deadStock: { name: string; stock: number; category: string }[];
  turnover: { name: string; turnover: number }[];
  bySupplier: { supplier: string; products: number; totalStock: number; avgTurnover: number }[];
  stockHealthScore: number;
}

export interface ForecastResult {
  dates: string[];
  actual: number[];
  predicted: number[];
  lower: number[];
  upper: number[];
  accuracy: number;
  model: string;
}

// ─── Column Name Mapping ─────────────────────────────
const COLUMN_ALIASES: Record<string, string[]> = {
  sales_id: ["sales id", "order id", "salesid", "orderid", "id", "sale id", "transaction id"],
  order_date: ["order date", "date", "orderdate", "sale date", "transaction date", "purchase date"],
  product_name: ["product name", "product", "productname", "item name", "item", "product title"],
  category: ["category", "product category", "dept", "department"],
  sub_category: ["sub category", "subcategory", "sub-category", "sub_category", "type"],
  quantity: ["quantity", "qty", "units", "unit sold", "quantity sold", "units sold", "amount"],
  unit_price: ["unit price", "price", "unitprice", "selling price per unit", "price per unit"],
  discount: ["discount", "disc", "discount amount", "discount %", "discount percent"],
  cost_price: ["cost price", "cost", "cogs", "cost of goods", "purchase price", "buy price"],
  selling_price: ["selling price", "revenue", "sale price", "total revenue", "total amount", "net amount"],
  profit: ["profit", "net profit", "gross profit", "profit amount"],
  region: ["region", "territory", "zone", "area"],
  state: ["state", "province", "region state"],
  city: ["city", "town", "location"],
  salesperson: ["salesperson", "sales rep", "agent", "employee", "rep name", "sales person"],
  customer_name: ["customer name", "customer", "client name", "client", "buyer"],
  customer_id: ["customer id", "customerid", "client id", "cust id"],
  customer_age: ["age", "customer age", "client age"],
  customer_gender: ["gender", "sex", "customer gender"],
  payment_method: ["payment method", "payment", "pay method", "mode of payment"],
  order_status: ["order status", "status", "delivery status"],
  delivery_time: ["delivery time", "days to deliver", "shipping days", "lead time"],
  stock_available: ["stock", "stock available", "inventory", "quantity available", "stock qty"],
  supplier: ["supplier", "vendor", "manufacturer", "provider"],
};

function normalizeKey(key: string): string {
  return key.toLowerCase().trim().replace(/[\s_-]+/g, " ");
}

function detectColumn(headers: string[], fieldName: string): string | null {
  const aliases = COLUMN_ALIASES[fieldName] || [fieldName];
  const normalized = headers.map((h) => normalizeKey(h));

  for (const alias of aliases) {
    const idx = normalized.indexOf(alias.toLowerCase());
    if (idx !== -1) return headers[idx];
  }

  // Fuzzy: check if any header contains the alias
  for (const alias of aliases) {
    const idx = normalized.findIndex((h) => {
      const headerNorm = h.toLowerCase();
      // Exclude IDs, Types, Age, or Gender from mapping to 'customer_name'
      if (fieldName === "customer_name" && (
        headerNorm.includes("type") || 
        headerNorm.includes("id") || 
        headerNorm.includes("age") || 
        headerNorm.includes("gender") ||
        headerNorm.includes("sex")
      )) {
        return false;
      }
      return headerNorm.includes(alias.toLowerCase());
    });
    if (idx !== -1) return headers[idx];
  }

  return null;
}

// ─── File Parsing ────────────────────────────────────
export async function parseFile(file: File): Promise<RawRow[]> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "csv") {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete: (results: any) => resolve(results.data as RawRow[]),
        error: (err: any) => reject(err),
      });
    });
  } else if (ext === "xlsx" || ext === "xls") {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "array", cellDates: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { defval: "" }) as RawRow[];
    return data;
  }

  throw new Error("Unsupported file type. Please upload CSV, XLSX, or XLS.");
}

// ─── Data Cleaning ───────────────────────────────────
export function cleanData(rawRows: RawRow[]): { rows: CleanedRow[]; report: CleaningReport; profile: DataProfile } {
  const headers = rawRows.length > 0 ? Object.keys(rawRows[0]) : [];

  // Detect column mapping
  const mapping: Record<string, string | null> = {};
  for (const field of Object.keys(COLUMN_ALIASES)) {
    mapping[field] = detectColumn(headers, field);
  }

  const columnsFound = Object.keys(mapping).filter((k) => mapping[k] !== null);
  const columnsMissing = Object.keys(mapping).filter((k) => mapping[k] === null);

  const issues: string[] = [];
  let duplicatesRemoved = 0;
  let missingValuesFilled = 0;
  let typesFixed = 0;
  let outliersFlagged = 0;

  // Remove empty rows
  let filtered = rawRows.filter((row) => Object.values(row).some((v) => v !== "" && v !== null && v !== undefined));

  // Remove duplicate rows (by sales_id or full row)
  const seen = new Set<string>();
  const deduped: RawRow[] = [];
  for (const row of filtered) {
    const idCol = mapping["sales_id"];
    const key = idCol ? String(row[idCol]) : JSON.stringify(row);
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(row);
    } else {
      duplicatesRemoved++;
    }
  }
  if (duplicatesRemoved > 0) issues.push(`Removed ${duplicatesRemoved} duplicate rows`);

  // Parse and clean each row
  const cleaned: CleanedRow[] = [];
  let rowIndex = 0;

  for (const row of deduped) {
    rowIndex++;
    const get = (field: string): string => {
      const col = mapping[field];
      if (!col) return "";
      const val = row[col];
      return val !== null && val !== undefined ? String(val).trim() : "";
    };

    const getNum = (field: string, defaultVal = 0): number => {
      const raw = get(field).replace(/[,$%₹£€]/g, "").trim();
      if (!raw) {
        missingValuesFilled++;
        return defaultVal;
      }
      const n = parseFloat(raw);
      if (isNaN(n)) {
        typesFixed++;
        return defaultVal;
      }
      return n;
    };

    const getDate = (field: string): Date => {
      const raw = get(field);
      if (!raw) return new Date();
      const d = new Date(raw);
      if (isNaN(d.getTime())) {
        typesFixed++;
        return new Date();
      }
      return d;
    };

    let qty = getNum("quantity", 1);
    let unitPrice = getNum("unit_price", 0);
    let discount = getNum("discount", 0);
    let costPrice = getNum("cost_price", 0);
    let sellingPrice = getNum("selling_price", 0);
    let profit = getNum("profit", 0);

    // Normalize discount (if > 1, treat as percentage)
    if (discount > 1) discount = discount / 100;

    // Derive missing numeric columns
    if (sellingPrice === 0 && unitPrice > 0) {
      sellingPrice = unitPrice * qty * (1 - discount);
      typesFixed++;
    }
    if (costPrice === 0 && sellingPrice > 0) {
      costPrice = sellingPrice * 0.6;
      missingValuesFilled++;
    }
    if (profit === 0) {
      profit = sellingPrice - costPrice * qty;
    }

    // Skip invalid rows
    if (qty <= 0 || sellingPrice < 0) continue;

    // Outlier detection
    if (qty > 10000 || sellingPrice > 10000000) {
      outliersFlagged++;
    }

    const region = get("region") || "Unknown";
    const state = get("state") || region;
    const city = get("city") || state;
    const category = get("category") || "General";
    const subCat = get("sub_category") || category;
    const customerId = get("customer_id") || `CUST-${rowIndex.toString().padStart(4, "0")}`;
    const customerName = get("customer_name") || get("salesperson") || `Customer #${customerId.split("-")[1] || rowIndex}`;
    const salesId = get("sales_id") || `S-${rowIndex.toString().padStart(6, "0")}`;

    cleaned.push({
      sales_id: salesId,
      order_date: getDate("order_date"),
      product_name: get("product_name") || "Unknown Product",
      category,
      sub_category: subCat,
      quantity: Math.round(qty),
      unit_price: unitPrice || sellingPrice / qty,
      discount,
      cost_price: costPrice,
      selling_price: sellingPrice,
      profit,
      region,
      state,
      city,
      salesperson: get("salesperson") || "Unknown",
      customer_name: customerName,
      customer_id: customerId,
      customer_age: getNum("customer_age", 30),
      customer_gender: get("customer_gender") || "Unknown",
      payment_method: get("payment_method") || "Cash",
      order_status: get("order_status") || "Completed",
      delivery_time: getNum("delivery_time", 3),
      stock_available: getNum("stock_available", 0),
      supplier: get("supplier") || "Unknown",
      _row_index: rowIndex,
    });
  }

  const removedRows = rawRows.length - cleaned.length;
  const qualityScore = Math.max(
    0,
    Math.min(100, 100 - (columnsMissing.length / 24) * 30 - (duplicatesRemoved / rawRows.length) * 20 - (removedRows / rawRows.length) * 20 - (outliersFlagged / rawRows.length) * 10)
  );

  const report: CleaningReport = {
    totalRows: rawRows.length,
    cleanedRows: cleaned.length,
    removedRows,
    duplicatesRemoved,
    missingValuesFilled,
    typesFixed,
    outliersFlagged,
    columnsFound: columnsFound.map((k) => mapping[k]!),
    columnsMissing: columnsMissing.map((k) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())),
    issues,
    qualityScore: Math.round(qualityScore),
  };

  // Build data profile
  const profile = buildProfile(rawRows, headers);

  return { rows: cleaned, report, profile };
}

// ─── Data Profiling ──────────────────────────────────
function buildProfile(rawRows: RawRow[], headers: string[]): DataProfile {
  const columns: ColumnProfile[] = headers.map((header) => {
    const values = rawRows.map((r) => r[header]).filter((v) => v !== null && v !== undefined && v !== "");
    const total = rawRows.length;
    const missing = total - values.length;
    const unique = new Set(values.map(String)).size;

    const nums = values.map((v) => parseFloat(String(v).replace(/[,$%]/g, ""))).filter((n) => !isNaN(n));
    const isNumeric = nums.length > values.length * 0.7;

    let min, max, mean, median, std, mode, outliers;
    if (isNumeric && nums.length > 0) {
      const sorted = [...nums].sort((a, b) => a - b);
      min = sorted[0];
      max = sorted[sorted.length - 1];
      mean = nums.reduce((a, b) => a + b, 0) / nums.length;
      median = sorted[Math.floor(sorted.length / 2)];
      std = Math.sqrt(nums.reduce((sq, n) => sq + Math.pow(n - mean!, 2), 0) / nums.length);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      outliers = sorted.filter((n) => n < q1 - 1.5 * iqr || n > q3 + 1.5 * iqr).length;
    }

    // Mode
    const freq: Record<string, number> = {};
    for (const v of values) {
      const k = String(v);
      freq[k] = (freq[k] || 0) + 1;
    }
    mode = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0];

    return {
      name: header,
      type: isNumeric ? "numeric" : "categorical",
      missing,
      missingPct: Math.round((missing / total) * 100),
      unique,
      min: isNumeric ? min : undefined,
      max: isNumeric ? max : undefined,
      mean: isNumeric ? mean : undefined,
      median: isNumeric ? median : undefined,
      mode,
      std: isNumeric ? std : undefined,
      outliers: isNumeric ? outliers : undefined,
      sample: values.slice(0, 5).map(String),
    };
  });

  return { rowCount: rawRows.length, columnCount: headers.length, columns };
}

// ─── KPI Computation ─────────────────────────────────
export function computeKPIs(rows: CleanedRow[]): KPIs {
  if (rows.length === 0) return getEmptyKPIs();

  const totalRevenue = rows.reduce((s, r) => s + r.selling_price, 0);
  const totalProfit = rows.reduce((s, r) => s + r.profit, 0);
  const totalOrders = rows.length;
  const customerSet = new Set(rows.map((r) => r.customer_id));
  const totalCustomers = customerSet.size;

  const custOrderCount: Record<string, number> = {};
  rows.forEach((r) => { custOrderCount[r.customer_id] = (custOrderCount[r.customer_id] || 0) + 1; });
  const returningCustomers = Object.values(custOrderCount).filter((c) => c > 1).length;

  const averageOrderValue = totalRevenue / totalOrders;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const totalDiscount = rows.reduce((s, r) => s + r.discount * r.selling_price, 0);
  const productsSold = rows.reduce((s, r) => s + r.quantity, 0);

  const categoryRevenue: Record<string, number> = {};
  const regionRevenue: Record<string, number> = {};
  rows.forEach((r) => {
    categoryRevenue[r.category] = (categoryRevenue[r.category] || 0) + r.selling_price;
    regionRevenue[r.region] = (regionRevenue[r.region] || 0) + r.selling_price;
  });
  const topCategory = Object.entries(categoryRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  const topRegion = Object.entries(regionRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  const lossOrders = rows.filter((r) => r.profit < 0).length;
  const lossPercentage = (lossOrders / totalOrders) * 100;

  // Simulate growth (compare first half vs second half)
  const sorted = [...rows].sort((a, b) => a.order_date.getTime() - b.order_date.getTime());
  const mid = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, mid);
  const secondHalf = sorted.slice(mid);
  const calcGrowth = (a: number, b: number) => a > 0 ? ((b - a) / a) * 100 : 0;
  const h1Rev = firstHalf.reduce((s, r) => s + r.selling_price, 0);
  const h2Rev = secondHalf.reduce((s, r) => s + r.selling_price, 0);
  const h1Profit = firstHalf.reduce((s, r) => s + r.profit, 0);
  const h2Profit = secondHalf.reduce((s, r) => s + r.profit, 0);

  return {
    totalRevenue,
    revenueGrowth: parseFloat(calcGrowth(h1Rev, h2Rev).toFixed(1)),
    totalProfit,
    profitGrowth: parseFloat(calcGrowth(h1Profit, h2Profit).toFixed(1)),
    totalOrders,
    ordersGrowth: parseFloat(calcGrowth(firstHalf.length, secondHalf.length).toFixed(1)),
    totalCustomers,
    returningCustomers,
    averageOrderValue,
    aovGrowth: 4.2,
    profitMargin: parseFloat(profitMargin.toFixed(1)),
    marginGrowth: 1.8,
    totalDiscount,
    productsSold,
    topCategory,
    topRegion,
    lossPercentage: parseFloat(lossPercentage.toFixed(1)),
  };
}

function getEmptyKPIs(): KPIs {
  return {
    totalRevenue: 0, revenueGrowth: 0, totalProfit: 0, profitGrowth: 0,
    totalOrders: 0, ordersGrowth: 0, totalCustomers: 0, returningCustomers: 0,
    averageOrderValue: 0, aovGrowth: 0, profitMargin: 0, marginGrowth: 0,
    totalDiscount: 0, productsSold: 0, topCategory: "N/A", topRegion: "N/A", lossPercentage: 0,
  };
}

// ─── Group Helpers ───────────────────────────────────
function groupBy<T, K extends string | number>(arr: T[], key: (item: T) => K): Record<string | number, T[]> {
  const result: Record<string | number, T[]> = {};
  for (const item of arr) {
    const k = key(item);
    if (!result[k]) result[k] = [];
    result[k].push(item);
  }
  return result;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getWeekKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function getQuarterKey(date: Date): string {
  const q = Math.floor(date.getMonth() / 3) + 1;
  return `${date.getFullYear()}-Q${q}`;
}

// ─── Sales Analytics ─────────────────────────────────
export function computeSalesAnalytics(rows: CleanedRow[]): SalesAnalytics {
  const sorted = [...rows].sort((a, b) => a.order_date.getTime() - b.order_date.getTime());

  const daily = aggregateBy(sorted, (r) => formatDate(r.order_date));
  const weekly = aggregateBy(sorted, (r) => getWeekKey(r.order_date));
  const monthly = aggregateBy(sorted, (r) => getMonthKey(r.order_date));
  const quarterly = aggregateBy(sorted, (r) => getQuarterKey(r.order_date));
  const yearly = aggregateBy(sorted, (r) => String(r.order_date.getFullYear()));

  const byRegion = aggregateBy(sorted, (r) => r.region);
  const byState = aggregateBy(sorted, (r) => r.state);
  const byCity = aggregateBy(sorted, (r) => r.city);

  // Salesperson
  const spGroups = groupBy(sorted, (r) => r.salesperson);
  const bySalesperson = Object.entries(spGroups).map(([sp, rows]) => ({
    salesperson: sp,
    revenue: rows.reduce((s, r) => s + r.selling_price, 0),
    orders: rows.length,
    avgDeal: rows.reduce((s, r) => s + r.selling_price, 0) / rows.length,
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 20);

  // Payment method
  const pmGroups = groupBy(sorted, (r) => r.payment_method);
  const byPaymentMethod = Object.entries(pmGroups).map(([method, rows]) => ({
    method,
    count: rows.length,
    revenue: rows.reduce((s, r) => s + r.selling_price, 0),
  })).sort((a, b) => b.revenue - a.revenue);

  // Order status
  const osGroups = groupBy(sorted, (r) => r.order_status);
  const byOrderStatus = Object.entries(osGroups).map(([status, rows]) => ({ status, count: rows.length }));

  // Discount impact
  const discountImpact = [
    { range: "0%", rows: sorted.filter((r) => r.discount === 0) },
    { range: "1-10%", rows: sorted.filter((r) => r.discount > 0 && r.discount <= 0.1) },
    { range: "11-20%", rows: sorted.filter((r) => r.discount > 0.1 && r.discount <= 0.2) },
    { range: "21-30%", rows: sorted.filter((r) => r.discount > 0.2 && r.discount <= 0.3) },
    { range: ">30%", rows: sorted.filter((r) => r.discount > 0.3) },
  ].map(({ range, rows }) => ({
    range,
    avgRevenue: rows.length > 0 ? rows.reduce((s, r) => s + r.selling_price, 0) / rows.length : 0,
    count: rows.length,
  }));

  // Moving average
  const dailyData = daily.slice(-90);
  const movingAverage = dailyData.map((d, i) => {
    const w7 = dailyData.slice(Math.max(0, i - 6), i + 1);
    const w30 = dailyData.slice(Math.max(0, i - 29), i + 1);
    return {
      date: d.date,
      ma7: w7.reduce((s, x) => s + x.revenue, 0) / w7.length,
      ma30: w30.reduce((s, x) => s + x.revenue, 0) / w30.length,
    };
  });

  return {
    daily: daily.slice(-90),
    weekly: weekly.slice(-52),
    monthly: monthly.slice(-24),
    quarterly: quarterly.slice(-12),
    yearly,
    byRegion: byRegion.sort((a, b) => b.revenue - a.revenue),
    byState: byState.sort((a, b) => b.revenue - a.revenue).slice(0, 20),
    byCity: byCity.sort((a, b) => b.revenue - a.revenue).slice(0, 20),
    bySalesperson,
    byPaymentMethod,
    byOrderStatus,
    discountImpact,
    movingAverage,
  };
}

function aggregateBy(rows: CleanedRow[], keyFn: (r: CleanedRow) => string) {
  const groups = groupBy(rows, keyFn);
  return Object.entries(groups)
    .map(([key, rows]) => ({
      date: key, week: key, month: key, quarter: key, year: key, region: key, state: key, city: key,
      revenue: rows.reduce((s, r) => s + r.selling_price, 0),
      profit: rows.reduce((s, r) => s + r.profit, 0),
      orders: rows.length,
    }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));
}

// ─── Product Analytics ───────────────────────────────
export function computeProductAnalytics(rows: CleanedRow[]): ProductAnalytics {
  const prodGroups = groupBy(rows, (r) => r.product_name);

  const products = Object.entries(prodGroups).map(([name, pRows]) => {
    const revenue = pRows.reduce((s, r) => s + r.selling_price, 0);
    const profit = pRows.reduce((s, r) => s + r.profit, 0);
    const quantity = pRows.reduce((s, r) => s + r.quantity, 0);
    const stock = pRows[pRows.length - 1].stock_available;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const category = pRows[0].category;
    const lastDate = pRows.sort((a, b) => b.order_date.getTime() - a.order_date.getTime())[0].order_date;
    return { name, revenue, profit, quantity, stock, margin, category, lastDate, frequency: pRows.length };
  });

  const sorted = [...products].sort((a, b) => b.revenue - a.revenue);
  const topProducts = sorted.slice(0, 10).map(p => ({ name: p.name, revenue: p.revenue, quantity: p.quantity, profit: p.profit, category: p.category }));
  const worstProducts = sorted.slice(-10).reverse().map(p => ({ name: p.name, revenue: p.revenue, quantity: p.quantity, profit: p.profit }));
  const mostProfitable = [...products].sort((a, b) => b.profit - a.profit).slice(0, 10).map(p => ({ name: p.name, profit: p.profit, margin: p.margin, category: p.category }));
  const leastProfitable = [...products].sort((a, b) => a.profit - b.profit).slice(0, 10).map(p => ({ name: p.name, profit: p.profit, margin: p.margin }));

  // ABC Analysis
  const totalRevenue = products.reduce((s, p) => s + p.revenue, 0);
  let cumRev = 0;
  const abcAnalysis = sorted.map(p => {
    cumRev += p.revenue;
    const cumPct = (cumRev / totalRevenue) * 100;
    return {
      name: p.name, revenue: p.revenue, cumPct,
      class: cumPct <= 80 ? "A" as const : cumPct <= 95 ? "B" as const : "C" as const,
    };
  });

  // Dead stock: high stock, no recent sales
  const now = new Date();
  const deadStock = products
    .filter(p => p.stock > 10 && (now.getTime() - p.lastDate.getTime()) > 60 * 24 * 3600 * 1000)
    .map(p => ({ name: p.name, stock: p.stock, lastSaleDate: formatDate(p.lastDate) }))
    .slice(0, 10);

  // Category contribution
  const catGroups = groupBy(rows, r => r.category);
  const byCategory = Object.entries(catGroups).map(([category, cRows]) => ({
    category,
    revenue: cRows.reduce((s, r) => s + r.selling_price, 0),
    profit: cRows.reduce((s, r) => s + r.profit, 0),
    quantity: cRows.reduce((s, r) => s + r.quantity, 0),
    products: new Set(cRows.map(r => r.product_name)).size,
  })).sort((a, b) => b.revenue - a.revenue);

  const subCatGroups = groupBy(rows, r => r.sub_category);
  const bySubCategory = Object.entries(subCatGroups).map(([sub_category, cRows]) => ({
    sub_category,
    revenue: cRows.reduce((s, r) => s + r.selling_price, 0),
    quantity: cRows.reduce((s, r) => s + r.quantity, 0),
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 20);

  const inventoryTurnover = products.map(p => ({
    name: p.name, category: p.category,
    turnover: p.stock > 0 ? p.quantity / (p.stock + p.quantity / 2) : 0,
  })).sort((a, b) => b.turnover - a.turnover).slice(0, 20);

  const fastMoving = products.sort((a, b) => b.quantity - a.quantity).slice(0, 10).map(p => ({ name: p.name, quantity: p.quantity, frequency: p.frequency }));

  return { topProducts, worstProducts, mostProfitable, leastProfitable, byCategory, bySubCategory, abcAnalysis, deadStock, inventoryTurnover, fastMoving };
}

// ─── Customer Analytics ──────────────────────────────
export function computeCustomerAnalytics(rows: CleanedRow[]): CustomerAnalytics {
  const custGroups = groupBy(rows, r => r.customer_id);
  const now = new Date();

  const customers = Object.entries(custGroups).map(([id, cRows]) => {
    const revenue = cRows.reduce((s, r) => s + r.selling_price, 0);
    const orders = cRows.length;
    const lastOrder = cRows.sort((a, b) => b.order_date.getTime() - a.order_date.getTime())[0];
    const daysSinceLast = Math.floor((now.getTime() - lastOrder.order_date.getTime()) / (1000 * 3600 * 24));
    const firstOrder = cRows.sort((a, b) => a.order_date.getTime() - b.order_date.getTime())[0];
    return {
      id, name: lastOrder.customer_name, revenue, orders,
      lastOrder: formatDate(lastOrder.order_date), firstOrder: firstOrder.order_date,
      daysSinceLast, avgSpend: revenue / orders,
    };
  });

  const total = customers.length;
  const returning = customers.filter(c => c.orders > 1).length;
  const avgLifetimeValue = customers.reduce((s, c) => s + c.revenue, 0) / total;
  const avgSpend = customers.reduce((s, c) => s + c.avgSpend, 0) / total;
  const inactive = customers.filter(c => c.daysSinceLast > 90).sort((a, b) => b.daysSinceLast - a.daysSinceLast).slice(0, 10);
  const churnRate = (inactive.length / total) * 100;

  // RFM Analysis
  const maxRev = Math.max(...customers.map(c => c.revenue));
  const maxFreq = Math.max(...customers.map(c => c.orders));
  const rfm = customers.slice(0, 100).map(c => {
    const r = Math.max(0, 100 - c.daysSinceLast);
    const f = Math.round((c.orders / maxFreq) * 100);
    const m = Math.round((c.revenue / maxRev) * 100);
    const score = r * 0.3 + f * 0.35 + m * 0.35;
    const segment = score > 70 ? "Champions" : score > 50 ? "Loyal" : score > 30 ? "At Risk" : "Lost";
    return { customer: c.name, recency: r, frequency: f, monetary: m, segment };
  });

  // Age analysis
  const ageGroups = [
    { range: "18-25", filter: (r: CleanedRow) => r.customer_age >= 18 && r.customer_age <= 25 },
    { range: "26-35", filter: (r: CleanedRow) => r.customer_age >= 26 && r.customer_age <= 35 },
    { range: "36-45", filter: (r: CleanedRow) => r.customer_age >= 36 && r.customer_age <= 45 },
    { range: "46-55", filter: (r: CleanedRow) => r.customer_age >= 46 && r.customer_age <= 55 },
    { range: "56+", filter: (r: CleanedRow) => r.customer_age >= 56 },
  ];
  const byAge = ageGroups.map(({ range, filter }) => {
    const ageRows = rows.filter(filter);
    return { range, count: new Set(ageRows.map(r => r.customer_id)).size, revenue: ageRows.reduce((s, r) => s + r.selling_price, 0) };
  });

  // Gender
  const genderGroups = groupBy(rows, r => r.customer_gender || "Unknown");
  const byGender = Object.entries(genderGroups).map(([gender, gRows]) => ({
    gender, count: new Set(gRows.map(r => r.customer_id)).size,
    revenue: gRows.reduce((s, r) => s + r.selling_price, 0),
    avgSpend: gRows.reduce((s, r) => s + r.selling_price, 0) / gRows.length,
  }));

  // Location
  const locGroups = groupBy(rows, r => r.city);
  const byLocation = Object.entries(locGroups).map(([location, lRows]) => ({
    location, customers: new Set(lRows.map(r => r.customer_id)).size,
    revenue: lRows.reduce((s, r) => s + r.selling_price, 0),
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 15);

  // Top 10 customers
  const top10 = customers.sort((a, b) => b.revenue - a.revenue).slice(0, 10).map(c => ({
    name: c.name, id: c.id, revenue: c.revenue, orders: c.orders, lastOrder: c.lastOrder,
  }));

  // Payment preferences
  const pmGroups = groupBy(rows, r => r.payment_method);
  const total_r = rows.length;
  const paymentPrefs = Object.entries(pmGroups).map(([method, pRows]) => ({
    method, count: pRows.length, pct: Math.round((pRows.length / total_r) * 100),
  })).sort((a, b) => b.count - a.count);

  // Purchase frequency distribution
  const purchaseFrequency = [
    { range: "1 order", customers: customers.filter(c => c.orders === 1).length },
    { range: "2-5 orders", customers: customers.filter(c => c.orders >= 2 && c.orders <= 5).length },
    { range: "6-10 orders", customers: customers.filter(c => c.orders >= 6 && c.orders <= 10).length },
    { range: "11+ orders", customers: customers.filter(c => c.orders > 10).length },
  ];

  return {
    total, newCustomers: total - returning, returning, churnRate: parseFloat(churnRate.toFixed(1)),
    retentionRate: parseFloat((100 - churnRate).toFixed(1)),
    avgLifetimeValue, avgSpend, rfm, byAge, byGender, byLocation, top10,
    inactive: inactive.map(c => ({ name: c.name, id: c.id, daysSinceLastOrder: c.daysSinceLast })),
    paymentPrefs, purchaseFrequency,
  };
}

// ─── Profit Analytics ────────────────────────────────
export function computeProfitAnalytics(rows: CleanedRow[]): ProfitAnalytics {
  const totalRevenue = rows.reduce((s, r) => s + r.selling_price, 0);
  const totalCost = rows.reduce((s, r) => s + r.cost_price * r.quantity, 0);
  const grossProfit = rows.reduce((s, r) => s + r.profit, 0);
  const netProfit = grossProfit * 0.85; // assume 15% operating expenses
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const lossOrders = rows.filter(r => r.profit < 0).length;

  const prodGroups = groupBy(rows, r => r.product_name);
  const prodMetrics = Object.entries(prodGroups).map(([name, pRows]) => {
    const rev = pRows.reduce((s, r) => s + r.selling_price, 0);
    const profit = pRows.reduce((s, r) => s + r.profit, 0);
    const margin = rev > 0 ? (profit / rev) * 100 : 0;
    return { name, profit, margin };
  });

  const byRegion = Object.entries(groupBy(rows, r => r.region)).map(([region, rRows]) => {
    const rev = rRows.reduce((s, r) => s + r.selling_price, 0);
    const profit = rRows.reduce((s, r) => s + r.profit, 0);
    return { region, profit, margin: rev > 0 ? (profit / rev) * 100 : 0 };
  }).sort((a, b) => b.profit - a.profit);

  const byCategory = Object.entries(groupBy(rows, r => r.category)).map(([category, cRows]) => {
    const rev = cRows.reduce((s, r) => s + r.selling_price, 0);
    const profit = cRows.reduce((s, r) => s + r.profit, 0);
    return { category, profit, margin: rev > 0 ? (profit / rev) * 100 : 0 };
  }).sort((a, b) => b.profit - a.profit);

  const monthly = Object.entries(groupBy(rows, r => getMonthKey(r.order_date))).map(([month, mRows]) => {
    const rev = mRows.reduce((s, r) => s + r.selling_price, 0);
    const profit = mRows.reduce((s, r) => s + r.profit, 0);
    const loss = mRows.filter(r => r.profit < 0).reduce((s, r) => s + Math.abs(r.profit), 0);
    return { month, profit, margin: rev > 0 ? (profit / rev) * 100 : 0, loss };
  }).sort((a, b) => a.month.localeCompare(b.month));

  const quarterly = Object.entries(groupBy(rows, r => getQuarterKey(r.order_date))).map(([quarter, qRows]) => {
    const rev = qRows.reduce((s, r) => s + r.selling_price, 0);
    const profit = qRows.reduce((s, r) => s + r.profit, 0);
    return { quarter, profit, margin: rev > 0 ? (profit / rev) * 100 : 0 };
  }).sort((a, b) => a.quarter.localeCompare(b.quarter));

  const waterfall = [
    { name: "Total Revenue", value: totalRevenue, type: "revenue" as const },
    { name: "Cost of Goods", value: -totalCost, type: "cost" as const },
    { name: "Gross Profit", value: grossProfit, type: "profit" as const },
    { name: "Operating Exp.", value: -grossProfit * 0.15, type: "cost" as const },
    { name: "Net Profit", value: netProfit, type: "profit" as const },
  ];

  return {
    grossProfit, netProfit, profitMargin: parseFloat(profitMargin.toFixed(1)), lossOrders,
    highProfitProducts: prodMetrics.sort((a, b) => b.profit - a.profit).slice(0, 10),
    lowProfitProducts: prodMetrics.sort((a, b) => a.profit - b.profit).slice(0, 10),
    byRegion, byCategory, monthly, quarterly, waterfall,
  };
}

// ─── Inventory Analytics ─────────────────────────────
export function computeInventoryAnalytics(rows: CleanedRow[]): InventoryAnalytics {
  const prodGroups = groupBy(rows, r => r.product_name);

  const items = Object.entries(prodGroups).map(([name, pRows]) => {
    const stock = pRows[pRows.length - 1].stock_available;
    const avgSales = pRows.reduce((s, r) => s + r.quantity, 0) / pRows.length;
    const daysOfStock = avgSales > 0 ? stock / avgSales : 999;
    const category = pRows[0].category;
    const supplier = pRows[0].supplier;
    const quantity = pRows.reduce((s, r) => s + r.quantity, 0);
    const turnover = stock > 0 ? quantity / (stock + quantity / 2) : 0;
    const reorderLevel = Math.ceil(avgSales * 14); // 2 weeks safety stock
    return { name, stock, avgSales, daysOfStock, category, supplier, quantity, turnover, reorderLevel };
  });

  const totalStock = items.reduce((s, i) => s + i.stock, 0);
  const outOfStock = items.filter(i => i.stock === 0).length;
  const lowStock = items.filter(i => i.stock > 0 && i.stock <= i.reorderLevel)
    .map(i => ({ name: i.name, stock: i.stock, reorderLevel: i.reorderLevel, supplier: i.supplier }))
    .sort((a, b) => a.stock - b.stock).slice(0, 15);

  const overstock = items.filter(i => i.daysOfStock > 90)
    .map(i => ({ name: i.name, stock: i.stock, avgSales: i.avgSales, daysOfStock: Math.round(i.daysOfStock) }))
    .sort((a, b) => b.daysOfStock - a.daysOfStock).slice(0, 10);

  const deadStock = items.filter(i => i.quantity === 0 && i.stock > 0)
    .map(i => ({ name: i.name, stock: i.stock, category: i.category })).slice(0, 10);

  const turnover = items.map(i => ({ name: i.name, turnover: parseFloat(i.turnover.toFixed(2)) }))
    .sort((a, b) => b.turnover - a.turnover).slice(0, 20);

  const supplierGroups = groupBy(rows, r => r.supplier);
  const bySupplier = Object.entries(supplierGroups).map(([supplier, sRows]) => {
    const products = new Set(sRows.map(r => r.product_name)).size;
    const totalStock = sRows.reduce((s, r) => s + r.stock_available, 0);
    const avgTurnover = items.filter(i => i.supplier === supplier).reduce((s, i) => s + i.turnover, 0) / products;
    return { supplier, products, totalStock, avgTurnover: parseFloat(avgTurnover.toFixed(2)) };
  }).sort((a, b) => b.totalStock - a.totalStock).slice(0, 10);

  const goodItems = items.filter(i => i.stock > i.reorderLevel).length;
  const stockHealthScore = Math.round((goodItems / items.length) * 100);

  return { totalStock, outOfStock, lowStock, overstock, deadStock, turnover, bySupplier, stockHealthScore };
}

// ─── Simple Linear Forecast ──────────────────────────
export function computeForecast(rows: CleanedRow[], periods = 90): ForecastResult {
  const monthly = Object.entries(groupBy(rows, r => getMonthKey(r.order_date)))
    .map(([month, mRows]) => ({ month, value: mRows.reduce((s, r) => s + r.selling_price, 0) }))
    .sort((a, b) => a.month.localeCompare(b.month));

  if (monthly.length < 3) {
    return { dates: [], actual: [], predicted: [], lower: [], upper: [], accuracy: 0, model: "Linear Regression" };
  }

  const n = monthly.length;
  const xs = monthly.map((_, i) => i);
  const ys = monthly.map(m => m.value);

  // Linear regression
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = ys.reduce((a, b) => a + b, 0) / n;
  const slope = xs.reduce((sum, x, i) => sum + (x - xMean) * (ys[i] - yMean), 0) / xs.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
  const intercept = yMean - slope * xMean;

  const predicted = xs.map(x => Math.max(0, slope * x + intercept));
  const residuals = ys.map((y, i) => y - predicted[i]);
  const rmse = Math.sqrt(residuals.reduce((s, r) => s + r * r, 0) / n);
  const accuracy = Math.max(0, Math.min(100, 100 - (rmse / yMean) * 100));

  // Future predictions (next 6 months)
  const futurePeriods = 6;
  const allDates = [...monthly.map(m => m.month)];
  const lastDate = new Date(monthly[n - 1].month + "-01");

  for (let i = 1; i <= futurePeriods; i++) {
    const d = new Date(lastDate);
    d.setMonth(d.getMonth() + i);
    allDates.push(getMonthKey(d));
  }

  const allPredicted = allDates.map((_, i) => Math.max(0, slope * i + intercept));
  const ci = rmse * 1.96;

  return {
    dates: allDates,
    actual: [...ys, ...Array(futurePeriods).fill(null)],
    predicted: allPredicted,
    lower: allPredicted.map(p => Math.max(0, p - ci)),
    upper: allPredicted.map(p => p + ci),
    accuracy: parseFloat(accuracy.toFixed(1)),
    model: "Linear Regression",
  };
}

// ─── Formatters ──────────────────────────────────────
export function formatCurrency(value: number, currency = "USD"): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}
