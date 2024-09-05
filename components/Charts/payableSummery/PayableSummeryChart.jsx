import React from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  LineSeries,
  Legend,
  Tooltip,
  DataLabel,
  Category,
} from "@syncfusion/ej2-react-charts";
import { registerLicense } from "@syncfusion/ej2-base";

import { useStateContext } from "@/components/contexts/ContextProvider";

// Register the Syncfusion license key
registerLicense(process.env.REACT_APP_SYNCFUSION_LICENSE_KEY);

const PayableSummeryCharLoad = ({ data }) => {
  const { currentMode } = useStateContext();

  const chartData = [
    { range: "0 to 30", amount: data[0].Between0To30 },
    { range: "31 to 60", amount: data[0].Between31To60 },
    { range: "61 to 90", amount: data[0].Between61To90 },
    { range: "Above 90", amount: data[0].Above90 },
  ];

  return (
    <ChartComponent
      // title="Payable Summary Chart"
      primaryXAxis={{ valueType: "Category" }}
      // primaryYAxis={{ title: "Amount" }}
      tooltip={{ enable: true }}
      legendSettings={{
        visible: true,
        position: "Bottom",
        background: "white",
      }}
      background={currentMode === "Dark" ? "#29314f" : "#fff"}
      chartArea={{ border: { width: 0 } }}
    >
      {/* Inject LineSeries and other required services */}
      <Inject services={[LineSeries, Legend, Tooltip, DataLabel, Category]} />
      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={chartData}
          xName="range"
          yName="amount"
          type="Line" // Set the chart type to 'Line'
          marker={{
            visible: true,
            width: 10,
            height: 10,
            dataLabel: {
              visible: true,
              position: "Top",
              font: { fontWeight: "600" },
            },
          }}
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default PayableSummeryCharLoad;
