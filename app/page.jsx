import * as React from "react";
import { FaCalendarDays } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { GiWool } from "react-icons/gi";
import { MdManageAccounts } from "react-icons/md";
import Link from "next/link";
import PayableSummeryCharLoad from "@/components/Charts/payableSummery/PayableSummeryCharLoad";
import PayableSummeryImportChartLoad from "@/components/Charts/payableSummeryImport/PayableSummeryImportChartLoad";

const Page = () => {
  return (
    <>
      <div className="px-6 md:py-10 py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Dashboard Cards */}
          <div className="group w-full rounded-lg bg-[rgb(255,255,255)] dark:bg-[#141721] transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_rgb(244,67,54)] drop-shadow-2xl">
            <Link href="/calendar">
              <div className="p-5">
                <p className="dark:text-white text-black text-2xl w-3/4">
                  Calendar
                </p>
                <FaCalendarDays className="group-hover:opacity-100 absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300 text-4xl dark:text-white text-black" />
              </div>
            </Link>
          </div>

          <div className="group w-full rounded-lg bg-[rgb(255,255,255)] dark:bg-[#141721]  transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_rgb(244,67,54)] drop-shadow-2xl">
            <Link href="/fabricList">
              <div className="p-5">
                <p className="dark:text-white text-black text-2xl w-3/4">
                  Fabric
                </p>
                <GiWool className="group-hover:opacity-100 absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300 text-4xl dark:text-white text-black" />
              </div>
            </Link>
          </div>

          <div className="group w-full rounded-lg bg-[rgb(255,255,255)] dark:bg-[#141721]  transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_rgb(244,67,54)] drop-shadow-2xl">
            <Link href="/users">
              <div className="p-5">
                <p className="dark:text-white text-black text-2xl w-3/4">
                  Users
                </p>

                <FaUsers className="group-hover:opacity-100 absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300 text-4xl dark:text-white text-black" />
              </div>
            </Link>
          </div>

          <div className="group w-full rounded-lg bg-[rgb(255,255,255)] dark:bg-[#141721]  transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_rgb(244,67,54)] drop-shadow-2xl">
            <Link href="/myProfile">
              <div className="p-5">
                <p className="dark:text-white text-black text-2xl w-3/4">
                  Account
                </p>

                <MdManageAccounts className="group-hover:opacity-100 absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300 text-4xl dark:text-white text-black" />
              </div>
            </Link>
          </div>
        </div>

        {/* Chart Component */}
        <div className="mt-10 flex justify-between md:flex-row flex-col">
          <div className="group md:mb-0 mb-6 md:w-[48%] w-full rounded-lg bg-[rgb(255,255,255)] dark:bg-[#141721]  transition relative duration-300 drop-shadow-2xl">
            <h1 className="dark:text-white text-black text-2xl my-5 text-center">
              Local Payable Summery
            </h1>
            <div className="mx-auto">
              <PayableSummeryCharLoad />
            </div>
          </div>
          <div className="group md:mb-0 mb-6 md:w-[48%] w-full rounded-lg bg-[rgb(255,255,255)] dark:bg-[#141721]  transition relative duration-300 drop-shadow-2xl">
            <h1 className="dark:text-white text-black text-2xl my-5 text-center">
              Import Payable Summery
            </h1>
            <div className="mx-auto">
              <PayableSummeryImportChartLoad />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
