import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import Button from "./Button";
import { useStateContext } from "./contexts/ContextProvider";
import Link from "next/link";

const Notification = ({ Events }) => {
  const { setIsClicked, initialState } = useStateContext();

  return (
    <div className="nav-item absolute right-5 md:right-40 top-16 bg-gray-200 dark:bg-[#42464D] p-8 rounded-lg md:w-96 w-72">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">
            Notifications
          </p>
          {Events.length > 0 && (
            <button
              type="button"
              className="text-black dark:text-white text-xs rounded p-1 px-2 bg-orange-theme"
            >
              {Events.length} New
            </button>
          )}
        </div>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="mt-5">
        {Events.length > 0 ? (
          Events.map((item, index) => (
            <Link href="/calendar">
              <div
                key={index}
                className="flex items-center leading-8 gap-5 border-b-1 border-color p-3 cursor-pointer"
                onClick={() => setIsClicked(initialState)}
              >
                <div>
                  <p className="font-semibold dark:text-gray-200">
                    {item.title} is marked today
                  </p>
                  <p className="text-gray-500 text-sm dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-sm dark:text-gray-400">
            No events for today.
          </p>
        )}
      </div>
    </div>
  );
};

export default Notification;
