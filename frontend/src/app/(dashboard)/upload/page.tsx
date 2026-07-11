"use client";
// app/(dashboard)/upload/page.tsx

import React, { useState, useCallback } from "react";
// Native HTML5 drag and drop zone is perfect, light-weight, and has zero dependency issues.

import {
  Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight,
  Database, RefreshCw, BarChart2, Check, AlertCircle, Info, Sparkles, Trash2
} from "lucide-react";
import { useDatasetStore } from "@/store/dataset-store";
import { parseFile, cleanData, formatNumber } from "@/lib/data-processor";
import { toast } from "sonner";

export default function UploadPage() {
  const {
    datasets, activeDatasetId, addDataset, removeDataset, setActiveDataset,
    isProcessing, processingStep, uploadProgress, setProgress
  } = useDatasetStore();

  const [dragActive, setDragActive] = useState(false);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"upload" | "history">("upload");

  const activeDataset = datasets.find((d) => d.id === activeDatasetId);

  const handleFileProcess = async (file: File) => {
    try {
      setProgress(5, "Reading file content...");
      const rawRows = await parseFile(file);
      
      setProgress(30, "Analyzing headers and schema mapping...");
      await new Promise((r) => setTimeout(r, 600));

      setProgress(60, "Running data cleaning and imputation pipelines...");
      const { rows, report, profile } = cleanData(rawRows);
      await new Promise((r) => setTimeout(r, 800));

      setProgress(90, "Profiling columns & generating analytics cache...");
      await new Promise((r) => setTimeout(r, 600));

      const datasetId = `ds_${Date.now()}`;
      addDataset({
        id: datasetId,
        name: file.name.replace(/\.[^/.]+$/, ""),
        originalName: file.name,
        uploadedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        rows: rows.length,
        columns: report.columnsFound.length + report.columnsMissing.length,
        sizeBytes: file.size,
        status: "ready"
      }, rows, report, profile);

      setPreviewRows(rows.slice(0, 10));
      setProgress(100, "Done");
      toast.success(`Successfully uploaded and cleaned ${formatNumber(rows.length)} rows!`);
    } catch (e: any) {
      setProgress(0, "");
      toast.error(e.message || "Error processing dataset.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await handleFileProcess(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await handleFileProcess(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="section-header">
        <div>
          <h1 className="page-title">Dataset Manager</h1>
          <p className="page-subtitle">Upload corporate transaction sheets for BI reporting</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6">
        <button
          onClick={() => setActiveTab("upload")}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === "upload" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Import Sheet
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === "history" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Dataset Directory ({datasets.length})
        </button>
      </div>

      {activeTab === "upload" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Drag Drop Area */}
          <div className="lg:col-span-2 space-y-6">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer relative ${
                dragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <input
                id="file-input"
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileInput}
                className="hidden"
                disabled={isProcessing}
              />
              <label htmlFor="file-input" className="cursor-pointer space-y-4 block">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary glow-primary">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">Click to upload or drag & drop</p>
                  <p className="text-xs text-muted-foreground mt-1">Excel or CSV files up to 100MB</p>
                </div>
                <div className="pt-2 text-xs text-muted-foreground">
                  Expected fields include: Sales ID, Order Date, Product Name, Category, Quantity, Unit Price, Profit, Region, Customer ID.
                </div>
              </label>

              {isProcessing && (
                <div className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 space-y-4">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                  <div className="w-64">
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>{processingStep}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill bg-primary" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Clean Data Table */}
            {activeDataset?.report && previewRows.length > 0 && (
              <div className="card space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">Data Clean Preview</h3>
                  <p className="text-xs text-muted-foreground">Showing first 10 rows after automatic ETL normalization</p>
                </div>
                <div className="overflow-x-auto border border-border rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="table-header">Sales ID</th>
                        <th className="table-header">Product</th>
                        <th className="table-header">Category</th>
                        <th className="table-header">Qty</th>
                        <th className="table-header">Net Rev</th>
                        <th className="table-header">Profit</th>
                        <th className="table-header">Region</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {previewRows.map((r, i) => (
                        <tr key={i} className="hover:bg-muted/30">
                          <td className="table-cell font-mono text-xs">{r.sales_id}</td>
                          <td className="table-cell truncate max-w-[150px] font-medium text-foreground">{r.product_name}</td>
                          <td className="table-cell">{r.category}</td>
                          <td className="table-cell font-semibold">{r.quantity}</td>
                          <td className="table-cell text-primary font-semibold">${r.selling_price.toFixed(0)}</td>
                          <td className="table-cell text-success font-semibold">${r.profit.toFixed(0)}</td>
                          <td className="table-cell">{r.region}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right: Data Quality & Cleaning Report */}
          <div className="space-y-6">
            {activeDataset?.report ? (
              <div className="card space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">ETL Audit Report</h3>
                    <p className="text-xs text-muted-foreground">{activeDataset.originalName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">{activeDataset.report.qualityScore}%</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Quality Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/40 rounded-xl">
                    <p className="text-lg font-bold text-foreground">{formatNumber(activeDataset.report.totalRows)}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Raw Rows</p>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-xl">
                    <p className="text-lg font-bold text-success">{formatNumber(activeDataset.report.cleanedRows)}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Cleaned Rows</p>
                  </div>
                </div>

                {/* Audit details */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Data Imputations</p>
                  <div className="space-y-2">
                    {[
                      { label: "Duplicate rows removed", value: activeDataset.report.duplicatesRemoved, color: "text-rose-500", warn: true },
                      { label: "Missing values filled", value: activeDataset.report.missingValuesFilled, color: "text-amber-500", warn: false },
                      { label: "Datatypes corrected", value: activeDataset.report.typesFixed, color: "text-primary", warn: false },
                      { label: "Outliers flagged", value: activeDataset.report.outliersFlagged, color: "text-yellow-500", warn: true },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className={`font-mono font-bold ${item.value > 0 && item.warn ? item.color : "text-foreground"}`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schema validation */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Schema Map Audit</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDataset.report.columnsFound.map((col) => (
                      <span key={col} className="badge bg-success/10 text-success border border-success/20 text-[10px] capitalize">
                        ✓ {col}
                      </span>
                    ))}
                    {activeDataset.report.columnsMissing.map((col) => (
                      <span key={col} className="badge bg-destructive/10 text-destructive border border-destructive/20 text-[10px] capitalize">
                        ⚠ Missing: {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card text-center p-8 space-y-4">
                <Database className="w-10 h-10 text-muted-foreground/45 mx-auto" />
                <div>
                  <h3 className="font-semibold text-foreground">No Audits Available</h3>
                  <p className="text-xs text-muted-foreground">Upload a dataset to run quality checks and normalization pipelines.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History Directory */
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Dataset Directory</h3>
              <p className="text-xs text-muted-foreground">Select, load, or delete cached analytics profiles</p>
            </div>
          </div>

          {datasets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground space-y-3">
              <Database className="w-12 h-12 mx-auto text-muted-foreground/30" />
              <p className="text-sm">No datasets loaded yet. Head over to Import Sheet to upload.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="table-header">Active</th>
                    <th className="table-header">Dataset Name</th>
                    <th className="table-header">Rows</th>
                    <th className="table-header">Uploaded</th>
                    <th className="table-header">Quality Score</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {datasets.map((d) => (
                    <tr key={d.id} className={`hover:bg-muted/30 ${d.id === activeDatasetId ? "bg-primary/5" : ""}`}>
                      <td className="table-cell">
                        <button
                          onClick={() => { setActiveDataset(d.id); toast.success(`Active dataset changed to ${d.name}`); }}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            d.id === activeDatasetId ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                          }`}
                        >
                          {d.id === activeDatasetId && <Check className="w-3 h-3" />}
                        </button>
                      </td>
                      <td className="table-cell font-semibold text-foreground">
                        <div>
                          <p>{d.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono truncate max-w-xs">{d.originalName}</p>
                        </div>
                      </td>
                      <td className="table-cell font-mono">{formatNumber(d.rows)}</td>
                      <td className="table-cell text-muted-foreground text-xs">{d.uploadedAt}</td>
                      <td className="table-cell font-mono font-bold text-primary">{d.report?.qualityScore ?? "N/A"}%</td>
                      <td className="table-cell">
                        <button
                          onClick={() => { removeDataset(d.id); toast.success(`Removed dataset: ${d.name}`); }}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete Dataset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
