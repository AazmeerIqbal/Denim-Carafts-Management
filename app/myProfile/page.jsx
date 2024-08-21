"use client";
import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers-pro";
import { useStateContext } from "@/components/contexts/ContextProvider";
import ChangePasswordPopUp from "@/components/ChangePasswordPopUp";
import dayjs from "dayjs";

// Active Dropdown
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyProfile = () => {
  const { currentColor } = useStateContext();
  const { data: session, status, update } = useSession();
  const [editMode, setEditMode] = useState(false);
  const [originalValues, setOriginalValues] = useState({});
  // In the state initialization:
  const [values, setValues] = useState({
    name: session?.user?.name || "",
    fullName: session?.user?.fullName || "",
    email: session?.user?.email || "",
    phone: session?.user?.phone || "",
    dateOfBirth:
      session?.user?.dateOfBirth && session?.user?.dateOfBirth.length > 0
        ? dayjs(session?.user?.dateOfBirth[0])
        : null,
    isActive: session?.user?.isActive ? "Active" : "Inactive",
    roleId: session?.user?.roleId || "",
  });
  const [roles, setRoles] = useState([]);
  const [changePassword, setChangePassword] = useState(false);

  console.log(session.user);

  useEffect(() => {
    setOriginalValues(values);

    const fetchRoles = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/user-roles");
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const roles = await response.json();
          setRoles(roles);
        } catch (error) {
          console.error("Failed to fetch roles:", error);
        }
      }
    };

    fetchRoles();
  }, [session?.user?.id]);

  console.log(session.user);
  useEffect(() => {
    if (status === "authenticated") {
      setValues({
        name: session?.user?.name || "",
        fullName: session?.user?.fullName || "",
        email: session?.user?.email || "",
        phone: session?.user?.phone || "",
        dateOfBirth:
          session?.user?.dateOfBirth && session?.user?.dateOfBirth.length > 0
            ? dayjs(session?.user?.dateOfBirth[0])
            : null,
        isActive: session?.user?.isActive ? "Active" : "Inactive",
        roleId: session?.user?.roleId || "",
      });
    }
  }, [session, status]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = async () => {
    if (session?.user?.id) {
      try {
        const formattedValues = {
          ...values,
          dateOfBirth: formatDate(values.dateOfBirth),
          isActive: values.isActive === "Active",
        };

        const response = await fetch(
          `/api/update-profile?id=${session.user.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedValues),
          }
        );

        if (response.ok) {
          toast.success("Profile Updated Successfully", {
            position: "top-right",
          });

          await update({
            ...session,
            user: {
              ...session?.user,
              name: formattedValues.name,
              fullName: formattedValues.fullName,
              email: formattedValues.email,
              phone: formattedValues.phone,
              isActive: formattedValues.isActive,
              roleId: formattedValues.roleId,
              dateOfBirth: formattedValues.dateOfBirth,
            },
          });

          setEditMode(false);
          setOriginalValues(values);
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setValues(originalValues);
  };

  const handleChangePassword = () => {
    setChangePassword(true);
  };

  const formatDate = (date) => {
    if (!date) return null;
    return dayjs(date).format("YYYY-MM-DD");
  };

  return (
    <>
      <ToastContainer />

      <div className="m-2 md:m-8 mt-24 p-2 md:p-10 bg-white rounded-3xl drop-shadow-xl">
        <div className="flex items-center gap-4">
          <img
            className="rounded-full h-24 w-24"
            src={
              session?.user?.name == "DC"
                ? "/assets/86.png"
                : "/assets/avatar.jpg"
            }
            alt="user-profile"
          />
          <p className="text-3xl font-extrabold tracking-tight text-slate-900">
            {session?.user?.name}
          </p>
        </div>

        <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-gray-100 rounded-lg shadow-md">
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Username:</label>
            <input
              name="name"
              placeholder=""
              value={values.name}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500"
              disabled={!editMode}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Name:</label>
            <input
              name="fullName"
              placeholder=""
              value={values.fullName}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500"
              disabled={!editMode}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Email:</label>
            <input
              name="email"
              placeholder=""
              value={values.email}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500"
              disabled={!editMode}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Cell No#</label>
            <input
              name="phone"
              placeholder=""
              value={values.phone}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500"
              disabled={!editMode}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">
              Date of Birth:
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className="mt-1"
                value={values.dateOfBirth}
                onChange={(date) =>
                  setValues({ ...values, dateOfBirth: dayjs(date) })
                }
                format="DD/MM/YYYY" // Ensure correct date format
                disabled={!editMode}
              />
            </LocalizationProvider>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">
              Active Status:
            </label>
            <Box className="mt-1">
              <FormControl fullWidth>
                <Select
                  name="isActive"
                  value={values.isActive}
                  onChange={handleChange}
                  disabled={!editMode}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">User Role:</label>
            <Box className="mt-1">
              <FormControl fullWidth>
                <Select
                  name="roleId"
                  value={values.roleId}
                  onChange={handleChange}
                  disabled={!editMode}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.RoleId} value={role.RoleId}>
                      {role.RoleName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>

        <div className="flex gap-2 mt-8">
          {!editMode ? (
            <>
              <button
                type="button"
                style={{
                  backgroundColor: currentColor,
                  borderRadius: "10px",
                }}
                className="text-sm text-white p-3 hover:drop-shadow-xl w-[45%] ml-[5%]"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                style={{
                  backgroundColor: currentColor,
                  borderRadius: "10px",
                }}
                className="text-sm text-white p-3 hover:drop-shadow-xl w-[45%]"
              >
                Change Password
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                style={{
                  backgroundColor: currentColor,
                  borderRadius: "10px",
                }}
                className="text-sm text-white p-3 hover:drop-shadow-xl w-[45%] ml-[5%]"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                type="button"
                style={{
                  borderRadius: "10px",
                }}
                className="text-sm text-white p-3 bg-red-500 hover:drop-shadow-xl w-[45%]"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      {changePassword && (
        <ChangePasswordPopUp setChangePassword={setChangePassword} />
      )}
    </>
  );
};

export default MyProfile;
