"use client";
import React, { useEffect, useState } from "react";
import { useStateContext } from "@/components/contexts/ContextProvider";
import { useSession } from "next-auth/react";
import { decrypt, encrypt } from "@/utils/encryption";

// Form Validation
import { useFormik } from "formik";
import * as Yup from "yup";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePasswordPopUp = ({ setChangePassword }) => {
  const { currentColor } = useStateContext();
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");

  useEffect(() => {
    const fetchCurrentPassword = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(
            `/api/password/get-current-password?id=${session?.user?.id}`
          );
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data = await response.json();
          setCurrentPassword(decrypt(data.password));
        } catch (error) {
          console.error("Failed to fetch current password:", error);
        }
      }
    };

    fetchCurrentPassword();
  }, [session]);

  const formik = useFormik({
    initialValues: {
      CurrentPass: "",
      NewPass: "",
      ConfirmPass: "",
    },
    validationSchema: Yup.object({
      CurrentPass: Yup.string()
        .oneOf([currentPassword], "Current password is incorrect")
        .required("Required!!"),
      NewPass: Yup.string()
        .min(6, "New Password must be at least 6 characters long")
        .required("Required!!"),
      ConfirmPass: Yup.string()
        .oneOf([Yup.ref("NewPass")], "Passwords must match")
        .required("Required!!"),
    }),
    onSubmit: (values) => {
      const updatePassword = async () => {
        try {
          const response = await fetch(
            `/api/password/update-password?id=${session?.user?.id}`,
            {
              method: "PUT", // Use PUT or PATCH instead of UPDATE
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                password: encrypt(values.NewPass),
              }),
            }
          );

          if (response.ok) {
            console.log(
              "Password updated successfully:",
              await response.json()
            );
            toast.success("Password Changed Successfully", {
              position: "top-right",
            });
          } else {
            const errorData = await response.json();
            console.error("Failed to update password:", errorData);
            toast.error("Failed to update password", {
              position: "top-right",
            });
          }
        } catch (error) {
          console.error("Error while updating the password:", error);
          toast.error("Error while updating the password", {
            position: "top-right",
          });
        }
      };

      updatePassword();
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div
        className="md:w-[40%] w-[90%] bg-white rounded-b-lg px-4 py-5 flex flex-col justify-around shadow-md"
        style={{
          borderTop: `10px solid ${currentColor}`,
        }}
      >
        <p className="text-lg font-bold font-sans">Change Password</p>
        <form onSubmit={formik.handleSubmit}>
          <div className="py-3">
            <input
              id="CurrentPass"
              name="CurrentPass"
              type="password"
              placeholder="Current Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.CurrentPass}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formik.touched.CurrentPass && formik.errors.CurrentPass ? (
              <div className="text-red-500 mt-1">
                {formik.errors.CurrentPass}
              </div>
            ) : null}
          </div>
          <hr className="w-full text-black border border-gray-400" />

          <div className="py-3">
            <input
              id="NewPass"
              name="NewPass"
              type="password"
              placeholder="New Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.NewPass}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            {formik.touched.NewPass && formik.errors.NewPass ? (
              <div className="text-red-500 mb-2">{formik.errors.NewPass}</div>
            ) : null}
            <input
              id="ConfirmPass"
              name="ConfirmPass"
              type="password"
              placeholder="Confirm Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.ConfirmPass}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formik.touched.ConfirmPass && formik.errors.ConfirmPass ? (
              <div className="text-red-500 mt-1">
                {formik.errors.ConfirmPass}
              </div>
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
                Save
              </button>
              <button
                type="button"
                style={{
                  borderRadius: "10px",
                }}
                className="text-sm text-white p-3 bg-red-500 hover:drop-shadow-xl relative"
                onClick={() => setChangePassword(false)}
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

export default ChangePasswordPopUp;
