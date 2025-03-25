import * as echarts from "echarts";
import getInsights from "~/components/scripts/getInsights.js";
import getSummaries from "~/components/scripts/getSummaries.js";

const totalStats = await getInsights();
const recentStats = await getSummaries();

// Enhanced color palette with gradient capability
const colors = {
 primary: [
  "#f4651c",
  "#e74c3c",
  "#3498db",
  "#2ecc71",
  "#9b59b6",
  "#f1c40f",
  "#1abc9c",
  "#e67e22",
  "#34495e",
  "#1a5276"
 ],
 // Gradient definitions
 gradients: (color: string) => ({
  type: "linear",
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
   { offset: 0, color: color },
   { offset: 1, color: echarts.color.modifyAlpha(color, 0.7) }
  ]
 })
};

// Chart initialization options with responsive consideration
const chartOpts = {
 renderer: "svg",
 ssr: true,
 width: 500,
 height: 300
} satisfies echarts.EChartsInitOpts;

// Enhanced common chart configurations
const commonOptions = {
 backgroundColor: "transparent",
 grid: {
  left: "8%",
  right: "8%",
  bottom: "18%",
  top: "22%",
  containLabel: true
 },
 title: {
  left: "center",
  textStyle: {
   color: "#f7f1ee",
   fontWeight: "bold",
   fontSize: 16,
   fontFamily: "sans-serif"
  },
  top: 10
 },
 // Default animation
 animation: true,
 animationDuration: 1000,
 animationEasing: "cubicInOut",
 animationThreshold: 2000
} satisfies echarts.EChartsCoreOption;

// Enhanced axis styling
const xAxisOpts = {
 type: "category" as const,
 nameLocation: "middle" as const,
 nameTextStyle: {
  fontStyle: "italic",
  fontWeight: "bold",
  color: "#f7f1ee",
  padding: [10, 0, 0, 0]
 },
 nameGap: 35,
 axisLine: { lineStyle: { color: "#666", width: 1 } },
 axisTick: { alignWithLabel: true, lineStyle: { color: "#555" } },
 axisLabel: { color: "#f7f1ee", fontSize: 12, rotate: 0, margin: 12 }
};

const yAxisOpts = {
 type: "value" as const,
 name: "Hours",
 nameLocation: "middle" as const,
 nameGap: 45,
 nameTextStyle: {
  fontStyle: "italic",
  fontWeight: "bold",
  color: "#f7f1ee",
  fontSize: 13
 },
 axisLine: {
  show: true,
  lineStyle: { color: "#666" }
 },
 splitLine: {
  lineStyle: {
   color: "rgba(120, 120, 120, 0.2)",
   type: [2, 4] as [number, number]
  }
 },
 axisLabel: { color: "#f7f1ee", formatter: "{value}", fontSize: 11 }
};

// Helper to get a shuffled color array
const getShuffledColors = (count: number) => {
 const shuffledColors = [...colors.primary].sort(() => Math.random() - 0.5);
 return shuffledColors.slice(0, count);
};

// Format time value for tooltips
const formatTimeValue = (hours: number): string => {
 if (hours < 0.01) return "< 1 min";
 const h = Math.floor(hours);
 const m = Math.floor((hours - h) * 60);

 if (h === 0) return `${m} min${m !== 1 ? "s" : ""}`;
 if (m === 0) return `${h} hr${h !== 1 ? "s" : ""}`;
 return `${h} hr${h !== 1 ? "s" : ""} ${m} min${m !== 1 ? "s" : ""}`;
};

// Format hours only for average values (rounded to 1 decimal)
const formatHoursOnly = (hours: number): string => {
 return `${hours.toFixed(1)} hr${hours !== 1 ? "s" : ""}`;
};

export default () => ({
 top: [topProj(), topLang()],
 recent: [recentProj(), recentLang()]
});

