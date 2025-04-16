// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { useStateContext } from "@/components/contexts/ContextProvider";

// // Custom formatter function to format numbers with commas and shorten large values
// const formatYAxis = (value) => {
//   if (value >= 1000000000) {
//     return `${(value / 1000000000).toFixed(1)}B`; // Billion
//   } else if (value >= 1000000) {
//     return `${(value / 1000000).toFixed(1)}M`; // Million
//   } else if (value >= 1000) {
//     return `${(value / 1000).toFixed(1)}K`; // Thousand
//   }
//   return value.toLocaleString(); // Comma-separating values smaller than 1000
// };

// // Format tooltips to show comma-separated amounts
// const formatTooltip = (value) => {
//   return value.toLocaleString(); // Adds commas in the tooltip
// };

// const PayableSummeryImportChart = ({ data, dataImport }) => {
//   const { currentMode, currentColor } = useStateContext();

//   // Format the data for recharts
//   const formattedData = [
//     {
//       name: "0 to 30",
//       local: data[0].Between0To30,
//       import: dataImport[0].Between0To30,
//     },
//     {
//       name: "31 to 60",
//       local: data[0].Between31To60,
//       import: dataImport[0].Between31To60,
//     },
//     {
//       name: "61 to 90",
//       local: data[0].Between61To90,
//       import: dataImport[0].Between61To90,
//     },
//     { name: "Above 90", local: data[0].Above90, import: dataImport[0].Above90 },
//   ];

//   return (
//     <div className="w-full h-full mx-auto">
//       <div className="relative h-[300px] md:h-[400px]">
//         <ResponsiveContainer width="95%" height="100%">
//           <LineChart data={formattedData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis tickFormatter={formatYAxis} />{" "}
//             {/* Format the Y-axis with commas */}
//             <Tooltip formatter={formatTooltip} />{" "}
//             {/* Comma-separate values in tooltips */}
//             <Legend />
//             {/* Local Data */}
//             <Line
//               type="monotone"
//               dataKey="local"
//               stroke={currentColor} // Color for local data
//               activeDot={{ r: 2 }}
//               name="Local" // Legend label for local data
//             />
//             {/* Import Data */}
//             <Line
//               type="monotone"
//               dataKey="import"
//               stroke="#ff0000" // Different color for import data
//               activeDot={{ r: 2 }}
//               name="Import" // Legend label for import data
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default PayableSummeryImportChart;

import React from "react";
import dynamic from "next/dynamic";
import { useStateContext } from "@/components/contexts/ContextProvider";

// Dynamically import ApexCharts to support SSR
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const PayableSummeryImportChart = ({ dataImport }) => {
  const { currentMode, currentColor } = useStateContext();

  // Format the data for ApexCharts
  const categories = ["0 to 30", "31 to 60", "61 to 90", "Above 90"];
  const importData = [
    dataImport[0].Between0To30,
    dataImport[0].Between31To60,
    dataImport[0].Between61To90,
    dataImport[0].Above90,
  ];

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false }, // Disable toolbar for a cleaner look
      zoom: { enabled: false }, // Disable zoom functionality
    },
    theme: {
      mode: currentMode, // Use dark or light mode dynamically
    },
    stroke: {
      curve: "smooth", // Smooth line
      width: 2,
    },
    grid: {
      borderColor: "#e7e7e7",
      strokeDashArray: 4, // Dashed grid lines
    },
    xaxis: {
      categories, // X-axis labels
      title: {
        text: "Aging Days",
        style: {
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      title: {
        text: "Amount",
        style: {
          fontWeight: 600,
        },
      },
      labels: {
        formatter: (value) => {
          // Format Y-axis values with commas and suffixes (K, M, B)
          if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
          if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
          if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
          return value.toLocaleString();
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => {
          if (value === null || value === undefined || isNaN(value)) return "0";
          return value.toLocaleString();
        },
      },
    },
    
    colors: ["#ff0000"], // Set color for the line
  };

  const chartSeries = [
    {
      name: "Import",
      data: importData, // Only import data is displayed
    },
  ];

  return (
    <div className="w-full h-full mx-auto">
      <div className="relative h-[300px] md:h-[400px]">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height="100%"
        />
      </div>
    </div>
  );
};

export default PayableSummeryImportChart;
