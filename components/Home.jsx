"use client";

import React from "react";
import { FaCalendarDays } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { GiWool } from "react-icons/gi";
import { MdManageAccounts } from "react-icons/md";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useStateContext } from "@/components/contexts/ContextProvider";
import chroma from "chroma-js";
import FabricReport from "@/components/Reports/FabricList";
import dayjs from "dayjs";

import PayableSummeryCharLoad from "@/components/Charts/payableSummery/PayableSummeryCharLoad";
import PayableSummeryImportChartLoad from "@/components/Charts/payableSummeryImport/PayableSummeryImportChartLoad";
import BankAndCashPosition from "@/components/Dashboard/BandAndCashPosition";
import Receivable from "@/components/Dashboard/Receivable";
import { GoArrowUpRight } from "react-icons/go";

const Home = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [denimPosition, setDenimPosition] = useState("");
  const [denimData, setDenimData] = useState("");
  const [pocketPosition, setPocketPosition] = useState("");
  const [pocketData, setPocketData] = useState("");
  const [bankPositions, setBankPositions] = useState([]);
  const [cashPositions, setCashPositions] = useState([]);
  const [receivableExport, setReceivableExport] = useState([]);
  const [receivableLocal, setreceivableLocal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentColor } = useStateContext();
  const [listDisplay, setListDisplay] = useState(false);
  const [listData, setListData] = useState(false);

  const lightColor = chroma(currentColor).brighten(1).hex(); // Lighter shade
  const darkColor = chroma(currentColor).darken(1.5).hex(); // Darker shade

  // Get date
  const dtFrom = "2020-01-01";
  const today = new Date();
  const dtTo = today.toISOString().split("T")[0];

  const getFabricPostions = async () => {
    try {
      const response = await fetch(
        `/api/[fabricList]/getFabricList?companyId=1&location=1&showHide=1&groupHead=660&qtyMin=0&qtyMax=null&dtFrom=2020-01-01&dtTo=${dtTo}&reportFormat=Preview`,
        {
          method: "GET",
        }
      );
      // console.log(response);

      if (!response.ok) {
        toast.error(`Error: ${response.statusText}`, {
          position: "top-right",
        });
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setDenimData(data);
      // Calculate the total stock outside of JSX
      const totalStock = data.reduce(
        (acc, item) => (item.BalanceQty1 > 0 ? acc + item.BalanceQty1 : acc),
        0
      );
      setDenimPosition(Number(totalStock.toFixed(3)));
    } catch (error) {
      console.error("Failed to fetch fabric list:", error);
    }
    try {
      const response1 = await fetch(
        `/api/[fabricList]/getFabricList?companyId=1&location=1&showHide=1&groupHead=662&qtyMin=0&qtyMax=null&dtFrom=2020-01-01&dtTo=${dtTo}&reportFormat=Preview`,
        {
          method: "GET",
        }
      );
      // console.log(response1);

      if (!response1.ok) {
        toast.error(`Error: ${response1.statusText}`, {
          position: "top-right",
        });
        throw new Error(`Error: ${response1.statusText}`);
      }

      const data1 = await response1.json();
      setPocketData(data1);
      // Calculate the total stock outside of JSX
      const totalStock1 = data1.reduce(
        (acc, item) => (item.BalanceQty1 > 0 ? acc + item.BalanceQty1 : acc),
        0
      );
      setPocketPosition(Number(totalStock1.toFixed(3)));
    } catch (error) {
      console.error("Failed to fetch fabric list:", error);
    }
  };

  const getCashAndBankPositions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/getCashAndBankPosition/${session?.user?.companyId || 1}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        console.error(`Error: ${response.statusText}`);
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setBankPositions(data.bankPositions);
      setCashPositions(data.cashPositions);
      setReceivableExport(data.receivableExport);
      setreceivableLocal(data.receivableLocal);
    } catch (error) {
      console.error("Failed to fetch cash and bank positions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFabricPostions();
    getCashAndBankPositions();
  }, [session?.user?.id]);

  const cards = [
    {
      title: "Calendar",
      description: "Manage your schedule",
      href: "/calendar",
      icon: <FaCalendarDays />,
    },
    {
      title: "Users",
      description: "Manage users ",
      href: "/users",
      icon: <FaUsers />,
    },
    {
      title: "Account",
      description: "View and edit your profile",
      href: "/myProfile",
      icon: <MdManageAccounts />,
    },
  ];

  return (
    <>
      <div className="px-6 md:py-10 py-20">
        {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="w-full rounded-[30px] border flex flex-col justify-center hover:shadow-lg min-h-[250px] bg-[rgb(255,255,255)] drop-shadow-2xl dark:bg-gray-800 dark:border-gray-700 dark:text-white items-start relative group">
            <div className="m-5">
              <div className="w-12 h-12 flex items-center justify-center absolute inset-x-0 top-0 ml-6 mt-6">
                <GiWool className="text-5xl" />
              </div>

              <div className="mt-4 text-left w-full ">
                <h2 className="text-2xl roboto-mono-500 text-gray-800 dark:text-white">
                  Fabric
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300 ">
                  <span
                    className="text-blue-500 underline cursor-pointer"
                    onClick={() => {
                      setListDisplay(true);
                      setListData(denimData);
                      console.log(listData);
                    }}
                  >
                    Denim Fabric:
                  </span>{" "}
                  {denimPosition === ""
                    ? "null"
                    : denimPosition.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  <span
                    className="text-blue-500 underline cursor-pointer"
                    onClick={() => {
                      setListDisplay(true);
                      setListData(pocketData);
                    }}
                  >
                    Pocket Lining:
                  </span>{" "}
                  {pocketPosition === ""
                    ? "null"
                    : pocketPosition.toLocaleString()}
                </p>
              </div>
              <a href="/fabricList">
                <div className="bg-gray-300 dark:bg-gray-700 w-10 h-10 rounded-full absolute bottom-0 left-0 m-4 mt-0 flex justify-center items-center hover:ring-4 ring-gray-200 dark:ring-gray-400 hover:transition duration-700 ease-in-out">
                  <GoArrowUpRight />
                </div>
              </a>
            </div>
          </div>
        </div> */}

        {/* Positions */}
        <div
          class="grid gap-2
         grid-cols-1 
         sm:grid-cols-2 
         md:grid-cols-3 
         lg:grid-cols-4"
        >
          <BankAndCashPosition
            isLoading={isLoading}
            bankPositions={bankPositions}
            cashPositions={cashPositions}
          />
        </div>

        {/* Receivable */}
        <div
          class="grid gap-2
         grid-cols-1 
         sm:grid-cols-2 
         md:grid-cols-3 
         lg:grid-cols-4 mt-8"
        >
          <Receivable
            isLoading={isLoading}
            receivableExport={receivableExport}
            receivableLocal={receivableLocal}
          />
        </div>

        {/* Chart Component */}
        {/* <div className="mt-2 flex justify-between mb-6 md:mt-8">
          <div className="group md:mb-0  w-full rounded-lg bg-[rgb(255,255,255)] dark:bg-gray-800 dark:border-gray-700  transition relative duration-300 drop-shadow-2xl h-[80%]">
            <h1 className="dark:text-white text-black text-2xl my-5 ml-4">
              Payable Summery
            </h1>
            <Link href="/payableSummary">
              <div className="absolute top-5 right-3 text-xl dark:bg-white dark:text-black bg-[#3f3d3d] text-white p-1 cursor cursor-pointer rounded-md">
                <GoArrowUpRight />
              </div>
            </Link>
            <div className="mx-auto">
              <PayableSummeryCharLoad />
            </div>
          </div>
        </div> */}
      </div>
      {listDisplay ? (
        <FabricReport
          data={listData}
          setListDisplay={setListDisplay}
          cc={session?.user?.companyId}
          bi="1"
          df={dayjs(dtFrom).format("DD-MM-YYYY")}
          dt={dayjs(dtTo).format("DD-MM-YYYY")}
          ghn={(listData[0].ItemGroupName = "Pocket Lining" ? "662" : "660")}
        />
      ) : null}
    </>
  );
};

export default Home;
