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

const PayableSummeryImportChart = ({ data }) => {
  const { currentMode, currentColor } = useStateContext();

  // Format the data for recharts
  const formattedData = [
    { name: "0 to 30", amount: data[0].Between0To30 },
    { name: "31 to 60", amount: data[0].Between31To60 },
    { name: "61 to 90", amount: data[0].Between61To90 },
    { name: "Above 90", amount: data[0].Above90 },
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
            <Line
              type="monotone"
              dataKey="amount"
              stroke={currentColor}
              activeDot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PayableSummeryImportChart;
