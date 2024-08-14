"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useStateContext } from "@/components/contexts/ContextProvider";
import { FiSettings } from "react-icons/fi";
import { Navbar, Sidebar, ThemeSettings } from "@/components";
import Loader from "@/components/Loader";
import Tooltip from "@mui/material/Tooltip";

const Dashboard = ({ children }) => {
  //hide Syncfusion License popup
  useEffect(() => {
    const licenseText =
      "This application was built using a trial version of Syncfusion Essential Studio. To remove the license validation message permanently, a valid license key must be included.";
    const hideLicenseMessage = () => {
      // Get all span elements in the document
      const spanElements = document.getElementsByTagName("span");

      for (let span of spanElements) {
        // Check if the span contains the specific license text
        if (span.innerText.includes(licenseText)) {
          // Hide the parent div of the span
          span.parentElement.style.display = "none";
          break; // Stop the loop once the element is found and hidden
        }
      }

      const licenseDivText =
        "Claim your FREE account and get a key in less than a minute";

      const divElements = document.getElementsByTagName("div");

      for (let div of divElements) {
        // Check if the div contains the specific license text
        if (div.innerText.includes(licenseDivText)) {
          // Hide the parent div of the div
          div.parentElement.style.display = "none";
          break; // Stop the loop once the element is found and hidden
        }
      }
    };

    // Initial check
    hideLicenseMessage();

    // Create a MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(() => {
      hideLicenseMessage();
    });

    // Observe changes in the body of the document
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  if (status === "loading") {
    return <Loader />;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
          <Tooltip title="Settings" placement="top">
            <button
              type="button"
              onClick={() => setThemeSettings(true)}
              style={{
                background: currentColor,
                borderRadius: "50%",
              }}
              className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
            >
              <FiSettings />
            </button>
          </Tooltip>
        </div>
        {activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        )}
        <div
          className={
            activeMenu
              ? "dark:bg-main-dark-bg bg-[#fafbfb] min-h-screen md:ml-72 w-full"
              : "bg-[#fafbfb] dark:bg-main-dark-bg w-full min-h-screen flex-2"
          }
        >
          <div className="fixed md:static bg-[#fafbfb] dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>
          <div className="">
            {themeSettings && <ThemeSettings />}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
