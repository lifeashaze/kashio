"use client";

import * as React from "react";
import {
  Legend,
  type LegendProps,
  Tooltip,
  type TooltipProps,
} from "recharts";

import { cn } from "@/lib/utils";

type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

const ChartConfigContext = React.createContext<ChartConfig | null>(null);

function useChartConfig() {
  return React.useContext(ChartConfigContext);
}

function ChartContainer({
  config,
  className,
  children,
}: React.PropsWithChildren<{
  config: ChartConfig;
  className?: string;
}>) {
  const style = React.useMemo(() => {
    const entries = Object.entries(config).map(([key, value]) => [
      `--color-${key}`,
      value.color,
    ]);
    return Object.fromEntries(entries);
  }, [config]);

  return (
    <ChartConfigContext.Provider value={config}>
      <div
        className={cn("w-full", className)}
        style={style as React.CSSProperties}
      >
        {children}
      </div>
    </ChartConfigContext.Provider>
  );
}

function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  valueFormatter,
  className,
}: TooltipProps<number, string> & {
  hideLabel?: boolean;
  valueFormatter?: (value: number | string) => string;
  className?: string;
}) {
  const config = useChartConfig();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-sm",
        className
      )}
    >
      {!hideLabel && label ? (
        <div className="mb-2 text-xs font-medium text-foreground">{label}</div>
      ) : null}
      <div className="space-y-1">
        {payload.map((item) => {
          const key = item.dataKey?.toString() ?? item.name ?? "value";
          const descriptor = config?.[key];
          const color =
            descriptor?.color ??
            item.color ??
            `var(--color-${key})`;
          const name = descriptor?.label ?? item.name ?? key;
          const value = valueFormatter
            ? valueFormatter(item.value ?? 0)
            : String(item.value ?? "");

          return (
            <div key={key} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground">{name}</span>
              <span className="ml-auto font-medium text-foreground">
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartLegendContent({
  payload,
  className,
}: LegendProps & { className?: string }) {
  const config = useChartConfig();

  if (!payload?.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-3 text-xs", className)}>
      {payload.map((item) => {
        const key = item.dataKey?.toString() ?? item.value?.toString() ?? "";
        const descriptor = config?.[key];
        const color =
          descriptor?.color ??
          item.color ??
          `var(--color-${key})`;
        const name = descriptor?.label ?? item.value ?? key;

        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-muted-foreground">{name}</span>
          </div>
        );
      })}
    </div>
  );
}

const ChartTooltip = Tooltip;
const ChartLegend = Legend;

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
};
