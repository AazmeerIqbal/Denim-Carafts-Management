"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineSummarize } from "react-icons/md";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import Loader from "@/components/Loader";
import AgingSummaryReport from "@/components/Reports/rptAgingSummary";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//mui
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const page = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [listDisplay, setListDisplay] = useState(false);

  // Calculate start and end dates (6 months back and forward)
  const currentDate = new Date();
  const sixMonthsBack = dayjs(currentDate)
    .subtract(6, "month")
    .startOf("month");
  const sixMonthsForward = dayjs(currentDate).add(6, "month").endOf("month");

  // Format date in 'YYYY-MM-DD 00:00:00' format
  const formatDate = (date) => dayjs(date).format("YYYY-MM-DD 00:00:00");

  const [formData, setFormData] = useState({
    companyId: session?.user?.companyId,
    LIT: "1",
    Supplier: "0",
    GstType: "0",
    Currency: "1",
    startDate: sixMonthsBack,
    endDate: sixMonthsForward,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const [suppliers, setSupplier] = useState([]);

  const getCustomerName = async () => {
    try {
      const companyId = session?.user?.companyId;
      const response = await fetch(
        `/api/agingSummary/${companyId}/getSupplierName`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setSupplier(data);
    } catch (error) {
      console.error("Failed to fetch suppliers list:", error);
    }
  };

  useEffect(() => {
    getCustomerName();
  }, [session?.user?.id]);

  const [data, setData] = useState([]);

  const handleGetReport = async () => {
    setLoading(true);

    // Prepare the payload with formatted date values
    const payload = {
      companyId: formData.companyId || null,
      invoiceType: formData.LIT || null,
      gstNonGst: formData.GstType || null,
      currencyCode: formData.Currency || null,
      dateFrom: formatDate(formData.startDate),
      dateTo: formatDate(formData.endDate),
    };

    try {
      const response = await fetch(
        `/api/agingSummary/${formData.companyId}/getReport`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        toast.error(`Error: ${response.statusText}`, {
          position: "top-right",
        });
        throw new Error(`Error: ${response.statusText}`);
      }

      const record = await response.json();
      setData(record);
      setLoading(false);
      setListDisplay(true);

      console.log("Report data:", data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
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
            Payable Summary
          </p>
        </div>
        <div className="overflow-x-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 bg-white rounded-lg shadow-md">
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">
                Local/Import/Tax:
              </label>
              <select
                name="LIT"
                value={formData.LIT}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                <option value="1">Local Purchase</option>
                <option value="0">Select All</option>
                <option value="2">Import</option>
                <option value="3">With Holding Tax</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">
                GST/Non-GST:
              </label>
              <select
                name="GstType"
                value={formData.GstType}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                <option value="0">Select</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">
                Supplier Name:
              </label>
              <select
                name="Supplier"
                value={formData.Supplier}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                <option value="0">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.SupplierID} value={supplier.SupplierID}>
                    {supplier.SupplierName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Currency:</label>
              <select
                name="Currency"
                value={formData.Currency}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                <option value="1">L-Currency</option>
                <option value="0">Select</option>
                <option value="2">F-Currency</option>
              </select>
            </div>

            <div className="flex flex-col">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label={"Start Month & Year"}
                    views={["month", "year"]}
                    value={formData.startDate}
                    format="MM-YYYY"
                    onChange={(newDate) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        startDate: newDate,
                      }))
                    }
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
                    value={formData.endDate}
                    format="MM-YYYY"
                    onChange={(newDate) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        endDate: newDate,
                      }))
                    }
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>

            <div className="flex items-end">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={handleGetReport}
              >
                Get Report
              </button>
            </div>
          </div>
        </div>
      </div>
      {listDisplay ? (
        <AgingSummaryReport
          data={data}
          setListDisplay={setListDisplay}
          details={formData}
        />
      ) : null}
      <ToastContainer />
    </>
  );
};

export default page;
