"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaCalendarDay, FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { format, isSameDay } from "date-fns";
import { useStateContext } from "@/components/contexts/ContextProvider";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// MUI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ManageEvents = ({ events, setLoading, onEventAdded }) => {
  const { data: session, status } = useSession();
  console.log(events);
  const { currentColor } = useStateContext();

  const [expanded, setExpanded] = useState({});
  const [eventValues, setEventValues] = useState(
    events.reduce((acc, event) => {
      acc[event.id] = {
        title: event.title || "",
        description: event.description || "",
        location: event.location || "",
        people: event.people ? event.people.join(", ") : "",
        start: dayjs(event.start),
        startTime: dayjs(event.start),
        end: dayjs(event.end),
        endTime: dayjs(event.end),
      };
      return acc;
    }, {})
  );

  const handleExpandClick = (eventId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [eventId]: !prevExpanded[eventId],
    }));
  };

  const handleDateChange = (eventId, field, value) => {
    setEventValues((prevValues) => ({
      ...prevValues,
      [eventId]: {
        ...prevValues[eventId],
        [field]: value,
      },
    }));
  };

  const handleInputChange = (eventId, field, value) => {
    setEventValues((prevValues) => ({
      ...prevValues,
      [eventId]: {
        ...prevValues[eventId],
        [field]: value,
      },
    }));
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/calendar/deleteEvents?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Handle successful deletion, e.g., remove the event from the UI
        toast.success("Event deleted successfully", {
          position: "top-right",
        });
        setLoading(true);
        onEventAdded();
      } else {
        toast.error("Failed to delete Event", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error deleting the event:", error);
    }
  };

  const handleSave = async (eventId) => {
    const event = eventValues[eventId];

    const updatedEvent = {
      id: eventId,
      title: event.title,
      description: event.description,
      location: event.location,
      people: event.people ? event.people.split(",").map((p) => p.trim()) : [],
      start: event.start.format(), // or use format("YYYY-MM-DDTHH:mm:ss")
      end: event.end.format(),
    };

    try {
      const response = await fetch(`/api/calendar/updateEvent`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        toast.success("Event updated successfully", {
          position: "top-right",
        });
        setLoading(true);
        onEventAdded();
      } else {
        toast.error("Failed to update Event", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating the event:", error);
      toast.error("An error occurred while updating the event", {
        position: "top-right",
      });
    }
  };

  const formatDateTime = (start, end) => {
    if (!start && !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    const formatDate = (date) => format(date, "MMM d, yyyy");
    const formatTime = (date) => format(date, "HH:mm");

    const startTime =
      startDate.getHours() > 0 || startDate.getMinutes() > 0
        ? formatTime(startDate)
        : "";
    const endTime =
      endDate.getHours() > 0 || endDate.getMinutes() > 0
        ? formatTime(endDate)
        : "";

    if (isSameDay(startDate, endDate)) {
      return startTime && endTime
        ? `${formatDate(startDate)} at ${startTime} - ${endTime}`
        : `${formatDate(startDate)}`;
    } else {
      return startTime && endTime
        ? `${formatDate(startDate)} at ${startTime} - ${formatDate(
            endDate
          )} at ${endTime}`
        : `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  };

  return (
    <div>
      {events.length === 0 && <div>No events found</div>}
      {events.map((event) => (
        <Card key={event.id} className="mt-4">
          <CardContent>
            <div>
              {event.title && <b>{event.title}</b>}
              {event.description && <p>{event.description}</p>}
              {event.start || event.end ? (
                <p>
                  <FaCalendarDay className="inline-block -mt-1 mr-2" />
                  {formatDateTime(event.start, event.end)}
                </p>
              ) : null}
              {event.people?.length > 0 && (
                <p>
                  <FaUser className="inline-block -mt-1 mr-2" />
                  {event.people.join(", ")}
                </p>
              )}
              {event.location && (
                <p>
                  <FaLocationDot className="inline-block -mt-1 mr-2" />
                  {event.location}
                </p>
              )}
            </div>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              aria-label="Delete Event"
              onClick={() => handleDelete(event.id)}
            >
              <MdDelete className="text-red-500" />
            </IconButton>
            <ExpandMore
              expand={expanded[event.id]}
              onClick={() => handleExpandClick(event.id)}
              aria-expanded={expanded[event.id]}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded[event.id]} timeout="auto" unmountOnExit>
            <CardContent className="bg-gray-50 p-6 rounded-lg shadow-lg">
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="flex flex-col">
                  <label className="text-gray-800 font-semibold mb-2">
                    Title
                  </label>
                  <input
                    name="title"
                    value={eventValues[event.id].title}
                    onChange={(e) =>
                      handleInputChange(event.id, "title", e.target.value)
                    }
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col">
                  <label className="text-gray-800 font-semibold mb-2">
                    Description
                  </label>
                  <input
                    name="description"
                    value={eventValues[event.id].description}
                    onChange={(e) =>
                      handleInputChange(event.id, "description", e.target.value)
                    }
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
                    rows="4"
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col">
                  <label className="text-gray-800 font-semibold mb-2">
                    Location
                  </label>
                  <input
                    name="location"
                    value={eventValues[event.id].location}
                    onChange={(e) =>
                      handleInputChange(event.id, "location", e.target.value)
                    }
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
                  />
                </div>

                {/* People */}
                <div className="flex flex-col">
                  <label className="text-gray-800 font-semibold mb-2">
                    People
                  </label>
                  <input
                    name="people"
                    value={eventValues[event.id].people}
                    onChange={(e) =>
                      handleInputChange(event.id, "people", e.target.value)
                    }
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
                  />
                </div>

                {/* Date and Time Pickers */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DemoItem label="Start Date" className="col-span-1">
                      <DatePicker
                        value={eventValues[event.id].start}
                        onChange={(date) =>
                          handleDateChange(event.id, "start", date)
                        }
                        disabled={false}
                        className="w-full"
                      />
                    </DemoItem>
                    <DemoItem label="Start Time" className="col-span-1">
                      <TimePicker
                        value={eventValues[event.id].startTime}
                        onChange={(time) =>
                          handleDateChange(event.id, "startTime", time)
                        }
                        disabled={false}
                        className="w-full"
                      />
                    </DemoItem>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DemoItem label="End Date" className="col-span-1">
                      <DatePicker
                        value={eventValues[event.id].end}
                        onChange={(date) =>
                          handleDateChange(event.id, "end", date)
                        }
                        disabled={false}
                        className="w-full"
                      />
                    </DemoItem>
                    <DemoItem label="End Time" className="col-span-1">
                      <TimePicker
                        value={eventValues[event.id].endTime}
                        onChange={(time) =>
                          handleDateChange(event.id, "endTime", time)
                        }
                        disabled={false}
                        className="w-full"
                      />
                    </DemoItem>
                  </div>
                </LocalizationProvider>

                {/* Save Button */}
                <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                  <button
                    onClick={() => handleSave(event.id)}
                    style={{ backgroundColor: currentColor }}
                    className="text-white py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                  >
                    Save
                  </button>
                </div>
              </div>
            </CardContent>
          </Collapse>
        </Card>
      ))}
      <ToastContainer />
    </div>
  );
};

export default ManageEvents;