const topProj = () => {
 const chart: echarts.ECharts | null = echarts.init(null, null, chartOpts);
 const topProjects = totalStats.data.projects.slice(0, 5);

 // Calculate average for reference line
 const avgValue =
  topProjects.reduce((sum, p) => sum + Number(p.decimal), 0) /
  topProjects.length;
 const chartColors = getShuffledColors(topProjects.length);

 chart.setOption({
  ...commonOptions,
  title: {
   ...commonOptions.title,
   text: "Top 5 Projects",
   subtext: "(last year)",
   subtextStyle: {
    color: "rgba(247, 241, 238, 0.65)",
    fontSize: 12,
    fontWeight: "normal"
   }
  },
  xAxis: {
   ...xAxisOpts,
   data: topProjects.map((p) => p.name),
   name: "Project",
   axisLabel: {
    ...xAxisOpts.axisLabel,
    formatter: (value: string) =>
     value.length > 10 ? value.substring(0, 8) + "..." : value,
    rotate: 0,
    interval: 0
   }
  },
  yAxis: yAxisOpts,
  series: [
   {
    name: "Hours",
    type: "bar",
    barWidth: "50%",
    data: topProjects.map((p, i) => ({
     value: Number(p.decimal),
     text: p.text,
     percent: p.percent.toFixed(1),
     itemStyle: {
      color: colors.gradients(chartColors[i]),
      borderRadius: [6, 6, 0, 0]
     }
    })),
    label: {
     show: true,
     position: "top",
     distance: 35,
     formatter: (params: any) => formatTimeValue(params.data.value),
     fontSize: 12,
     backgroundColor: "rgba(0, 0, 0, 0.6)",
     padding: [3, 6],
     borderRadius: 4,
     rotate: 35,
     offset: [26, 26],
     color: "#fff"
    },
    emphasis: {
     itemStyle: {
      shadowBlur: 10,
      shadowColor: "rgba(0,0,0,0.3)"
     }
    }
   },
   // Add average line
   {
    name: "Average",
    type: "line",
    markLine: {
     silent: true,
     symbol: "none",
     label: {
      formatter: `Avg: ${formatHoursOnly(avgValue)}`,
      position: "insideStartBottom",
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: [2, 4],
      borderRadius: 2,
      color: "#fff",
      fontSize: 10
     },
     lineStyle: {
      color: "#f7f1ee",
      type: "dashed",
      width: 1,
      opacity: 0.8
     },
     data: [{ yAxis: avgValue }]
    }
   }
  ]
 });

 return chart.renderToSVGString();
};

const topLang = () => {
 const chart: echarts.ECharts | null = echarts.init(null, null, chartOpts);
 const topLanguages = totalStats.data.languages.slice(0, 5);

 // Calculate average for reference line
 const avgValue =
  topLanguages.reduce((sum, p) => sum + Number(p.decimal), 0) /
  topLanguages.length;
 const chartColors = getShuffledColors(topLanguages.length);

 chart.setOption({
  ...commonOptions,
  title: {
   ...commonOptions.title,
   text: "Top 5 Languages",
   subtext: "(last year)",
   subtextStyle: {
    color: "rgba(247, 241, 238, 0.65)",
    fontSize: 12,
    fontWeight: "normal"
   }
  },
  xAxis: {
   ...xAxisOpts,
   data: topLanguages.map((p) => p.name),
   name: "Language",
   axisLabel: {
    ...xAxisOpts.axisLabel,
    rotate: 0,
    interval: 0
   }
  },
  yAxis: yAxisOpts,
  series: [
   {
    name: "Hours",
    type: "bar",
    barWidth: "50%",
    data: topLanguages.map((p, i) => ({
     value: Number(p.decimal),
     text: p.text,
     percent: p.percent.toFixed(1),
     itemStyle: {
      color: colors.gradients(chartColors[i]),
      borderRadius: [6, 6, 0, 0]
     }
    })),
    label: {
     show: true,
     position: "top",
     distance: 35,
     formatter: (params: any) => formatTimeValue(params.data.value),
     fontSize: 12,
     backgroundColor: "rgba(0, 0, 0, 0.6)",
     padding: [3, 6],
     borderRadius: 4,
     rotate: 35,
     offset: [26, 26],
     color: "#fff"
    },
    emphasis: {
     itemStyle: {
      shadowBlur: 10,
      shadowColor: "rgba(0,0,0,0.3)"
     }
    }
   },
   // Add average line
   {
    name: "Average",
    type: "line",
    markLine: {
     silent: true,
     symbol: "none",
     label: {
      formatter: `Avg: ${formatHoursOnly(avgValue)}`,
      position: "insideStartBottom",
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: [2, 4],
      borderRadius: 2,
      color: "#fff",
      fontSize: 10
     },
     lineStyle: {
      color: "#f7f1ee",
      type: "dashed",
      width: 1,
      opacity: 0.8
     },
     data: [{ yAxis: avgValue }]
    }
   }
  ]
 });

 return chart.renderToSVGString();
};

