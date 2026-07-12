"use client";
// app/(dashboard)/reports/page.tsx

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText, Download, CheckCircle2, RefreshCw, BarChart3,
  Calendar, FileSpreadsheet, ShieldAlert, Sparkles
} from "lucide-react";
import { useDatasetStore } from "@/store/dataset-store";
import { formatCurrency, formatNumber } from "@/lib/data-processor";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function ReportsPage() {
  const { kpis, sales, products, activeDatasetId, datasets } = useDatasetStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "xlsx" | "csv">("pdf");

  const hasData = !!kpis && !!activeDatasetId && !!datasets;
  const activeDataset = datasets.find(d => d.id === activeDatasetId);

  // Generate PDF report client-side
  const handleExportPDF = () => {
    if (!kpis || !activeDataset) return;
    try {
      const doc = new jsPDF() as any;

      // Primary header layout
      doc.setFillColor(15, 23, 42); // slate 900
      doc.rect(0, 0, 210, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("SALESPULSE", 15, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("EXECUTIVE INTEL REPORT • DATA ANALYTICS & INSIGHTS", 15, 28);

      // Metas
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      doc.text(`Dataset: ${activeDataset.name}`, 15, 50);
      doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 150, 50);

      // Horizontal line separator
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 54, 195, 54);

      // Section 1: Executive metrics
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("1. Executive Summary & KPIs", 15, 65);

      // KPI box styling
      const kpiData = [
        ["Total Revenue", formatCurrency(kpis.totalRevenue), "AOV", formatCurrency(kpis.averageOrderValue)],
        ["Gross Profit", formatCurrency(kpis.totalProfit), "Profit Margin", `${kpis.profitMargin}%`],
        ["Total Orders", formatNumber(kpis.totalOrders), "Unique Customers", formatNumber(kpis.totalCustomers)]
      ];
      
      autoTable(doc, {
        startY: 70,
        head: [],
        body: kpiData,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
          0: { fontStyle: "bold", textColor: [100, 116, 139] },
          1: { fontStyle: "bold", textColor: [15, 23, 42], fontSize: 11 },
          2: { fontStyle: "bold", textColor: [100, 116, 139] },
          3: { fontStyle: "bold", textColor: [15, 23, 42], fontSize: 11 }
        }
      });

      // Section 2: Top Performing Categories & Products
      let currentY = doc.lastAutoTable.finalY + 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("2. Product Catalog Contributions", 15, currentY);

      if (products) {
        const topProds = products.topProducts.slice(0, 5).map((p, i) => [
          String(i + 1),
          p.name,
          p.category,
          formatNumber(p.quantity),
          formatCurrency(p.revenue)
        ]);

        autoTable(doc, {
          startY: currentY + 5,
          head: [["Rank", "Product Name", "Category", "Quantity Sold", "Revenue"]],
          body: topProds,
          theme: "striped",
          headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
          styles: { fontSize: 9 }
        });
      }

      // Section 3: Geographic Distribution
      if (sales) {
        currentY = doc.lastAutoTable.finalY + 15;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("3. Geographic Performance Breakdown", 15, currentY);

        const geo = sales.byRegion.map(r => [
          r.region,
          formatCurrency(r.revenue),
          formatCurrency(r.profit),
          formatNumber(r.orders)
        ]);

        autoTable(doc, {
          startY: currentY + 5,
          head: [["Sales Region", "Revenue", "Profit", "Transactions Count"]],
          body: geo,
          theme: "striped",
          headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
          styles: { fontSize: 9 }
        });
      }

      // Save document
      doc.save(`SalesPulse-Report-${activeDataset.name.replace(/\s+/g, "-")}.pdf`);
      toast.success("PDF report generated and downloaded successfully!");
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to generate PDF. Check console logs.");
    }
  };

  // Generate Excel workbook sheet client-side
  const handleExportExcel = () => {
    if (!kpis || !activeDataset) return;
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Executive KPI Overview
      const kpiSheetData = [
        ["SALESPULSE EXECUTIVE BI SUMMARY REPORT"],
        [],
        ["Metric Title", "Value", "Growth Rates"],
        ["Total Revenue", kpis.totalRevenue, `${kpis.revenueGrowth}%`],
        ["Gross Profit", kpis.totalProfit, `${kpis.profitGrowth}%`],
        ["Total Transactions Count", kpis.totalOrders, `${kpis.ordersGrowth}%`],
        ["Unique Customer Accounts", kpis.totalCustomers, ""],
        ["Average Order Value", kpis.averageOrderValue, `${kpis.aovGrowth}%`],
        ["Profit Margin", `${kpis.profitMargin}%`, `${kpis.marginGrowth}%`],
        ["Products Items Sold", kpis.productsSold, ""],
        ["Top Product Category", kpis.topCategory, ""],
        ["Top Region Distribution", kpis.topRegion, ""],
        ["Loss Order Ratio", `${kpis.lossPercentage}%`, ""]
      ];

      const wsKPI = XLSX.utils.aoa_to_sheet(kpiSheetData);
      XLSX.utils.book_append_sheet(wb, wsKPI, "KPI Summary");

      // Sheet 2: Category sales breakdown
      if (products) {
        const catData = [
          ["Category Name", "Revenue", "Profit", "Products Count", "Quantity Sold"],
          ...products.byCategory.map(c => [c.category, c.revenue, c.profit, c.products, c.quantity])
        ];
        const wsCat = XLSX.utils.aoa_to_sheet(catData);
        XLSX.utils.book_append_sheet(wb, wsCat, "Category Performance");
      }

      // Save book
      XLSX.writeFile(wb, `SalesPulse-Export-${activeDataset.name.replace(/\s+/g, "-")}.xlsx`);
      toast.success("Excel report downloaded successfully!");
    } catch (e: any) {
      console.error(e);
      toast.error("Excel generation failed. Check console logs.");
    }
  };

  // Generate CSV data download
  const handleExportCSV = () => {
    if (!kpis || !activeDataset) return;
    try {
      const csvRows = [
        ["Metric", "Value"],
        ["Revenue", kpis.totalRevenue],
        ["Profit", kpis.totalProfit],
        ["Orders", kpis.totalOrders],
        ["Customers", kpis.totalCustomers],
        ["AOV", kpis.averageOrderValue],
        ["Margin", kpis.profitMargin],
        ["Top Category", kpis.topCategory],
        ["Top Region", kpis.topRegion]
      ];

      const csvContent = "data:text/csv;charset=utf-8," 
        + csvRows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `SalesPulse-KPIs-${activeDataset.name.replace(/\s+/g, "-")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV KPI metrics downloaded successfully!");
    } catch (e: any) {
      console.error(e);
      toast.error("CSV download failed. Check console.");
    }
  };

  const handleExportSubmit = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1000));
    
    if (selectedFormat === "pdf") {
      handleExportPDF();
    } else if (selectedFormat === "xlsx") {
      handleExportExcel();
    } else {
      handleExportCSV();
    }
    
    setIsGenerating(false);
  };

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
        <FileText className="w-12 h-12 text-muted-foreground/40 animate-pulse" />
        <h2 className="text-xl font-bold text-foreground">No Datasets Available to Generate Reports</h2>
        <p className="text-muted-foreground max-w-sm">Please upload your dataset sheet in the Dataset Manager first.</p>
        <Link href="/dashboard/upload" className="btn-primary">
          Go to Manager
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="section-header">
        <div>
          <h1 className="page-title">Report Center</h1>
          <p className="page-subtitle">Configure, generate, and export high-end executive summaries in different formats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Settings */}
        <div className="card space-y-6">
          <div>
            <h3 className="font-semibold text-foreground">Export Configuration</h3>
            <p className="text-xs text-muted-foreground">Select formatting parameter specifications</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">TARGET DATASET SOURCE</label>
              <div className="p-3 bg-muted/40 rounded-lg text-xs font-semibold text-foreground truncate border border-border">
                {activeDataset?.name} ({formatNumber(activeDataset?.rows || 0)} Rows)
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">DOCUMENT FORMAT TYPE</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "pdf", label: "PDF Document" },
                  { value: "xlsx", label: "Excel Workbook" },
                  { value: "csv", label: "CSV Flat Table" }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSelectedFormat(item.value as any)}
                    className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      selectedFormat === item.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/10 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    }`}
                  >
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleExportSubmit}
            disabled={isGenerating}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Packaging document...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate & Download
              </>
            )}
          </button>
        </div>

        {/* Report Preview */}
        <div className="card space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <h3 className="font-semibold text-foreground">Executive Digest Preview</h3>
            <p className="text-xs text-muted-foreground">High-level schema draft format of export layout</p>
          </div>

          <div className="border border-border/80 rounded-xl p-6 bg-muted/10 font-mono text-[10px] text-muted-foreground leading-relaxed flex-1 space-y-4">
            <div className="border-b border-border/60 pb-3 flex justify-between">
              <span className="font-bold text-foreground">SALESPULSE BI INTEL OVERVIEW SUMMARY</span>
              <span>CONFIDENTIAL</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold text-foreground mb-1">DATASET ORIGIN PROFILE:</p>
                <p>NAME: {activeDataset?.name}</p>
                <p>ROWS PROCESSED: {formatNumber(activeDataset?.rows || 0)}</p>
                <p>QUALITY INDEX: {activeDataset?.report?.qualityScore}%</p>
              </div>
              <div>
                <p className="font-bold text-foreground mb-1">DATE OF GENERATION:</p>
                <p>DATETIME: {new Date().toLocaleString()}</p>
                <p>ENCRYPTION: AES-256 (MOCK)</p>
              </div>
            </div>

            <div className="border-t border-border/60 pt-3 space-y-1">
              <p className="font-bold text-foreground mb-1">EXECUTIVE SUMMARY INSIGHTS METRICS:</p>
              <p>REVENUE: {formatCurrency(kpis.totalRevenue)} ({kpis.revenueGrowth >= 0 ? "+" : ""}{kpis.revenueGrowth}%)</p>
              <p>PROFIT: {formatCurrency(kpis.totalProfit)} ({kpis.profitGrowth >= 0 ? "+" : ""}{kpis.profitGrowth}%)</p>
              <p>OPERATING MARGIN: {kpis.profitMargin}%</p>
              <p>TRANSACTIONS: {formatNumber(kpis.totalOrders)}</p>
              <p>RETURNING CLIENTS COHORT: {formatNumber(kpis.returningCustomers)}</p>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground/80 mt-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-primary shrink-0" />
            Generated files are processed secure client-side in browser session.
          </div>
        </div>
      </div>
    </div>
  );
}
