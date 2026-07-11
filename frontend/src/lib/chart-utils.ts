// lib/chart-utils.ts
// ECharts option builders for all chart types used in the platform

import type { EChartsOption } from "echarts";

// ─── Design Tokens ───────────────────────────────────
export const CHART_COLORS = [
  "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#06b6d4",
  "#ef4444", "#10b981", "#ec4899", "#f97316", "#6366f1",
  "#14b8a6", "#a855f7", "#84cc16", "#fb923c", "#38bdf8",
];

export const TOOLTIP_STYLE = {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  borderColor: "rgba(148, 163, 184, 0.15)",
  borderWidth: 1,
  textStyle: { color: "#e2e8f0", fontSize: 12 },
  extraCssText: "border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); padding: 10px 14px;",
};

export const AXIS_STYLE = {
  axisLine: { lineStyle: { color: "rgba(148, 163, 184, 0.15)" } },
  axisTick: { lineStyle: { color: "rgba(148, 163, 184, 0.1)" } },
  axisLabel: { color: "#94a3b8", fontSize: 11 },
  splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.08)", type: "dashed" as const } },
};

export const LEGEND_STYLE = {
  textStyle: { color: "#94a3b8", fontSize: 12 },
  icon: "roundRect",
  itemWidth: 10,
  itemHeight: 10,
};

export function formatValue(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

// ─── Line Chart ──────────────────────────────────────
export function buildLineChart(
  xData: string[],
  series: { name: string; data: (number | null)[]; color?: string }[],
  opts: { smooth?: boolean; area?: boolean; title?: string } = {}
): EChartsOption {
  return {
    tooltip: { ...TOOLTIP_STYLE, trigger: "axis", valueFormatter: (v: any) => formatValue(v) },
    legend: { ...LEGEND_STYLE, top: 0 },
    grid: { top: 40, right: 16, bottom: 40, left: 64 },
    xAxis: { type: "category", data: xData, ...AXIS_STYLE, axisLabel: { ...AXIS_STYLE.axisLabel, rotate: xData.length > 12 ? 45 : 0 } },
    yAxis: { type: "value", ...AXIS_STYLE, axisLabel: { ...AXIS_STYLE.axisLabel, formatter: formatValue } },
    series: series.map((s, i) => ({
      name: s.name,
      type: "line",
      data: s.data,
      smooth: opts.smooth ?? true,
      symbol: "circle",
      symbolSize: 4,
      lineStyle: { width: 2, color: s.color || CHART_COLORS[i] },
      itemStyle: { color: s.color || CHART_COLORS[i] },
      areaStyle: opts.area ? {
        color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: `${s.color || CHART_COLORS[i]}40` }, { offset: 1, color: `${s.color || CHART_COLORS[i]}05` }] },
      } : undefined,
    })),
  };
}

// ─── Bar Chart ───────────────────────────────────────
export function buildBarChart(
  xData: string[],
  series: { name: string; data: number[]; color?: string }[],
  opts: { horizontal?: boolean; stacked?: boolean; title?: string } = {}
): EChartsOption {
  const isHorizontal = opts.horizontal ?? false;
  const axis = { type: "category" as const, data: xData, ...AXIS_STYLE, axisLabel: { ...AXIS_STYLE.axisLabel, rotate: (!isHorizontal && xData.length > 8) ? 45 : 0 } };
  const valueAxis = { type: "value" as const, ...AXIS_STYLE, axisLabel: { ...AXIS_STYLE.axisLabel, formatter: formatValue } };

  return {
    tooltip: { ...TOOLTIP_STYLE, trigger: "axis", valueFormatter: (v: any) => formatValue(v) },
    legend: series.length > 1 ? { ...LEGEND_STYLE, top: 0 } : undefined,
    grid: { top: series.length > 1 ? 40 : 16, right: 16, bottom: isHorizontal ? 16 : (xData.length > 8 ? 64 : 40), left: isHorizontal ? 120 : 64 },
    xAxis: isHorizontal ? valueAxis : axis,
    yAxis: isHorizontal ? axis : valueAxis,
    series: series.map((s, i) => ({
      name: s.name,
      type: "bar",
      data: s.data,
      stack: opts.stacked ? "total" : undefined,
      barMaxWidth: 40,
      itemStyle: { color: s.color || CHART_COLORS[i], borderRadius: isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0] },
      emphasis: { itemStyle: { opacity: 0.85 } },
    })),
  };
}

