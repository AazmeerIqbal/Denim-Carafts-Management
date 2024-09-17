"use client";
import React from "react";
import "@/styles/globals.css";
import { Open_Sans } from "next/font/google";
import Provider from "@/components/Provider";
import { ContextProvider } from "@/components/contexts/ContextProvider";
import Dashboard from "@/components/Dashboard";
import { usePathname } from "next/navigation";
import Login from "./login/page";

const openSans = Open_Sans({
  weight: "400",
  subsets: ["latin"],
});

const Layout = ({ children }) => {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <title>Denim Crafts</title>
        <link rel="icon" type="image/x-icon" href="/assets/DC_logo_noBg.png" />
      </head>
      <body className={openSans.className}>
        <Provider>
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
