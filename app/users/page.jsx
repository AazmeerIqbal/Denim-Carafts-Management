"use client";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Usercolumns } from "@/data/dummy";
import { IoSearch } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    console.log("Users data:", users);
  }, [users]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="m-2 md:m-8 mt-24 p-2 md:p-10 bg-white rounded-3xl drop-shadow-xl">
      <div className="flex items-center gap-4">
        <FaUsers className="text-3xl" />
        <p className="text-3xl font-extrabold tracking-tight text-slate-900">
          Users
        </p>
      </div>
      <div className="mt-8">
        <div className="relative">
          <span className="absolute top-2.5 left-0 flex items-center pl-3">
            <IoSearch className="text-gray-400 text-xl" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-2 pl-10 mb-4 border border-gray-300 rounded-lg w-full"
          />
        </div>
        <div className="overflow-x-auto">
          <DataGrid
            rows={filteredUsers}
            columns={Usercolumns}
            getRowId={(row) => row.UserId}
            rowSelection={false}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            autoHeight
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