// ─── Pie / Donut Chart ───────────────────────────────
export function buildPieChart(
  data: { name: string; value: number }[],
  opts: { donut?: boolean; title?: string; legend?: boolean } = {}
): EChartsOption {
  return {
    tooltip: { ...TOOLTIP_STYLE, trigger: "item", formatter: ((p: any) => `${p.name}<br/><strong>${formatValue(p.value)}</strong> (${p.percent}%)`) as any },
    legend: opts.legend !== false ? { ...LEGEND_STYLE, orient: "vertical", right: 16, top: "center" } : undefined,
    series: [{
      type: "pie",
      radius: opts.donut ? ["45%", "70%"] : "65%",
      center: opts.legend !== false ? ["38%", "50%"] : ["50%", "50%"],
      data: data.map((d, i) => ({ ...d, itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] } })),
      label: { color: "#94a3b8", fontSize: 11 },
      labelLine: { lineStyle: { color: "rgba(148,163,184,0.3)" } },
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0, 0, 0, 0.3)" } },
    }],
  };
}

// ─── Area Chart ──────────────────────────────────────
export function buildAreaChart(
  xData: string[],
  series: { name: string; data: (number | null)[]; color?: string }[]
): EChartsOption {
  return buildLineChart(xData, series, { smooth: true, area: true });
}

// ─── Scatter Chart ───────────────────────────────────
export function buildScatterChart(
  data: { name: string; x: number; y: number; size?: number; category?: string }[],
  opts: { xLabel?: string; yLabel?: string } = {}
): EChartsOption {
  return {
    tooltip: {
      ...TOOLTIP_STYLE, trigger: "item",
      formatter: ((p: any) => `${p.name}<br/>${opts.xLabel || "X"}: <strong>${p.data[0]}</strong><br/>${opts.yLabel || "Y"}: <strong>${p.data[1]}</strong>`) as any,
    },
    grid: { top: 16, right: 16, bottom: 40, left: 64 },
    xAxis: { type: "value", name: opts.xLabel, ...AXIS_STYLE, nameTextStyle: { color: "#94a3b8" } },
    yAxis: { type: "value", name: opts.yLabel, ...AXIS_STYLE, nameTextStyle: { color: "#94a3b8" } },
    series: [{
      type: "scatter",
      data: data.map((d, i) => ({ value: [d.x, d.y, d.size || 10], name: d.name, itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] + "cc" } })),
      symbolSize: (val: number[]) => Math.sqrt(val[2] || 10) * 3,
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.3)" } },
    }],
  };
}

// ─── Heatmap Chart ───────────────────────────────────
export function buildHeatmapChart(
  xData: string[],
  yData: string[],
  data: [number, number, number][],
  opts: { min?: number; max?: number } = {}
): EChartsOption {
  const max = opts.max ?? Math.max(...data.map((d) => d[2]));
  return {
    tooltip: { ...TOOLTIP_STYLE, position: "top" },
    grid: { top: 16, right: 80, bottom: 64, left: 100 },
    xAxis: { type: "category", data: xData, ...AXIS_STYLE, splitArea: { show: true } },
    yAxis: { type: "category", data: yData, ...AXIS_STYLE, splitArea: { show: true } },
    visualMap: { min: 0, max, calculable: true, orient: "vertical", right: 0, top: "center", textStyle: { color: "#94a3b8" }, inRange: { color: ["#1e293b", "#3b82f6", "#22c55e"] } },
    series: [{ type: "heatmap", data, label: { show: false }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.5)" } } }],
  };
}

// ─── Treemap Chart ───────────────────────────────────
export function buildTreemapChart(data: { name: string; value: number; children?: { name: string; value: number }[] }[]): EChartsOption {
  return {
    tooltip: { ...TOOLTIP_STYLE, formatter: ((p: any) => `${p.name}<br/><strong>${formatValue(p.value)}</strong>`) as any },
    series: [{
      type: "treemap",
      data: data.map((d, i) => ({ ...d, itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] + "cc", borderColor: CHART_COLORS[i % CHART_COLORS.length] } })),
      label: { color: "#fff", fontSize: 12 },
      breadcrumb: { show: false },
      roam: false,
    }],
  };
}

// ─── Radar Chart ─────────────────────────────────────
export function buildRadarChart(
  indicators: { name: string; max: number }[],
  series: { name: string; data: number[]; color?: string }[]
): EChartsOption {
  return {
    tooltip: TOOLTIP_STYLE,
    legend: series.length > 1 ? { ...LEGEND_STYLE } : undefined,
    radar: {
      indicator: indicators,
      axisName: { color: "#94a3b8", fontSize: 11 },
      splitLine: { lineStyle: { color: "rgba(148,163,184,0.1)" } },
      splitArea: { areaStyle: { color: ["rgba(59,130,246,0.02)", "rgba(59,130,246,0.05)"] } },
      axisLine: { lineStyle: { color: "rgba(148,163,184,0.15)" } },
    },
    series: [{
      type: "radar",
      data: series.map((s, i) => ({
        name: s.name, value: s.data,
        symbol: "circle", symbolSize: 5,
        lineStyle: { color: s.color || CHART_COLORS[i], width: 2 },
        areaStyle: { color: `${s.color || CHART_COLORS[i]}30` },
        itemStyle: { color: s.color || CHART_COLORS[i] },
      })),
    }],
  };
}

