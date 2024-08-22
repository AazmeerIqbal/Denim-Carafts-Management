"use client";
import React, { useEffect, useState } from "react";
import CalendarComponent from "@/components/CalendarComponent";
import ManageEvents from "@/components/ManageEvents";
import { useSession } from "next-auth/react";
import { useStateContext } from "@/components/contexts/ContextProvider";
import AddEventPopUp from "@/components/AddEventPopUp";
import { useRouter, useParams } from "next/navigation";

// MUI Tabs
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const Page = () => {
  const { currentColor } = useStateContext();
  const { data: session, status } = useSession();

  const { id } = useParams();

  const [addEventPop, setAddEventPop] = useState(false);
  const [Events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    if (session?.user?.id) {
      try {
        // Construct URL using session.user.id
        const url = `/api/calendar/${session?.user?.id}/getEvents`; // Ensure this matches your API route
        const response = await fetch(url);
        console.log(url);

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
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
    console.log(session?.user);
  }, [session?.user?.id]);

  const handleEventAdded = () => {
    fetchEvents();
  };

  const showPopup = () => {
    setAddEventPop(true);
  };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="m-2 md:m-8 mt-24 p-2 md:p-10 bg-white rounded-3xl drop-shadow-xl">
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Calendar" value="1" />
                <Tab label="Manage Events" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div className="gap-4">
                <div>
                  <button
                    type="button"
                    style={{
                      backgroundColor: currentColor,
                      borderRadius: "10px",
                    }}
                    className="text-sm text-white p-3 hover:drop-shadow-xl "
                    onClick={showPopup}
                  >
                    Add Event
                  </button>
                </div>
              </div>
              <div className="mt-8">
                {loading ? (
                  <p>Loading events...</p>
                ) : (
                  <CalendarComponent events={Events} />
                )}
              </div>
            </TabPanel>
            <TabPanel value="2">
              {loading ? (
                <p>Loading events...</p>
              ) : (
                <ManageEvents
                  events={Events}
                  setLoading={setLoading}
                  onEventAdded={handleEventAdded}
                />
              )}
            </TabPanel>
          </TabContext>
        </Box>
      </div>
      {addEventPop && (
        <AddEventPopUp
          setAddEventPop={setAddEventPop}
          onEventAdded={handleEventAdded}
          setLoading={setLoading}
        />
      )}
    </>
  );
};

export default Page;
