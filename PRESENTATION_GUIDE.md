# SalesPulse AI — Beginner-Friendly Presentation Guide

Welcome to the SalesPulse AI Presentation Guide! This document is designed to give you a complete, easy-to-understand explanation of the project. If you are presenting this project to non-technical stakeholders, clients, or evaluators, reading this guide will prepare you to answer any questions confidently.

---

## 1. What is SalesPulse AI? (The Elevator Pitch)
SalesPulse AI is a secure, browser-based **Business Intelligence (BI) and Sales Analytics Platform**. It turns raw spreadsheets (CSV or Excel files) into interactive dashboard charts, machine learning-powered sales forecasts, and automated AI diagnostic reports.

**The Golden Selling Point**: 
Unlike traditional BI tools (like Power BI or Tableau) which require complex databases, servers, and subscriptions, **SalesPulse AI runs 100% in the user's web browser**. 
* **Zero Server Costs**: No backend data calculations are required.
* **100% Secure**: Sensitive company financial data never leaves the user's computer.

---

## 2. Key Features (What does it do?)
When presenting the app, walk through these key user benefits:
1. **Interactive KPI Dashboard**: Instantly tracks total revenue, gross profit margin, average order value (AOV), and loss-making transaction ratios.
2. **Auto-Cleaning Pipeline (ETL)**: Automatically fixes spreadsheet issues (removes duplicate sales IDs, fills missing prices, corrects date formats) and generates a **Data Quality Score**.
3. **Product & Inventory Analysis**: Identifies top-performing products, fast-moving items, dead stock (items costing money to store but not selling), and categorizes items using the Pareto principle (ABC analysis).
4. **Customer Lifetime & RFM Profiling**: Segments customers into *Champions*, *Loyal*, *At Risk*, or *Lost* using recency, frequency, and monetary metrics.
5. **Machine Learning Forecasting**: Predicts future sales run-rates with 95% confidence bands using linear regression models.
6. **Built-in AI Insights Engine**: Automatically generates a SWOT analysis, prioritizes business recommendations, and answers questions like *"Why is profit low?"* in a chat window.
7. **Document Exporter**: Exports detailed reports into PDF or Excel spreadsheets in one click.

---

## 3. Technology Stack (What did we use?)
Here is a beginner-friendly explanation of what technologies make the app run:

| Technology / Library | What it is | Why we used it (in plain English) |
| :--- | :--- | :--- |
| **Next.js 16 (React)** | Frontend Framework | The skeleton and page routing of the app. It's the industry standard for fast modern web apps. |
| **TypeScript** | Static Type Checker | Adds safety rules to JavaScript, preventing coding typos and compiler crashes. |
| **Zustand** | State Manager | Acts as the app's local memory store, caching the active dataset and reports while you navigate between pages. |
| **Apache ECharts** | Visualization Engine | Draws the beautiful animated graphs, heatmaps, and dials on a high-speed canvas. |
| **PapaParse & SheetJS** | File Parsers | Translates raw `.csv` and `.xlsx` files into computer-readable lists instantly. |
| **Vanilla CSS** | Styling System | Custom styled sheets for the UI theme (dark mode, glassmorphism cards, glowing gradients). |

---

## 4. How It Works: The Step-by-Step Workflow
Explain the path of a spreadsheet inside the app:

```
[ Upload Sheet ] ➔ [ Normalization & Clean ] ➔ [ Computations Store ] ➔ [ Visual & ML Dashboard ]
```

1. **Upload**: User drops a spreadsheet (`.csv` or `.xlsx`) into the upload zone.
2. **Clean & Audit**: The app runs the file through the cleaning pipeline to standardize columns and format dates/numbers, generating a **ETL Audit Report**.
3. **Cache Calculations**: The cleaned rows are saved in the Zustand memory store, and secondary calculations (KPIs, customer metrics, inventory statistics, AI swot rules) are computed in real-time.
4. **Display**: The dashboards read from this memory cache, rendering ECharts graphs, running the forecasting regression, and rendering the AI text reports.

---

## 5. Frequently Asked Questions (FAQ) for Presentations

### 💻 "Does it work with external CSV sales datasets?"
**Yes, absolutely!** You do not have to use the sample dataset. You can upload any standard sales spreadsheet. 
* **Header Matching (Fuzzy mapping)**: The app has an intelligent mapping dictionary. Even if your spreadsheet column is named "Net Revenue", "selling price", "total revenue", or "sales price", it will automatically identify it as the selling price.
* **Imputations**: If your sheet is missing calculations (e.g., it has quantity and unit price, but no total revenue column, or cost price but no profit column), the data processing library will mathematically calculate and fill the missing columns automatically!

### 📊 "What columns are expected in a custom CSV file?"
To get the most out of all dashboards, a custom dataset should ideally have columns representing:
* **Order details**: Sales ID, Order Date, Quantity, Selling Price, Cost Price (or Unit Price & Discount).
* **Category**: Product Name, Category, Sub-category.
* **Geography**: Region, State, City, Salesperson.
* **Customer**: Customer Name, Customer ID, Age, Gender, Payment Method.
* **Inventory**: Stock Available, Supplier.

*Note: If some columns are missing, the dashboard still compiles successfully and displays warnings in the ETL report showing which fields are missing.*

### 🤖 "Is the AI insights engine calling OpenAI or ChatGPT?"
**No.** The AI engine is a **rule-based narrative generator** running locally inside [ai-insights.ts](file:///c:/Users/varun/Desktop/salespulse-ai/frontend/src/lib/ai-insights.ts). 
* **Why this is better for a presentation**: It is 100% deterministic (never hallucinates), runs instantly without internet connection, doesn't require API keys or tokens, and maintains complete privacy.

---

## 6. What Was Optimized & Improved Recently
If asked about what work you did on the project, you can highlight:
1. **Workspace Compilation Resolving**: Configured a monorepo setup with workspaces, fixing build execution errors so the app starts with a single command.
2. **Next.js Compilation Fixes**: Created the main Dashboard Home router component and layouts to resolve missing route imports.
3. **Dynamic Bundle Splitting**: ECharts is a very heavy charting engine. Implemented lazy-loaded dynamic imports (`next/dynamic`) to strip ECharts from the main bundle, cutting initial load times.
4. **Performance Configurations**: Configured Gzip compression and stripped console logs in production builds via the Next configuration.
5. **Sample Data Integration**: Created a script to generate a high-fidelity 350-row sample database so the project is instantly testable.

---
*Created on 2026-07-11 to assist Varun in presenting SalesPulse AI.*
