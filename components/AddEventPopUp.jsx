"use client";
import React from "react";
import { useStateContext } from "@/components/contexts/ContextProvider";
import { useSession } from "next-auth/react";

// Form Validation
import { useFormik } from "formik";
import * as Yup from "yup";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddEventPopUp = ({ setAddEventPop, onEventAdded, setLoading }) => {
  const { currentColor } = useStateContext();
  const { data: session } = useSession();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      location: "",
      start: "",
      end: "",
      people: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      start: Yup.date().required("Start date is required"),
      end: Yup.date().required("End date is required"),
      description: Yup.string(),
      location: Yup.string(),
      people: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`/api/calendar/addEvent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CompanyId: session.user.companyId,
            UserId: session.user.id,
            start: values.start,
            end: values.end,
            title: values.title,
            description: values.description,
            location: values.location,
            people: values.people.split(","),
          }),
        });

        if (response.ok) {
          toast.success("Event added successfully", {
            position: "top-right",
          });
          setAddEventPop(false);
          setLoading(true);
          onEventAdded(); // Call the callback to update events
        } else {
          const errorData = await response.json();
          console.error("Failed to add event:", errorData);
          toast.error("Failed to add event", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error while adding the event:", error);
        toast.error("Error while adding the event", {
          position: "top-right",
        });
      }
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div
        className="md:w-[55%] w-[90%] bg-white rounded-b-lg px-4 py-5 flex flex-col justify-around shadow-md  max-h-[70vh] overflow-y-auto"
        style={{
          borderTop: `10px solid ${currentColor}`,
        }}
      >
        <p className="text-lg font-bold font-sans">Add Event</p>
        <form onSubmit={formik.handleSubmit}>
          <div className="py-3">
            <label>Title:</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Event Title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500 mt-1">{formik.errors.title}</div>
            ) : null}
          </div>

          <div className="py-3">
            <label>Start Date & Time:</label>
            <input
              id="start"
              name="start"
              type="datetime-local"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.start}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formik.touched.start && formik.errors.start ? (
              <div className="text-red-500 mt-1">{formik.errors.start}</div>
            ) : null}
          </div>

          <div className="py-3">
            <label>End Date & Time:</label>
            <input
              id="end"
              name="end"
              type="datetime-local"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.end}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formik.touched.end && formik.errors.end ? (
              <div className="text-red-500 mt-1">{formik.errors.end}</div>
            ) : null}
          </div>

          <div className="py-3">
            <label>Description:</label>
            <input
              id="description"
              name="description"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 mt-1">
                {formik.errors.description}
              </div>
            ) : null}
          </div>

          <div className="py-3">
            <label>Location:</label>
            <input
              id="location"
              name="location"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.location}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formik.touched.location && formik.errors.location ? (
              <div className="text-red-500 mt-1">{formik.errors.location}</div>
            ) : null}
          </div>

          <div className="py-3">
            <label>People:</label>
            <input
              id="people"
              name="people"
              type="text"
              placeholder="(comma-separated)"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.people}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formik.touched.people && formik.errors.people ? (
              <div className="text-red-500 mt-1">{formik.errors.people}</div>
            ) : null}
          </div>

          <div className="flex justify-between">
            <div className="text-sm flex gap-2">
              <button
                type="submit"
                style={{
                  backgroundColor: currentColor,
                  borderRadius: "10px",
                }}
                className="text-sm text-white p-3 hover:drop-shadow-xl relative"
              >
                Add
              </button>
              <button
                type="button"
                style={{
                  borderRadius: "10px",
                }}
                className="text-sm text-white p-3 bg-red-500 hover:drop-shadow-xl relative"
                onClick={() => setAddEventPop(false)}
              >
                Close
              </button>
            </div>
          </div>

          <ToastContainer />
        </form>
      </div>
    </div>
  );
};

export default AddEventPopUp;
