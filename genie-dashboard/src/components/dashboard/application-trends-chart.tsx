'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { useApplications } from '@/hooks/use-applications';
import { getChartColors, getChartTheme } from '@/lib/chart-theme';

// Dynamic import to avoid SSR issues with ApexCharts
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <ChartSkeleton />
});

function ChartSkeleton() {
  return <div className="h-[300px] animate-pulse bg-muted/50 rounded-lg" />;
}

export function ApplicationTrendsChart() {
  const { data: applications = [], isLoading } = useApplications();

  // Calculate daily counts for last 7 days
  const chartData = useMemo(() => {
    const today = new Date();
    const last7Days: { date: Date; count: number; label: string }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push({
        date,
        count: 0,
        label: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }

    // Count applications per day
    applications.forEach((app) => {
      const appDate = new Date(app.submissionDate);
      appDate.setHours(0, 0, 0, 0);

      const dayIndex = last7Days.findIndex((d) => d.date.getTime() === appDate.getTime());
      if (dayIndex !== -1) {
        last7Days[dayIndex].count++;
      }
    });

    return {
      categories: last7Days.map((d) => d.label),
      data: last7Days.map((d) => d.count)
    };
  }, [applications]);

  const chartColors = getChartColors();
  const chartTheme = getChartTheme();

  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 300,
      fontFamily: 'inherit',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      },
      animations: {
        enabled: true,
        speed: 500
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    colors: [chartColors.primary],
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: chartColors.muted,
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: chartColors.muted,
          fontSize: '12px'
        },
        formatter: (val) => Math.round(val).toString()
      }
    },
    grid: {
      borderColor: chartColors.border,
      strokeDashArray: 4,
      padding: {
        left: 10,
        right: 10
      }
    },
    tooltip: {
      theme: chartTheme,
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: (val) => `${val} application${val !== 1 ? 's' : ''}`
      }
    },
    markers: {
      size: 4,
      colors: [chartColors.primary],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6
      }
    }
  };

  const series = [
    {
      name: 'Applications',
      data: chartData.data
    }
  ];

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Application Trends</h3>
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Application Trends</h3>
      <ReactApexChart options={options} series={series} type="area" height={300} />
    </div>
  );
}
