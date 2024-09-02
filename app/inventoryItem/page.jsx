"use client";
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { MdOutlineInventory2 } from "react-icons/md";

const Page = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/inventory-items/${inputValue}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    if (inputValue.length > 2) {
      fetchItems();
    }

    if (inputValue.length <= 2) {
      setItems([]);
    }
  }, [inputValue]);

  return (
    <div className="m-2 md:m-8 mt-24 p-2 md:p-10 bg-white rounded-3xl drop-shadow-xl">
      <div className="flex items-center gap-4">
        <MdOutlineInventory2 className="text-3xl" />
        <p className="text-3xl font-extrabold tracking-tight text-slate-900">
          Inventory Items
        </p>
      </div>
      <div className="mt-8">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={items}
          getOptionLabel={(option) => option.Item}
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Search Item" />
          )}
        />
      </div>
    </div>
  );
};

export default Page;
