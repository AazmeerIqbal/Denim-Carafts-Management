import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useStateContext } from "@/components/contexts/ContextProvider";

// Custom formatter function to format numbers with commas and shorten large values
const formatYAxis = (value) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`; // Billion
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`; // Million
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`; // Thousand
  }
  return value.toLocaleString(); // Comma-separating values smaller than 1000
};

// Format tooltips to show comma-separated amounts
const formatTooltip = (value) => {
  return value.toLocaleString(); // Adds commas in the tooltip
};

const PayableSummeryImportChart = ({ data, dataImport }) => {
  const { currentMode, currentColor } = useStateContext();

  // Format the data for recharts
  const formattedData = [
    {
      name: "0 to 30",
      local: data[0].Between0To30,
      import: dataImport[0].Between0To30,
    },
    {
      name: "31 to 60",
      local: data[0].Between31To60,
      import: dataImport[0].Between31To60,
    },
    {
      name: "61 to 90",
      local: data[0].Between61To90,
      import: dataImport[0].Between61To90,
    },
    { name: "Above 90", local: data[0].Above90, import: dataImport[0].Above90 },
  ];

  return (
    <div className="w-full h-full mx-auto">
      <div className="relative h-[300px] md:h-[400px]">
        <ResponsiveContainer width="95%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatYAxis} />{" "}
            {/* Format the Y-axis with commas */}
            <Tooltip formatter={formatTooltip} />{" "}
            {/* Comma-separate values in tooltips */}
            <Legend />
            {/* Local Data */}
            <Line
              type="monotone"
              dataKey="local"
              stroke={currentColor} // Color for local data
              activeDot={{ r: 2 }}
              name="Local" // Legend label for local data
            />
            {/* Import Data */}
            <Line
              type="monotone"
              dataKey="import"
              stroke="#ff0000" // Different color for import data
              activeDot={{ r: 2 }}
              name="Import" // Legend label for import data
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PayableSummeryImportChart;
