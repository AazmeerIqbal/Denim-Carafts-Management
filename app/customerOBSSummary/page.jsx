"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineSummarize } from "react-icons/md";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import { useStateContext } from "@/components/contexts/ContextProvider";
import Loader from "@/components/Loader";
import CustomerOBSSummary from "@/components/Reports/customerOBSSummary";

//mui
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const page = () => {
  const { data: session } = useSession();
  const { currentColor } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [listDisplay, setListDisplay] = useState(false);

  // Calculate start and end dates (6 months back and forward)
  const currentDate = new Date();
  const sixMonthsBack = dayjs(currentDate)
    .subtract(6, "month")
    .startOf("month");
  const sixMonthsForward = dayjs(currentDate).add(6, "month").endOf("month");

  const [formData, setFormData] = useState({
    companyId: session?.user?.companyId,
    orderType: "3",
    customer: "0",
    shippedStatus: "1",
    startDate: dayjs(sixMonthsBack).format("YYYY-MM-DD"),
    endDate: dayjs(sixMonthsForward).format("YYYY-MM-DD"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  //Load Customer Name
  const [customers, setCustomers] = useState([]);

  const getCustomerName = async () => {
    try {
      const companyId = session?.user?.companyId;
      const response = await fetch(`/api/OBS/${companyId}/getCustomerName`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch company list:", error);
    }
  };

  useEffect(() => {
    getCustomerName();
  }, [session?.user?.id]);

  const [reportData, setReportData] = useState([]);

  const handleGetReport = async () => {
    setLoading(true);

    try {
      const companyId = session?.user?.companyId;
      const response = await fetch(`/api/OBS/${companyId}/getReport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setReportData(data);
      setLoading(false);
      setListDisplay(true);
      console.log(reportData);
    } catch (error) {
      console.error("Failed to fetch company list:", error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />} {/* Display loader when loading is true */}
      <div className="m-2 md:m-8 mt-24 p-2 md:p-10 bg-white rounded-3xl drop-shadow-xl">
        <div className="flex items-center gap-4">
          <MdOutlineSummarize className="text-3xl" />
          <p className="text-3xl font-extrabold tracking-tight text-slate-900">
            Order Booking Summery
          </p>
        </div>
        <div className="overflow-x-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 bg-white rounded-lg shadow-md">
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Order Type:</label>
              <select
                name="orderType"
                value={formData.orderType}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                <option value="3" default>
                  Export
                </option>
                <option value="0">All</option>
                <option value="1">CMT GST</option>
                <option value="6">CMT Non-GST</option>
                <option value="2">Local Sale GST</option>
                <option value="4">Local Sale Non-GST</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">
                Customer Name:
              </label>
              <select
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                <option value="0">All</option>
                {customers.map((customer) => (
                  <option key={customer.CustomerID} value={customer.CustomerID}>
                    {customer.CustomerName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">
                Shipped/UnShipped:
              </label>
              <select
                name="shippedStatus"
                value={formData.shippedStatus}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                <option value="1" default>
                  Shipment Due
                </option>
                <option value="0">All</option>
                <option value="2">Shipped</option>
                <option value="3">Both</option>
              </select>
            </div>

            <div className="flex flex-col">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label={"Start Month & Year"}
                    views={["month", "year"]}
                    value={sixMonthsBack}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>

            <div className="flex flex-col">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label={"End Month & Year"}
                    views={["month", "year"]}
                    value={sixMonthsForward}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                style={{
                  backgroundColor: currentColor,
                  borderRadius: "10px",
                }}
                className="text-sm text-white p-3 hover:drop-shadow-xl w-[45%] ml-[5%] cursor-pointer"
                onClick={handleGetReport}
              >
                Get Report
              </button>
            </div>
          </div>
        </div>
      </div>
      {listDisplay ? (
        <CustomerOBSSummary data={reportData} setListDisplay={setListDisplay} />
      ) : null}
    </>
  );
};

export default page;