const recentLang = () => {
 const chart: echarts.ECharts | null = echarts.init(null, null, chartOpts);

 // Get the top 5 languages across all days
 const allLanguages = new Map<string, number>();
 recentStats.data.forEach((day) => {
  day.languages.forEach((lang) => {
   if (!allLanguages.has(lang.name)) allLanguages.set(lang.name, 0);
   allLanguages.set(
    lang.name,
    allLanguages.get(lang.name)! + Number(lang.decimal)
   );
  });
 });

 const topLanguages = [...allLanguages.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([name]) => name);

 // Prepare data for each day
 const dayTopLanguages = recentStats.data.map((day) => {
  const dayLangMap = new Map<string, number>();
  topLanguages.forEach((lang) => {
   const langData = day.languages.find((l) => l.name === lang);
   dayLangMap.set(lang, langData ? Number(langData.decimal) : 0);
  });
  return dayLangMap;
 });

 // Get dates for x-axis
 const dayLabels = getLast7Days();
 const chartColors = getShuffledColors(topLanguages.length);

 // Calculate total coding time per day for tooltip
 const dailyTotals = recentStats.data.map((day) =>
  day.grand_total ? Number(day.grand_total.decimal) : 0
 );

 // Calculate daily average for the entire week
 const dailyAverage =
  dailyTotals.reduce((sum, val) => sum + val, 0) / dailyTotals.length;

 // Prepare data series
 const series = topLanguages.map((langName, langIndex) => {
  return {
   name: langName,
   type: "bar",
   stack: "total",
   barWidth: "60%",
   emphasis: {
    focus: "series",
    itemStyle: {
     shadowBlur: 10,
     shadowColor: "rgba(0,0,0,0.3)"
    }
   },
   itemStyle: {
    color: colors.gradients(chartColors[langIndex])
   },
   data: recentStats.data.map((day, dayIndex) => {
    const lang = day.languages.find((l) => l.name === langName);
    const value = lang ? Number(lang.decimal) : 0;

    // Determine if this language is the top one for this day
    const dayMap = dayTopLanguages[dayIndex];
    let isTopBar = true;
    for (let i = langIndex + 1; i < topLanguages.length; i++) {
     if (dayMap.get(topLanguages[i])! > 0) {
      isTopBar = false;
      break;
     }
    }

    return {
     value,
     name: lang?.name,
     itemStyle: {
      borderRadius: isTopBar && value > 0 ? [6, 6, 0, 0] : [0, 0, 0, 0]
     }
    };
   })
  };
 });

 chart.setOption({
  ...commonOptions,
  title: {
   ...commonOptions.title,
   text: "Recent Language Activity"
  },
  legend: {
   data: topLanguages,
   textStyle: { color: "#f7f1ee", fontSize: 11 },
   top: "bottom",
   icon: "roundRect",
   itemWidth: 12,
   itemHeight: 12,
   itemGap: 10,
   padding: 10
  },
  color: chartColors,
  xAxis: {
   ...xAxisOpts,
   data: dayLabels,
   name: "Date",
   axisLabel: {
    ...xAxisOpts.axisLabel,
    fontSize: 11,
    margin: 15
   }
  },
  yAxis: yAxisOpts,
  series: [
   ...series,
   // Add average line across all days
   {
    name: "Daily Average",
    type: "line",
    markLine: {
     silent: true,
     symbol: "none",
     label: {
      formatter: `Daily Avg: ${formatHoursOnly(dailyAverage)}`,
      position: "insideStartBottom",
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: [3, 6],
      borderRadius: 3,
      color: "#fff",
      fontSize: 10
     },
     lineStyle: {
      color: "#f7f1ee",
      type: "dashed",
      width: 1,
      opacity: 0.8
     },
     data: [{ yAxis: dailyAverage }]
    }
   }
  ]
 });

 return chart.renderToSVGString();
};

