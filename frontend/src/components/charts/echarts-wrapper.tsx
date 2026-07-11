"use client";
// components/charts/echarts-wrapper.tsx
// Reusable ECharts wrapper with resize observer and theme

import { useEffect, useRef, memo } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

interface EChartsWrapperProps {
  option: EChartsOption;
  className?: string;
  height?: number | string;
  onReady?: (chart: echarts.ECharts) => void;
}

const EChartsWrapper = memo(function EChartsWrapper({ option, className = "", height = 320, onReady }: EChartsWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current, null, { renderer: "canvas" });
      onReady?.(chartRef.current);
    }

    chartRef.current.setOption(option, { notMerge: false, lazyUpdate: false });

    return () => {};
  }, [option]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      chartRef.current?.resize();
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: typeof height === "number" ? `${height}px` : height, width: "100%" }}
    />
  );
});

export default EChartsWrapper;
