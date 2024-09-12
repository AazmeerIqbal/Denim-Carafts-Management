"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import PayableSummeryImportChart from "./PayableSummeryImportChart";

const PayableSummeryImportChartLoad = () => {
  const [ChartDataImport, setChartDataImport] = useState([]);
  const { data: session } = useSession();

  const companyId = session?.user?.companyId.toString();

  const handleGetReport = async () => {
    try {
      const response = await fetch(
        `/api/charts/payableSummeryChartImport/${companyId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chart data");
      }

      const data = await response.json();
      setChartDataImport(data);
      console.log(ChartDataImport);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    if (companyId) {
      handleGetReport();
    }
  }, [companyId]);

  return (
    <div>
      {ChartDataImport.length > 0 ? (
        <PayableSummeryImportChart data={ChartDataImport} />
      ) : null}
    </div>
  );
};

export default PayableSummeryImportChartLoad;
