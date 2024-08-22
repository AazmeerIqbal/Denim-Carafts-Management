"use-client";

import React, { useEffect, useState, useMemo } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiNotification3Line } from "react-icons/ri";
import { useSession } from "next-auth/react";
import UserProfile from "@/components/UserProfile";
import { useStateContext } from "./contexts/ContextProvider";
import Tooltip from "@mui/material/Tooltip";
import Notification from "./Notification";
import { isWithinInterval, parseISO } from "date-fns";
import format from "date-fns/format";

const NavButton = React.forwardRef(
  ({ title, customFunc, icon, color, dotColor, count }, ref) => (
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      {count > 0 && (
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex items-center justify-center h-5 w-5 text-xs text-black rounded-full top-[1px] right-1"
        >
          {count}
        </span>
      )}
      {icon}
    </button>
  )
);

const Navbar = () => {
  const [Events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [NotificationCount, setNotificationCount] = useState(0);
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  useEffect(() => {
    const fetchEvents = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(
            `/api/calendar/${session?.user?.id}/getEvents`
          );
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const eventsData = await response.json();

          const formatDateTime = (dateTime) => {
            if (!dateTime) return null;
            const date = new Date(dateTime);
            const time = date.toISOString().slice(11, 16);
            return time === "00:00"
              ? date.toISOString().slice(0, 10)
              : date.toISOString().slice(0, 16).replace("T", " ");
          };

          const parsePeople = (people) => {
            if (!people || typeof people !== "string") return null;
            try {
              return JSON.parse(people);
            } catch {
              return people.split(",").map((person) => person.trim());
            }
          };

          const formattedEvents = eventsData.map((event, index) => ({
            id: event.id || index + 1,
            title: event.title || null,
            description: event.description || null,
            location: event.location || null,
            start: formatDateTime(event.start),
            end: formatDateTime(event.end),
            people: parsePeople(event.people) || null,
          }));

          setEvents(formattedEvents);
        } catch (error) {
          console.error("Failed to fetch events:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvents();
  }, [session?.user?.id]);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  // Memoize today's events calculation to avoid unnecessary re-renders
  const todayEvents = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    return Events.filter(
      (event) => event.start && event.start.startsWith(today)
    );
  }, [Events]);

  useEffect(() => {
    setNotificationCount(todayEvents.length);
  }, [todayEvents]);

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        <NavButton
          title="Notification"
          dotColor="rgb(254, 201, 15)"
          customFunc={() => handleClick("notification")}
          color={currentColor}
          icon={<RiNotification3Line />}
          count={NotificationCount}
        />
        <Tooltip title="Profile" placement="bottom">
          <div
            className="flex items-center gap-2 cursor-pointer p-2 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick("userProfile")}
          >
            <img
              className="rounded-full w-8 h-8"
              src={
                session?.user?.name == "Farhan"
                  ? "/assets/86.png"
                  : "/assets/avatar.jpg"
              }
              alt="user-profile"
            />
            <p>
              <span className="text-gray-400 text-base">Hi,</span>{" "}
              <span className="text-gray-400 font-bold ml-1 text-base">
                {session?.user?.name}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-base" />
          </div>
        </Tooltip>
        {isClicked.notification && <Notification Events={todayEvents} />}
        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
