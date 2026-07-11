export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  unitPrice: number;
  unitCost: number;
  margin: number; // Percentage, e.g. 0.45
  status: "active" | "archived" | "draft";
  stockLevel: number;
  reorderPoint: number;
  reorderQuantity: number;
  stockStatus: StockStatus;
  totalSalesQuantity: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBreakdown {
  category: string;
  productCount: number;
  totalStockValue: number;
  totalRevenue: number;
  averageMargin: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseLocation: string;
  currentStock: number;
  allocatedStock: number;
  availableStock: number;
  minimumStock: number;
  unitCost: number;
  totalValue: number;
  lastStockCountDate: string;
  status: StockStatus;
}

export interface ReorderSuggestion {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  suggestedQuantity: number;
  estimatedCost: number;
  supplierName: string;
  priority: "high" | "medium" | "low";
}
