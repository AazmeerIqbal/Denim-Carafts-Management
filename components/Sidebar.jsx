"use client";
import React, { useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { GiWool } from "react-icons/gi";
import Link from "next/link";
import { useStateContext } from "@/components/contexts/ContextProvider";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdOutlineInventory2,
  MdOutlineSummarize,
} from "react-icons/md";
import { FaUser, FaUsers, FaCalendarAlt } from "react-icons/fa";

const Sidebar = () => {
  const { data: session, status } = useSession();
  const { currentColor, activeMenu, setActiveMenu, screenSize } =
    useStateContext();

  const pathname = usePathname();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2 mr-4";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2 mr-4";

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 ">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              href="/"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-4 flex text-2xl font-extrabold tracking-wider dark:text-white text-slate-900"
            >
              <img
                src="/assets/DC_logo_noBg.png"
                alt="Logo"
                className="h-10 w-10"
              />
              <span>{session?.user?.companyName}</span>
            </Link>
            {/* <TooltipComponent content="Menu" position="BottomCenter"> */}
            <button
              type="button"
              onClick={() => setActiveMenu(!activeMenu)}
              style={{ color: currentColor }}
              className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
            >
              <MdOutlineCancel />
            </button>
            {/* </TooltipComponent> */}
          </div>
          <div className="mt-10">
            <div>
              {/* Dashboard */}
              <Link
                href="/"
                onClick={handleCloseSideBar}
                style={{
                  backgroundColor: pathname === "/" ? currentColor : "",
                }}
                className={pathname === "/" ? activeLink : normalLink}
              >
                <MdDashboard />
                <span className="capitalize">Dashboard</span>
              </Link>

              {/* Users */}
              <Link
                href="/users"
                onClick={handleCloseSideBar}
                style={{
                  backgroundColor: pathname === "/users" ? currentColor : "",
                }}
                className={pathname === "/users" ? activeLink : normalLink}
              >
                <FaUsers />
                <span className="capitalize">Users</span>
              </Link>

              {/* Calendar */}
              <Link
                href="/calendar"
                onClick={handleCloseSideBar}
                style={{
                  backgroundColor: pathname === "/calendar" ? currentColor : "",
                }}
                className={pathname === "/calendar" ? activeLink : normalLink}
              >
                <FaCalendarAlt />
                <span className="capitalize">Calendar</span>
              </Link>

              {/*///////////////////// Reports /////////////////////*/}

              <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                Reports
              </p>

              {/* Fabric List */}
              <Link
                href="/fabricList"
                onClick={handleCloseSideBar}
                style={{
                  backgroundColor:
                    pathname === "/fabricList" ? currentColor : "",
                }}
                className={pathname === "/fabricList" ? activeLink : normalLink}
              >
                <GiWool />
                <span className="capitalize">Fabric List</span>
              </Link>

              {/* Inventory Item */}
              <Link
                href="/inventoryItem"
                onClick={handleCloseSideBar}
                style={{
                  backgroundColor:
                    pathname === "/inventoryItem" ? currentColor : "",
                }}
                className={
                  pathname === "/inventoryItem" ? activeLink : normalLink
                }
              >
                <MdOutlineInventory2 />
                <span className="capitalize">Inventory Item</span>
              </Link>

              {/* Customer OBS Summary */}
              <Link
                href="/customerOBSSummary"
                onClick={handleCloseSideBar}
                style={{
                  backgroundColor:
                    pathname === "/customerOBSSummary" ? currentColor : "",
                }}
                className={
                  pathname === "/customerOBSSummary" ? activeLink : normalLink
                }
              >
                <MdOutlineSummarize />
                <span className="capitalize">Order Booking Summery</span>
              </Link>

              {/* Payable Summary */}
              <Link
                href="/payableSummary"
                onClick={handleCloseSideBar}
                style={{
                  backgroundColor:
                    pathname === "/payableSummary" ? currentColor : "",
                }}
                className={
                  pathname === "/payableSummary" ? activeLink : normalLink
                }
              >
                <MdOutlineSummarize />
                <span className="capitalize">Payable Summery</span>
              </Link>

              {/* Job Cost */}
              <Link
                href="/jobCost"
                onClick={handleCloseSideBar}
                style={{
                  backgroundColor: pathname === "/jobCost" ? currentColor : "",
                }}
                className={pathname === "/jobCost" ? activeLink : normalLink}
              >
                <MdOutlineSummarize />
                <span className="capitalize">Job Cost</span>
              </Link>

              {/*///////////////////// Settings /////////////////////*/}

              <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                Settings
              </p>

              <Link
                href="/myProfile"
                onClick={handleCloseSideBar}
                style={{
                  backgroundColor:
                    pathname === "/myProfile" ? currentColor : "",
                }}
                className={pathname === "/myProfile" ? activeLink : normalLink}
              >
                <FaUser />
                <span className="capitalize">My Profile</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
