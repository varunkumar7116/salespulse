import { create } from "zustand";
import { InventoryItem, ReorderSuggestion } from "../types";

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "inv_item_001",
    productId: "prod_001",
    productName: "SalesPulse Analytics Pro",
    sku: "SP-AN-PRO",
    warehouseLocation: "Primary Cloud (Global)",
    currentStock: 450,
    allocatedStock: 25,
    availableStock: 425,
    minimumStock: 100,
    unitCost: 800,
    totalValue: 360000,
    lastStockCountDate: "2026-07-01",
    status: "in_stock",
  },
  {
    id: "inv_item_002",
    productId: "prod_002",
    productName: "Enterprise Integration Hub",
    sku: "SP-INT-HUB",
    warehouseLocation: "Primary Cloud (Global)",
    currentStock: 120,
    allocatedStock: 10,
    availableStock: 110,
    minimumStock: 20,
    unitCost: 3500,
    totalValue: 420000,
    lastStockCountDate: "2026-07-01",
    status: "in_stock",
  },
  {
    id: "inv_item_003",
    productId: "prod_003",
    productName: "Real-time Forecasting Engine",
    sku: "SP-AI-FC",
    warehouseLocation: "Secondary Cloud (Europe)",
    currentStock: 15,
    allocatedStock: 2,
    availableStock: 13,
    minimumStock: 30, // Trigger low stock!
    unitCost: 1200,
    totalValue: 18000,
    lastStockCountDate: "2026-07-01",
    status: "low_stock",
  },
  {
    id: "inv_item_004",
    productId: "prod_004",
    productName: "Inventory Tracking Tool",
    sku: "SP-HW-INV",
    warehouseLocation: "Virginia Physical DC",
    currentStock: 5,
    allocatedStock: 4,
    availableStock: 1,
    minimumStock: 50, // Trigger critical low stock!
    unitCost: 80,
    totalValue: 400,
    lastStockCountDate: "2026-07-01",
    status: "out_of_stock",
  },
  {
    id: "inv_item_005",
    productId: "prod_005",
    productName: "Notification Cloud API",
    sku: "SP-API-NOTIF",
    warehouseLocation: "Primary Cloud (Global)",
    currentStock: 890,
    allocatedStock: 40,
    availableStock: 850,
    minimumStock: 150,
    unitCost: 3.3,
    totalValue: 2937,
    lastStockCountDate: "2026-07-01",
    status: "in_stock",
  },
];

const INITIAL_SUGGESTIONS: ReorderSuggestion[] = [
  {
    productId: "prod_003",
    productName: "Real-time Forecasting Engine",
    sku: "SP-AI-FC",
    currentStock: 15,
    reorderPoint: 30,
    suggestedQuantity: 50,
    estimatedCost: 60000,
    supplierName: "Apex Labs AI",
    priority: "medium",
  },
  {
    productId: "prod_004",
    productName: "Inventory Tracking Tool",
    sku: "SP-HW-INV",
    currentStock: 5,
    reorderPoint: 50,
    suggestedQuantity: 200,
    estimatedCost: 16000,
    supplierName: "Vanguard HW Systems",
    priority: "high",
  },
];

interface InventoryState {
  inventoryItems: InventoryItem[];
  reorderSuggestions: ReorderSuggestion[];
  adjustStock: (productId: string, quantityChange: number) => void;
  triggerReorder: (productId: string) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  inventoryItems: INITIAL_INVENTORY,
  reorderSuggestions: INITIAL_SUGGESTIONS,

  adjustStock: (productId, quantityChange) =>
    set((state) => ({
      inventoryItems: state.inventoryItems.map((item) => {
        if (item.productId !== productId) return item;
        const newStock = Math.max(0, item.currentStock + quantityChange);
        const available = Math.max(0, newStock - item.allocatedStock);
        let status: InventoryItem["status"] = "in_stock";
        if (newStock === 0) status = "out_of_stock";
        else if (newStock < item.minimumStock) status = "low_stock";
        return {
          ...item,
          currentStock: newStock,
          availableStock: available,
          totalValue: newStock * item.unitCost,
          status,
        };
      }),
    })),

  triggerReorder: (productId) =>
    set((state) => {
      const suggestion = state.reorderSuggestions.find((s) => s.productId === productId);
      if (!suggestion) return state;

      // Simulate placing the order and updating inventory levels
      const updatedInventory = state.inventoryItems.map((item) => {
        if (item.productId !== productId) return item;
        const newStock = item.currentStock + suggestion.suggestedQuantity;
        return {
          ...item,
          currentStock: newStock,
          availableStock: newStock - item.allocatedStock,
          totalValue: newStock * item.unitCost,
          status: "in_stock" as const,
        };
      });

      const updatedSuggestions = state.reorderSuggestions.filter((s) => s.productId !== productId);

      return {
        inventoryItems: updatedInventory,
        reorderSuggestions: updatedSuggestions,
      };
    }),
}));
