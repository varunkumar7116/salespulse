import { create } from "zustand";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface RecommendationCard {
  id: string;
  title: string;
  description: string;
  category: "revenue" | "inventory" | "customer" | "general";
  impact: string; // e.g. "+$12,400 MRR"
  actionText: string;
  createdAt: string;
}

const INITIAL_RECOMMENDATIONS: RecommendationCard[] = [
  {
    id: "rec_001",
    title: "Optimize Software Tier Pricing",
    description:
      "Based on analysis of direct sales channels, increasing the standard unit price of SalesPulse Analytics Pro by 8% will not impact customer churn but could yield significant margins.",
    category: "revenue",
    impact: "+$9,600 Revenue / Mo",
    actionText: "Review Pricing Strategy",
    createdAt: "2026-07-06T12:00:00Z",
  },
  {
    id: "rec_002",
    title: "Reorder Low Stock Inventory",
    description:
      "Critical reorder point reached for 'Inventory Tracking Tool'. Stocks are currently at 5 units while minimum required threshold is 50. Reorder suggested immediately to prevent order delay.",
    category: "inventory",
    impact: "Avoid Stockout Delay",
    actionText: "Trigger Auto-Reorder",
    createdAt: "2026-07-07T08:00:00Z",
  },
  {
    id: "rec_003",
    title: "Address Enterprise Customer Churn Risk",
    description:
      "Customer 'Apex Digital Solutions' churn probability raised to 28% following delayed payment of invoice INV-2026-0003. Flagged for key account team outreach.",
    category: "customer",
    impact: "Retain $8,280 Account",
    actionText: "Open Customer Profile",
    createdAt: "2026-07-08T06:30:00Z",
  },
];

const SUGGESTIONS = [
  "Analyze top selling products and categories.",
  "Which regions are driving the highest revenue growth?",
  "What is our inventory value breakdown by warehouse?",
  "Check customer lifetime value distribution.",
];

interface AiState {
  chatHistory: ChatMessage[];
  recommendations: RecommendationCard[];
  suggestions: string[];
  isThinking: boolean;
  sendMessage: (content: string) => void;
  clearHistory: () => void;
}

export const useAiStore = create<AiState>((set) => ({
  chatHistory: [
    {
      id: "welcome",
      sender: "assistant",
      content:
        "Welcome to SalesPulse AI Copilot. I can query our sales database, compile revenue updates, and assist in running predictive time-series models. Ask me anything about our sales data.",
      timestamp: new Date().toISOString(),
    },
  ],
  recommendations: INITIAL_RECOMMENDATIONS,
  suggestions: SUGGESTIONS,
  isThinking: false,

  sendMessage: (content) => {
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      chatHistory: [...state.chatHistory, userMsg],
      isThinking: true,
    }));

    // Simulate smart context-aware AI response based on keywords
    setTimeout(() => {
      let reply = "";
      const query = content.toLowerCase();

      if (query.includes("product") || query.includes("selling")) {
        reply =
          "According to recent transaction logs: \n\n1. **Enterprise Integration Hub** leads with **$15,000** net revenue (Software/Infrastructure).\n2. **SalesPulse Analytics Pro** is our volume leader with 15 units sold across North America yielding **$16,800** total net amount.\n\nI recommend targeting additional Direct marketing campaigns in Europe for higher sales volume.";
      } else if (query.includes("inventory") || query.includes("stock")) {
        reply =
          "Warning: I detected low stock for two items:\n\n* **Real-time Forecasting Engine** (15 units left vs 30 min)\n* **Inventory Tracking Tool** (5 units left vs 50 min)\n\nYou can dispatch auto-reorders directly from the Inventory control panel to resolve this.";
      } else if (query.includes("revenue") || query.includes("profit") || query.includes("kpi")) {
        reply =
          "Current database financials aggregate:\n\n* **Total Net Revenue**: $52,150\n* **Total Net Profit**: $41,200\n* **Overall Profit Margin**: ~79.0%\n\nDirect channel sales in North America dominate, accounting for over 52% of total transaction values.";
      } else if (query.includes("churn") || query.includes("customer")) {
        reply =
          "Customer insights alert: **Apex Digital Solutions** is currently flagged with a **28% churn probability** due to an outstanding invoice value of **$8,280** which has passed its target invoice date.";
      } else {
        reply =
          "I have processed your query. I can assist in compiling CSV report data, generating Excel documents, forecasting future sales values, and highlighting active stock level alerts. Feel free to rephrase or try one of the suggested prompts below.";
      }

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: "assistant",
        content: reply,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        chatHistory: [...state.chatHistory, assistantMsg],
        isThinking: false,
      }));
    }, 1500);
  },

  clearHistory: () =>
    set({
      chatHistory: [
        {
          id: "welcome",
          sender: "assistant",
          content:
            "Welcome to SalesPulse AI Copilot. I can query our sales database, compile revenue updates, and assist in running predictive time-series models. Ask me anything about our sales data.",
          timestamp: new Date().toISOString(),
        },
      ],
    }),
}));
