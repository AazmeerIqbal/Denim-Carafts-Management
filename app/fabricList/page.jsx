"use client";

import React, { useEffect, useState } from "react";

//mui
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

const FabricList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const chunkedUsers = chunkArray(users, 3);

  return (
    <div className="m-2 md:m-8 mt-24 p-2 md:p-10 bg-white rounded-3xl drop-shadow-xl">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Fabric List
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-300 table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left border-b border-gray-300">
                Location
              </th>
              <th className="py-2 px-4 text-left border-b border-gray-300">
                Show/Hide
              </th>
              <th
                className="py-2 px-4 text-left border-b border-gray-300"
                style={{ width: "50px" }}
              >
                Group Head
              </th>
              <th className="py-2 px-4 text-left border-b border-gray-300">
                Qty min
              </th>
              <th className="py-2 px-4 text-left border-b border-gray-300">
                Qty max
              </th>
              <th className="py-2 px-4 text-left border-b border-gray-300">
                Dt From
              </th>
              <th className="py-2 px-4 text-left border-b border-gray-300">
                Dt To
              </th>
              <th className="py-2 px-4 text-left border-b border-gray-300">
                Report Format
              </th>
              <th className="py-2 px-4 text-left border-b border-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b border-gray-300">
                <select className="w-full bg-white border border-gray-300 rounded-md">
                  <option value="1">Location 1</option>
                  <option value="2">Location 2</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                <select className="w-full bg-white border border-gray-300 rounded-md">
                  <option value="0">All</option>
                  <option value="1">Show</option>
                  <option value="2">Hide</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                <select className="w-full bg-white border border-gray-300 rounded-md">
                  <option value="1">Group Head 1</option>
                  <option value="2">Group Head 2</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                <input
                  type="text"
                  className="w-full bg-white border border-gray-300 rounded-md"
                />
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                <input
                  type="text"
                  className="w-full bg-white border border-gray-300 rounded-md"
                />
              </td>
              <td className="py-2 px-4 border-b border-gray-300 w-16">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker format="DD/MM/YYYY" />
                  </DemoContainer>
                </LocalizationProvider>
              </td>
              <td className="py-2 px-4 border-b border-gray-300 w-16">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker format="DD/MM/YYYY" />
                  </DemoContainer>
                </LocalizationProvider>
              </td>

              <td className="py-2 px-4 border-b border-gray-300">
                <select
                  className="w-full bg-white border border-gray-300 rounded-md"
                  disabled
                >
                  <option value="0">Preview</option>
                  <option value="1">Export In Excel</option>
                  <option value="2">Export In PDF</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                <button className="bg-blue-500 text-white py-1 px-3 rounded-md">
                  Get Report
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FabricList;
