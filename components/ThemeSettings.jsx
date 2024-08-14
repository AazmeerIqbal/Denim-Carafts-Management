import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { BsCheck } from "react-icons/bs";

import { useStateContext } from "./contexts/ContextProvider";
import { themeColors } from "../data/dummy";

const ThemeSettings = () => {
  const { setColor, setMode, currentMode, currentColor, setThemeSettings } =
    useStateContext();

  return (
    <div className=" fixed nav-item top-0 right-0 ">
      <div className="float-right h-screen dark:text-gray-200  bg-gray-200  dark:bg-[#484B52] md:w-400 w-[250px] shadow-md">
        <div className="flex justify-between items-center p-4 ml-4">
          <p className="font-semibold text-lg">Settings</p>
          <button
            type="button"
            onClick={() => setThemeSettings(false)}
            style={{ color: "rgb(153, 171, 180)", borderRadius: "50%" }}
            className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
          >
            <MdOutlineCancel />
          </button>
        </div>
        <div className="flex-col border-t-1 border-color p-4 ml-4">
          <p className="font-semibold text-xl ">Theme Option</p>

          <div className="mt-4">
            <input
              type="radio"
              id="light"
              name="theme"
              value="Light"
              className="cursor-pointer"
              onChange={setMode}
              checked={currentMode === "Light"}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="light" className="ml-2 text-md cursor-pointer">
              Light
            </label>
          </div>
          <div className="mt-2">
            <input
              type="radio"
              id="dark"
              name="theme"
              value="Dark"
              onChange={setMode}
              className="cursor-pointer"
              checked={currentMode === "Dark"}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="dark" className="ml-2 text-md cursor-pointer">
              Dark
            </label>
          </div>
        </div>
        <div className="p-4 border-t-1 border-color ml-4">
          <p className="font-semibold text-xl ">Theme Colors</p>
          <div className="flex flex-wrap gap-3">
            {themeColors.map((item, index) => (
              <div className="relative mt-2 flex items-center" key={item.name}>
                <button
                  type="button"
                  className="h-10 w-10 rounded-full cursor-pointer"
                  style={{ backgroundColor: item.color }}
                  onClick={() => {
                    setColor(item.color);
                    setThemeSettings(false);
                  }}
                >
                  <BsCheck
                    className={`ml-2 text-2xl text-white ${
                      item.color === currentColor ? "block" : "hidden"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
