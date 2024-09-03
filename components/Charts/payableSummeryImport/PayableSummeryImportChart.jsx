import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Register the necessary components for the Doughnut chart
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PayableSummeryImportChart = ({ data }) => {
  const chartData = {
    labels: ["0 to 30", "31 to 60", "61 to 90", "Above 90"],
    datasets: [
      {
        label: "Amount",
        data: [
          data[0].Between0To30,
          data[0].Between31To60,
          data[0].Between61To90,
          data[0].Above90,
        ],
        backgroundColor: ["#FF5733", "#33FFBD", "#FFC300", "#8E44AD"],
        borderColor: ["#FFFFFF"], // Adding white borders for clarity
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom", // Positioning the legend
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `${tooltipItem.label}: ${tooltipItem.raw.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="w-full h-full mx-auto">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default PayableSummeryImportChart;