const recentProj = () => {
 const chart: echarts.ECharts | null = echarts.init(null, null, chartOpts);

 // Get the top 5 projects across all days
 const allProjects = new Map<string, number>();
 recentStats.data.forEach((day) => {
  day.projects?.forEach((proj) => {
   if (!allProjects.has(proj.name)) {
    allProjects.set(proj.name, 0);
   }
   allProjects.set(
    proj.name,
    allProjects.get(proj.name)! + Number(proj.decimal)
   );
  });
 });

 const topProjects = [...allProjects.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([name]) => name);

 // Prepare data for each day
 const dayTopProjects = recentStats.data.map((day) => {
  const dayProjMap = new Map<string, number>();
  topProjects.forEach((proj) => {
   const projData = day.projects?.find((p) => p.name === proj);
   dayProjMap.set(proj, projData ? Number(projData.decimal) : 0);
  });
  return dayProjMap;
 });

 // Get dates for x-axis
 const dayLabels = getLast7Days();
 const chartColors = getShuffledColors(topProjects.length);

 // Calculate total coding time per day for tooltip
 const dailyTotals = recentStats.data.map((day) =>
  day.grand_total ? Number(day.grand_total.decimal) : 0
 );

 // Calculate daily average for the entire week
 const dailyAverage =
  dailyTotals.reduce((sum, val) => sum + val, 0) / dailyTotals.length;

 // Prepare data series
 const series = topProjects.map((projName, projIndex) => {
  return {
   name: projName,
   type: "bar",
   stack: "total",
   barWidth: "60%",
   emphasis: {
    focus: "series",
    itemStyle: {
     shadowBlur: 10,
     shadowColor: "rgba(0,0,0,0.3)"
    }
   },
   itemStyle: {
    color: colors.gradients(chartColors[projIndex])
   },
   data: recentStats.data.map((day, dayIndex) => {
    const proj = day.projects?.find((p) => p.name === projName);
    const value = proj ? Number(proj.decimal) : 0;

    // Determine if this project is the top one for this day
    const dayMap = dayTopProjects[dayIndex];
    let isTopBar = true;
    for (let i = projIndex + 1; i < topProjects.length; i++) {
     if (dayMap.get(topProjects[i])! > 0) {
      isTopBar = false;
      break;
     }
    }

    return {
     value,
     name: proj?.name,
     itemStyle: {
      borderRadius: isTopBar && value > 0 ? [6, 6, 0, 0] : [0, 0, 0, 0]
     }
    };
   })
  };
 });

 chart.setOption({
  ...commonOptions,
  title: {
   ...commonOptions.title,
   text: "Recent Project Activity"
  },
  legend: {
   data: topProjects,
   textStyle: { color: "#f7f1ee", fontSize: 11 },
   top: "bottom",
   icon: "roundRect",
   itemWidth: 12,
   itemHeight: 12,
   itemGap: 10,
   padding: 10,
   formatter: function (name: string) {
    return name.length > 12 ? name.substring(0, 10) + "..." : name;
   }
  },
  color: chartColors,
  xAxis: {
   ...xAxisOpts,
   data: dayLabels,
   name: "Date",
   axisLabel: {
    ...xAxisOpts.axisLabel,
    fontSize: 11,
    margin: 15
   }
  },
  yAxis: yAxisOpts,
  series: [
   ...series,
   // Add average line across all days
   {
    name: "Daily Average",
    type: "line",
    markLine: {
     silent: true,
     symbol: "none",
     label: {
      formatter: `Daily Avg: ${formatHoursOnly(dailyAverage)}`,
      position: "insideStartBottom",
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: [3, 6],
      borderRadius: 3,
      color: "#fff",
      fontSize: 10
     },
     lineStyle: {
      color: "#f7f1ee",
      type: "dashed",
      width: 1,
      opacity: 0.8
     },
     data: [{ yAxis: dailyAverage }]
    }
   }
  ]
 });

 return chart.renderToSVGString();
};

// Get formatted last 7 days for x-axis labels
const getLast7Days = (): string[] => {
 const days = [];
 const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

 for (let i = 6; i >= 0; i--) {
  const date = new Date();
  date.setDate(date.getDate() - i);
  days.push(dayNames[date.getDay()]);
 }
 return days;
};
