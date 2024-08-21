"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useSession, signIn } from "next-auth/react";
import FabricReport from "@/components/Reports/FabricList";

//mui
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

const FabricList = () => {
  const { data: session } = useSession();
  const [listDisplay, setListDisplay] = useState(false);
  const [list, setList] = useState([]);

  const [formData, setFormData] = useState({
    companyId: session?.user?.companyId,
    location: "1",
    showHide: "1",
    groupHead: "",
    qtyMin: "",
    qtyMax: "",
    dtFrom: "2020-01-01",
    dtTo: dayjs().toDate(),
    reportFormat: "Preview",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    // Log the change immediately to verify the value being set
    console.log(name, value); // This will show the updated values as you change the fields
  };

  // const handleDateChange = (name, date) => {
  //   setFormData({
  //     ...formData,
  //     [name]: date ? dayjs(date).format("YYYY-MM-DD") : null,
  //   });
  // };

  ////////////////////////////////////////////////////////////////

  //Load Company Dropdown
  const [companies, setCompanies] = useState([]);

  const getCompanyDropdown = async () => {
    try {
      const companyId = session?.user?.companyId;
      const response = await fetch(
        `/api/[fabricList]/getCompanyDropdown?companyId=${companyId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setCompanies(data);
      console.log("Fetched company list:", data); // Corrected to use the fetched data
      // Handle the data (e.g., display it in a table or another UI component)
    } catch (error) {
      console.error("Failed to fetch company list:", error);
    }
  };

  //Fill Group Head Dorpdown
  const [groupHeads, setGroupHeads] = useState([]);

  const getGroupHeadDropdown = async () => {
    try {
      const response = await fetch(
        `/api/[fabricList]/getGroupHeadDropdown?companyId=${formData.companyId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setGroupHeads(data);
      console.log(groupHeads);
    } catch (error) {
      console.error("Failed to fetch group head list:", error);
    }
  };

  useEffect(() => {
    getCompanyDropdown();
    getGroupHeadDropdown();
  }, [session?.user?.id]);

  ///// Get Fabric List
  const handleGetReport = async () => {
    const queryParams = new URLSearchParams();

    Object.keys(formData).forEach((key) => {
      queryParams.append(key, formData[key] || null);
    });

    try {
      const response = await fetch(
        `/api/[fabricList]/getFabricList?${queryParams.toString()}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        toast.error(`Error: ${response.statusText}`, {
          position: "top-right",
        });
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setList(data);
      setListDisplay(true);
      console.log("Fetched fabric list:", data);
      // Handle the data (e.g., display it in a table or another UI component)
    } catch (error) {
      console.error("Failed to fetch fabric list:", error);
    }
  };

  // const chunkedUsers = chunkArray(users, 3);

  return (
    <>
      <div className="m-2 md:m-8 mt-24 p-2 md:p-10 bg-white rounded-3xl drop-shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Fabric List
          </h2>
        </div>
        <div className="overflow-x-auto">
          <div className="mt-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 bg-white rounded-lg shadow-md">
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Location:</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                {companies.map((company) => (
                  <option key={company.BranchID} value={company.BranchID}>
                    {company.BranchName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Show/Hide:</label>
              <select
                name="showHide"
                value={formData.showHide}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                <option value="1" default>
                  Show
                </option>
                <option value="0">All</option>
                <option value="2">Hide</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Group Head:</label>
              <select
                name="groupHead"
                value={formData.groupHead}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                <option value="">Select Group Head</option>
                {groupHeads.map((group) => (
                  <option key={group.ItemGroupId} value={group.ItemGroupId}>
                    {group.ItemGroupName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Qty min:</label>
              <input
                type="text"
                name="qtyMin"
                value={formData.qtyMin}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Qty max:</label>
              <input
                type="text"
                name="qtyMax"
                value={formData.qtyMax}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              />
            </div>

            {/* <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Dt From:</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={formData.dtFrom ? dayjs(formData.dtFrom) : null}
                  onChange={(date) => handleDateChange("dtFrom", date)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Dt To:</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={formData.dtTo ? dayjs(formData.dtTo) : null}
                  onChange={(date) => handleDateChange("dtTo", date)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </div> */}

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
        <FabricReport
          data={list}
          setListDisplay={setListDisplay}
          cc={formData.companyId}
          bi={formData.location}
          df={dayjs(formData.dtFrom).format("DD-MM-YYYY")}
          dt={dayjs(formData.dtTo).format("DD-MM-YYYY")}
          ghn={formData.groupHead}
        />
      ) : (
        <></>
      )}
      <ToastContainer />
    </>
  );
};

export default FabricList;
