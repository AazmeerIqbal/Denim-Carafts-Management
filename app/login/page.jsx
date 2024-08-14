"use client";

import React from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { encrypt } from "@/utils/encryption";
import { useFormik } from "formik";
import * as Yup from "yup";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  UserName: Yup.string().required("Username is required"),
  Password: Yup.string().required("Password is required"),
});

const Login = () => {
  const router = useRouter();

  // Initialize Formik with form validation schema
  const formik = useFormik({
    initialValues: {
      UserName: "",
      Password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const pass = encrypt(values.Password);

      const result = await signIn("credentials", {
        redirect: false,
        username: values.UserName,
        password: pass,
      });

      if (result?.ok) {
        router.push("/");
      } else {
        toast.error("Invalid username or password", {
          position: "top-right",
        });
      }

      setSubmitting(false);
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img src="/assets/DC.jpg" className="w-32 mx-auto" alt="DC Logo" />
          </div>
          <div className="mt-8 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign In</h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <form onSubmit={formik.handleSubmit}>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    name="UserName"
                    value={formik.values.UserName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Username"
                    autoComplete="off"
                  />
                  {formik.touched.UserName && formik.errors.UserName ? (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.UserName}
                    </div>
                  ) : null}

                  <div className="relative mt-5">
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type={formik.values.showPassword ? "text" : "password"}
                      name="Password"
                      value={formik.values.Password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Password"
                    />
                    {formik.touched.Password && formik.errors.Password ? (
                      <div className="text-red-500 text-xs mt-1">
                        {formik.errors.Password}
                      </div>
                    ) : null}
                  </div>

                  <button
                    className="mt-5 tracking-wide font-semibold bg-[#9fd6f5] text-gray-100 w-full py-4 rounded-lg hover:bg-blue-400 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    type="submit"
                    disabled={formik.isSubmitting}
                  >
                    <span className="ml-3">Sign In</span>
                    <FaSignInAlt className="ml-2 mt-1" />
                  </button>
                </form>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Powered by Cli-X
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-[#cfe8f6] text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat "
            style={{
              backgroundImage: 'url("/assets/bg.jpg")',
            }}
          ></div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
