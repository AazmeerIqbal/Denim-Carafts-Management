import * as React from "react";
import { FaCalendarDays } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { GiWool } from "react-icons/gi";
import { MdManageAccounts } from "react-icons/md";
import Link from "next/link";

const Page = () => {
  return (
    //for change
    <div className="md:mt-10 mt-20 px-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Link href="/calendar">
        <div class="group w-full rounded-lg bg-[rgb(255,255,255)] dark:bg-[rgb(41,49,79)] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_rgb(244,67,54)] drop-shadow-2xl">
          <p class="dark:text-white text-black text-2xl w-3/4">
            Schedule your Important Tasks
          </p>
          <FaCalendarDays class="group-hover:opacity-100 absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300 text-4xl dark:text-white text-black" />
        </div>
      </Link>

      <Link href="/">
        <div class="group w-full rounded-lg bg-[rgb(255,255,255)] dark:bg-[rgb(41,49,79)] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_rgb(244,67,54)] drop-shadow-2xl">
          <p class="dark:text-white text-black text-2xl w-3/4">Fabric List</p>

          <GiWool class="group-hover:opacity-100 absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300 text-4xl dark:text-white text-black" />
        </div>
      </Link>

      <Link href="/users">
        <div class="group w-full rounded-lg bg-[rgb(255,255,255)] dark:bg-[rgb(41,49,79)] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_rgb(244,67,54)] drop-shadow-2xl">
          <p class="dark:text-white text-black text-2xl w-3/4">Users</p>

          <FaUsers class="group-hover:opacity-100 absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300 text-4xl dark:text-white text-black" />
        </div>
      </Link>

      <Link href="/myProfile">
        <div class="group w-full rounded-lg bg-[rgb(255,255,255)] dark:bg-[rgb(41,49,79)] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_rgb(244,67,54)] drop-shadow-2xl">
          <p class="dark:text-white text-black text-2xl w-3/4">My Account</p>

          <MdManageAccounts class="group-hover:opacity-100 absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300 text-4xl dark:text-white text-black" />
        </div>
      </Link>
    </div>
  );
};

export default Page;
