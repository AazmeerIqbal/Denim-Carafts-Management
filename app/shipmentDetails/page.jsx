"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ShipmentDetails from "@/components/Reports/ShipmentDetails";

const page = () => {
  const [shipmentDetails, setshipmentDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const getShipmentDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/getShipmentDetails/${session?.user?.companyId || 1}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        console.error(`Error: ${response.statusText}`);
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Set all states first
      await Promise.all([setshipmentDetails(data.orderDetails)]);
    } catch (error) {
      console.error("Failed to fetch cash and bank positions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getShipmentDetails();
  }, []);

  return (
    <div className="px-6 md:py-6 py-20">
      <div className="">
        <ShipmentDetails
          isLoading={isLoading}
          shipmentDetails={shipmentDetails}
        />
      </div>
    </div>
  );
};

export default page;
