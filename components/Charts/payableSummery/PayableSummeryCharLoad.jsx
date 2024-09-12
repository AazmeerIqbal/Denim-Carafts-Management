"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import PayableSummeryChart from "./PayableSummeryChart";

const PayableSummeryCharLoad = () => {
  const [ChartData, setChartData] = useState([]);
  const { data: session } = useSession();

  const companyId = session?.user?.companyId.toString();

  const handleGetReport = async () => {
    try {
      const response = await fetch(
        `/api/charts/payableSummeryChart/${companyId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chart data");
      }

      const data = await response.json();
      setChartData(data);
      console.log(ChartData);
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
      {ChartData.length > 0 ? <PayableSummeryChart data={ChartData} /> : null}
    </div>
  );
};

export default PayableSummeryCharLoad;
