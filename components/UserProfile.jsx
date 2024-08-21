"use client";
import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

import Button from "@/components/Button";
import { useStateContext } from "./contexts/ContextProvider";
import { BsCurrencyDollar } from "react-icons/bs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MdLogout } from "react-icons/md";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const { setIsClicked, initialState, currentColor } = useStateContext();
  const router = useRouter();

  const { data: session, status } = useSession();

  const handleLogout = async () => {
    setIsClicked(initialState);
    await signOut();
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-gray-200 dark:bg-[#42464D] md:p-8 p-4 rounded-lg md:w-96 w-72">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full md:h-24 h-16 md:w-24 w-16"
          src={
            session?.user?.name == "DC"
              ? "/assets/86.png"
              : "/assets/avatar.jpg"
          }
          alt="user-profile"
        />
        <div>
          <p className="font-semibold md:text-xl text-base dark:text-gray-200">
            {" "}
            {session.user.fullName}{" "}
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {" "}
            Administrator{" "}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {" "}
            {session.user.email}{" "}
          </p>
        </div>
      </div>
      <hr className="w-full text-black border border-gray-400"></hr>
      <div>
        <Link
          href="/myProfile"
          onClick={() => {
            setIsClicked(initialState);
          }}
        >
          <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
            <button
              type="button"
              style={{ color: "#03C9D7", backgroundColor: "#E5FAFB" }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              <BsCurrencyDollar />
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">My Profile</p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Account Settings{" "}
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div className="mt-5">
        <button
          type="button"
          onClick={handleLogout}
          style={{
            backgroundColor: currentColor,
            color: "white",
            borderRadius: "10px",
          }}
          className={` text-xl p-3 w-full hover:drop-shadow-xl relative`}
        >
          Logout <MdLogout className="absolute top-4 md:right-24 right-16" />
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
