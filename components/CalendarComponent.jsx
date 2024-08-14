// components/CalendarComponent.js
"use client";
import React from "react";
// import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import { createScrollControllerPlugin } from "@schedule-x/scroll-controller";
import "@schedule-x/theme-default/dist/index.css";

const CalendarComponent = ({ events }) => {
  console.log(events);
  const scrollController = createScrollControllerPlugin({
    initialScroll: "07:50",
  });
  const calendar = useNextCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    defaultView: createViewMonthGrid().name,
    events: events,
    calendars: {
      leisure: {
        colorName: "leisure",
        lightColors: {
          main: "#1c7df9",
          container: "#d2e7ff",
          onContainer: "#002859",
        },
        darkColors: {
          main: "#c0dfff",
          onContainer: "#dee6ff",
          container: "#426aa2",
        },
      },
    },
    plugins: [
      createEventModalPlugin(),
      createCurrentTimePlugin({ fullWeekWidth: true }),
      createScrollControllerPlugin(),
    ],
  });

  return <ScheduleXCalendar calendarApp={calendar} />;
  scrollController.scrollTo("04:00");
};

export default CalendarComponent;
