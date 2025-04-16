"use client";
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { MdOutlineSummarize } from "react-icons/md";
import Autocomplete from "@mui/material/Autocomplete";
import { useStateContext } from "@/components/contexts/ContextProvider";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";
import JobCostReport from "@/components/Reports/JobCostReport";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { currentColor } = useStateContext();
  const { data: session } = useSession();
  const [selectedItem, setSelectedItem] = useState(null);

  const [listDisplay, setListDisplay] = useState(false);

  const [loading, setLoading] = useState(false); // New state to handle loader visibility

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/jobCost/job-no/${inputValue}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    if (inputValue.length > 1) {
      fetchItems();
    } else {
      setItems([]); // Clear items if input length is <= 1
    }
  }, [inputValue]);

  const [Data, setData] = useState([]);
  const [jobCost, setjobCost] = useState([]);
  const [ReciptStatus, setReciptStatus] = useState([]);

  const handleGetReport = async () => {
    if (!selectedItem || !session?.user?.companyId) {
      toast.error(`Please Select Job No`, {
        position: "top-right",
      });
      return;
    }

    const companyId = session?.user?.companyId;
    const cusOrderID = selectedItem.CusOrderId;

    // Proceed with API call or further logic
    // console.log("Selected CusOrderId:", cusOrderID);
    // console.log("CompanyId:", companyId);

    try {
      setLoading(true);
      const response = await fetch(`/api/jobCost/getReport/${companyId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: companyId,
          CusOrderID: cusOrderID,
          SP: "sp_Cus_Order_mst_sel",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get Data");
      }

      const reportData = await response.json();
      // console.log("Report data:", reportData);

      setData(reportData);

      ////////////////////////////Job Cost Detail/////////////////////////////////

      const response2 = await fetch(`/api/jobCost/getReport/${companyId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: companyId,
          CusOrderID: cusOrderID,
          SP: "sp_Cus_Order_det_Sel_Cost_Job",
        }),
      });

      if (!response2.ok) {
        throw new Error("Failed to get Job Cost report");
      }

      const reportData2 = await response2.json();
      // console.log("Report data Job Cost:", reportData2);

      setjobCost(reportData2);

      ////////////////////////////Set Receipt Status/////////////////////////////////

      if (Data.length > 0) {
        const response3 = await fetch(
          `/api/jobCost/getReciptStatus/${companyId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              companyId: companyId,
              CusOrderID: Data[0].CusOrderId,
            }),
          }
        );

        if (!response3.ok) {
          throw new Error("Failed to get Job Cost report");
        }

        const reportData3 = await response3.json();
        console.log("Report Receipt Status:", reportData3);

        setReciptStatus(reportData3);
      }

      setLoading(false);
      setListDisplay(true);
    } catch (error) {
      console.error("Error fetching report:", error);
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
            Job Cost
          </p>
        </div>
        <div className="my-8 flex flex-row items-center gap-4 flex-wrap">
          <div>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={items}
              getOptionLabel={(option) => option.JobNo}
              isOptionEqualToValue={(option, value) =>
                option.JobNo === value.JobNo
              } // Ensure this matches correctly
              onInputChange={(event, newInputValue) =>
                setInputValue(newInputValue)
              }
              onChange={(event, newValue) => setSelectedItem(newValue)}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Search Job No" />
              )}
            />
          </div>

          <div>
            <button
              type="button"
              style={{
                backgroundColor: currentColor,
                borderRadius: "10px",
              }}
              className="text-sm text-white p-3 hover:drop-shadow-xl w-full cursor-pointer"
              onClick={handleGetReport}
            >
              Get Report
            </button>
          </div>
        </div>
      </div>
      {listDisplay ? (
        <JobCostReport
          setListDisplay={setListDisplay}
          data={Data}
          jobCostData={jobCost}
          ReciptStatus={ReciptStatus}
        />
      ) : null}
      <ToastContainer />
    </>
  );
};

export default Page;