// ─── Gauge Chart ─────────────────────────────────────
export function buildGaugeChart(value: number, max: number, label: string, color?: string): EChartsOption {
  const pct = Math.min(100, (value / max) * 100);
  const c = color || (pct > 75 ? "#22c55e" : pct > 40 ? "#f59e0b" : "#ef4444");
  return {
    series: [{
      type: "gauge",
      startAngle: 220, endAngle: -40,
      min: 0, max,
      radius: "90%",
      pointer: { show: true, length: "60%", width: 4, itemStyle: { color: c } },
      progress: { show: true, width: 12, itemStyle: { color: c } },
      axisLine: { lineStyle: { width: 12, color: [[1, "rgba(148,163,184,0.1)"]] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: { valueAnimation: true, formatter: `{value}\n${label}`, color: "#e2e8f0", fontSize: 14, fontWeight: "bold", offsetCenter: [0, "35%"] },
      data: [{ value }],
    }],
  };
}

// ─── Waterfall Chart ─────────────────────────────────
export function buildWaterfallChart(data: { name: string; value: number; type: "revenue" | "cost" | "profit" }[]): EChartsOption {
  let running = 0;
  const transparent: number[] = [];
  const positive: number[] = [];
  const negative: number[] = [];

  data.forEach((d) => {
    if (d.type === "revenue") {
      transparent.push(0);
      positive.push(d.value);
      negative.push(0);
      running = d.value;
    } else if (d.type === "cost") {
      const base = running + d.value;
      transparent.push(base < 0 ? 0 : base);
      positive.push(0);
      negative.push(Math.abs(d.value));
      running += d.value;
    } else {
      transparent.push(0);
      positive.push(d.value);
      negative.push(0);
      running = d.value;
    }
  });

  return {
    tooltip: { ...TOOLTIP_STYLE, trigger: "axis", formatter: ((params: any[]) => {
      const real = params.find(p => p.seriesName !== "Invisible");
      if (!real) return "";
      return `${data[0].name}<br/><strong>${formatValue(real.value)}</strong>`;
    }) as any},
    grid: { top: 16, right: 16, bottom: 64, left: 80 },
    xAxis: { type: "category", data: data.map(d => d.name), ...AXIS_STYLE, axisLabel: { ...AXIS_STYLE.axisLabel, rotate: 15 } },
    yAxis: { type: "value", ...AXIS_STYLE, axisLabel: { ...AXIS_STYLE.axisLabel, formatter: formatValue } },
    series: [
      { type: "bar", stack: "total", itemStyle: { color: "transparent", borderColor: "transparent" }, data: transparent, emphasis: { itemStyle: { color: "transparent" } } },
      { name: "Gain", type: "bar", stack: "total", data: positive, itemStyle: { color: "#22c55e", borderRadius: [4, 4, 0, 0] }, barMaxWidth: 50 },
      { name: "Loss", type: "bar", stack: "total", data: negative, itemStyle: { color: "#ef4444", borderRadius: [0, 0, 4, 4] }, barMaxWidth: 50 },
    ],
  };
}

// ─── Sunburst Chart ──────────────────────────────────
export function buildSunburstChart(data: { name: string; value?: number; children?: { name: string; value: number }[] }[]): EChartsOption {
  return {
    tooltip: { ...TOOLTIP_STYLE },
    series: [{
      type: "sunburst",
      data: data.map((d, i) => ({ ...d, itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] } })),
      radius: ["15%", "85%"],
      label: { fontSize: 10, color: "#e2e8f0" },
      emphasis: { itemStyle: { shadowBlur: 10 } },
    }],
  };
}

// ─── Bubble Chart ────────────────────────────────────
export function buildBubbleChart(data: { name: string; x: number; y: number; size: number; category?: string }[]): EChartsOption {
  return buildScatterChart(data.map(d => ({ ...d })), { xLabel: "Revenue", yLabel: "Profit" });
}

// ─── Histogram ───────────────────────────────────────
export function buildHistogram(values: number[], bins = 10, label = "Count"): EChartsOption {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / bins;
  const counts = Array(bins).fill(0);
  values.forEach((v) => {
    const idx = Math.min(Math.floor((v - min) / binSize), bins - 1);
    counts[idx]++;
  });
  const labels = Array.from({ length: bins }, (_, i) => formatValue(min + i * binSize));
  return buildBarChart(labels, [{ name: label, data: counts, color: CHART_COLORS[0] }]);
}

// ─── Sparkline ───────────────────────────────────────
export function buildSparkline(data: number[], color = CHART_COLORS[0], positive = true): EChartsOption {
  return {
    grid: { top: 2, right: 2, bottom: 2, left: 2 },
    xAxis: { type: "category", show: false, data: data.map((_, i) => i) },
    yAxis: { type: "value", show: false },
    series: [{
      type: "line",
      data,
      smooth: true,
      symbol: "none",
      lineStyle: { color, width: 2 },
      areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: `${color}50` }, { offset: 1, color: `${color}05` }] } },
    }],
    animation: false,
  };
}
