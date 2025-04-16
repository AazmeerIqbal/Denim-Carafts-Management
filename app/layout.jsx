"use client";
import React from "react";
import "@/styles/globals.css";
import { Open_Sans } from "next/font/google";
import { ContextProvider } from "@/components/contexts/ContextProvider";
import Dashboard from "@/components/Dashboard";
import { usePathname } from "next/navigation";
import Login from "./login/page";
import Provider from "@/components/Provider";
import DynamicHead from "@/components/DynamicHead";

const openSans = Open_Sans({
  weight: "400",
  subsets: ["latin"],
});

const Layout = ({ children }) => {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={openSans.className}>
        <Provider>
          <DynamicHead /> {/* ✅ Now it can safely use useSession */}
          <ContextProvider>
            <div className="main">
              <main className="app">
                {pathname === "/login" ? (
                  <Login />
                ) : (
                  <Dashboard>{children}</Dashboard>
                )}
              </main>
            </div>
          </ContextProvider>
        </Provider>
      </body>
    </html>
  );
};

export default Layout;
