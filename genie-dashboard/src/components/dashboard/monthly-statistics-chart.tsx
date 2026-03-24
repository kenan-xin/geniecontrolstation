"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { useApplications } from "@/hooks/use-applications";

// Dynamic import to avoid SSR issues with ApexCharts
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

function ChartSkeleton() {
  return (
    <div className="h-[200px] animate-pulse bg-muted/50 rounded-lg" />
  );
}

export function MonthlyStatisticsChart() {
  const { data: applications = [], isLoading } = useApplications();

  // Calculate monthly counts for current year
  const chartData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const months: { count: number; label: string }[] = [];

    // Initialize all 12 months
    for (let i = 0; i < 12; i++) {
      months.push({
        count: 0,
        label: new Date(currentYear, i, 1).toLocaleDateString("en-US", {
          month: "short",
        }),
      });
    }

    // Count applications per month
    applications.forEach((app) => {
      const appDate = new Date(app.submissionDate);
      if (appDate.getFullYear() === currentYear) {
        months[appDate.getMonth()].count++;
      }
    });

    return {
      categories: months.map((m) => m.label),
      data: months.map((m) => m.count),
      total: months.reduce((sum, m) => sum + m.count, 0),
    };
  }, [applications]);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 200,
      fontFamily: "inherit",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 500,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    colors: ["#2563eb"], // blue-600
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: "#64748b", // slate-500
          fontSize: "11px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748b", // slate-500
          fontSize: "11px",
        },
        formatter: (val) => Math.round(val).toString(),
      },
    },
    grid: {
      borderColor: "#e2e8f0", // slate-200
      strokeDashArray: 4,
      padding: {
        left: 10,
        right: 10,
      },
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: (val) => `${val} application${val !== 1 ? "s" : ""}`,
      },
    },
  };

  const series = [
    {
      name: "Applications",
      data: chartData.data,
    },
  ];

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            This Month Statistics
          </h3>
          <span className="text-2xl font-semibold">
            <span className="inline-block w-8 h-6 bg-muted animate-pulse rounded" />
          </span>
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          This Month Statistics
        </h3>
        <span className="text-2xl font-semibold">{chartData.total}</span>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={200}
      />
    </div>
  );
}
