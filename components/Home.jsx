"use client";

import React from "react";
import { FaCalendarDays } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { GiWool } from "react-icons/gi";
import { MdManageAccounts } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import { GoArrowUpRight } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { FaChartLine, FaMoneyBillWave, FaExchangeAlt } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useStateContext } from "@/components/contexts/ContextProvider";
import chroma from "chroma-js";
import FabricReport from "@/components/Reports/FabricList";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion

import PayableSummeryCharLoad from "@/components/Charts/payableSummery/PayableSummeryCharLoad";
import PayableSummeryImportChartLoad from "@/components/Charts/payableSummeryImport/PayableSummeryImportChartLoad";
import BankAndCashPosition from "@/components/Dashboard/BandAndCashPosition";
import Receivable from "@/components/Dashboard/Receivable";
import PayableAndLoan from "@/components/Dashboard/PayableAndLoan";
import OrderDetails from "@/components/Reports/ShipmentDetails";
import { BorderColor } from "@mui/icons-material";

// Enhanced Popup Component with Framer Motion
const DashboardPopup = ({ isOpen, onClose, title, children }) => {
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto shadow-xl"
            variants={contentVariants}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <motion.h2
                className="text-xl font-semibold dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {title}
              </motion.h2>
              <motion.button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <IoMdClose size={24} />
              </motion.button>
            </div>
            <motion.div
              className="p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="space-y-4">{children}</div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced Dashboard Button Component with Framer Motion
const DashboardButton = ({ title, description, icon, onClick, color }) => {
  const lightColor = chroma(color).brighten(1.5).hex();
  const darkColor = chroma(color).darken(0.5).hex();

  return (
    <motion.button
      onClick={onClick}
      className="p-6 rounded-xl shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center w-full h-full"
      style={{
        background: `linear-gradient(135deg, ${lightColor}, ${darkColor})`,
        color:
          chroma.contrast(darkColor, "#ffffff") > 4.5 ? "#ffffff" : "#000000",
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="text-4xl mb-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <motion.h3
        className="text-xl font-bold mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {title}
      </motion.h3>
      <motion.p
        className="text-sm opacity-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {description}
      </motion.p>
    </motion.button>
  );
};

const Home = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [denimPosition, setDenimPosition] = useState("");
  const [denimData, setDenimData] = useState("");
  const [pocketPosition, setPocketPosition] = useState("");
  const [pocketData, setPocketData] = useState("");
  const [bankPositions, setBankPositions] = useState([]);
  const [cashPositions, setCashPositions] = useState([]);
  const [receivableExport, setReceivableExport] = useState([]);
  const [receivableLocal, setreceivableLocal] = useState([]);
  const [tradersPayable, settradersPayable] = useState([]);
  const [loansPayable, setloansPayable] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const { currentColor } = useStateContext();
  const [listDisplay, setListDisplay] = useState(false);
  const [listData, setListData] = useState(false);

  // Popup states
  const [activePopup, setActivePopup] = useState(null);
  const [popupTitle, setPopupTitle] = useState("");

  const lightColor = chroma(currentColor).brighten(1).hex(); // Lighter shade
  const darkColor = chroma(currentColor).darken(1.5).hex(); // Darker shade

  // Get date
  const dtFrom = "2020-01-01";
  const today = new Date();
  const dtTo = today.toISOString().split("T")[0];

  // Add new state for scheduling
  const [scheduledTime, setScheduledTime] = useState(null);
  const [emailScheduled, setEmailScheduled] = useState(false);
  const [scheduledJobId, setScheduledJobId] = useState(null);
  const [isScheduleActive, setIsScheduleActive] = useState(false);
  const [nextScheduledTime, setNextScheduledTime] = useState(null);

  const getFabricPostions = async () => {
    try {
      const response = await fetch(
        `/api/[fabricList]/getFabricList?companyId=1&location=1&showHide=1&groupHead=660&qtyMin=0&qtyMax=null&dtFrom=2020-01-01&dtTo=${dtTo}&reportFormat=Preview`,
        {
          method: "GET",
        }
      );
      // console.log(response);

      if (!response.ok) {
        toast.error(`Error: ${response.statusText}`, {
          position: "top-right",
        });
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setDenimData(data);
      // Calculate the total stock outside of JSX
      const totalStock = data.reduce(
        (acc, item) => (item.BalanceQty1 > 0 ? acc + item.BalanceQty1 : acc),
        0
      );
      setDenimPosition(Number(totalStock.toFixed(3)));
    } catch (error) {
      console.error("Failed to fetch fabric list:", error);
    }
    try {
      const response1 = await fetch(
        `/api/[fabricList]/getFabricList?companyId=1&location=1&showHide=1&groupHead=662&qtyMin=0&qtyMax=null&dtFrom=2020-01-01&dtTo=${dtTo}&reportFormat=Preview`,
        {
          method: "GET",
        }
      );
      // console.log(response1);

      if (!response1.ok) {
        toast.error(`Error: ${response1.statusText}`, {
          position: "top-right",
        });
        throw new Error(`Error: ${response1.statusText}`);
      }

      const data1 = await response1.json();
      setPocketData(data1);
      // Calculate the total stock outside of JSX
      const totalStock1 = data1.reduce(
        (acc, item) => (item.BalanceQty1 > 0 ? acc + item.BalanceQty1 : acc),
        0
      );
      setPocketPosition(Number(totalStock1.toFixed(3)));
    } catch (error) {
      console.error("Failed to fetch fabric list:", error);
    }
  };

  const getCashAndBankPositions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/getCashAndBankPosition/${session?.user?.companyId || 1}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        console.error(`Error: ${response.statusText}`);
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Set all states first
      await Promise.all([
        setBankPositions(data.bankPositions),
        setCashPositions(data.cashPositions),
        setReceivableExport(data.receivableExport),
        setreceivableLocal(data.receivableLocal),
        settradersPayable(data.tradersPayable),
        setloansPayable(data.loansPayable),
      ]);

      // After all states are set, initialize schedule
      await initializeSchedule();

      // Check schedule status every minute
      const intervalId = setInterval(checkScheduleStatus, 60000);

      // Cleanup interval on unmount
      return () => clearInterval(intervalId);
    } catch (error) {
      console.error("Failed to fetch cash and bank positions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to initialize or check schedule
  const initializeSchedule = async () => {
    try {
      // Get client's timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Initialize the schedule with client's timezone
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timezone }),
      });

      if (response.ok) {
        const data = await response.json();
        setNextScheduledTime(data.nextScheduledTime);
      }
    } catch (error) {
      console.error("Error initializing schedule:", error);
    }
  };

  // Function to check schedule status
  const checkScheduleStatus = async () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await fetch(
        `/api/schedule?timezone=${encodeURIComponent(timezone)}`
      );
      if (response.ok) {
        const data = await response.json();
        setNextScheduledTime(data.nextScheduledTime);
      }
    } catch (error) {
      console.error("Error checking schedule status:", error);
    }
  };

  // useEffect(() => {
  //   // getFabricPostions();
  //   getCashAndBankPositions();
  // }, [session?.user?.id]);

  // Function to open popup
  const openPopup = (popupType, title) => {
    setActivePopup(popupType);
    getCashAndBankPositions();
    setPopupTitle(title);
  };

  // Function to close popup
  const closePopup = () => {
    setActivePopup(null);
  };

  // Dashboard buttons configuration
  const dashboardButtons = [
    {
      title: "Bank & Cash",
      description: "View bank and cash positions",
      icon: <FaMoneyBillWave />,
      popupType: "bankCash",
      color: "#4CAF50",
    },
    {
      title: "Receivables",
      description: "Manage receivables",
      icon: <FaExchangeAlt />,
      popupType: "receivables",
      color: "#2196F3",
    },
    {
      title: "Payables & Loans",
      description: "View payables and loans",
      icon: <FaChartLine />,
      popupType: "payables",
      color: "#FF9800",
    },
    {
      title: "Calendar",
      description: "Manage your schedule",
      icon: <FaCalendarDays />,
      href: "/calendar",
      color: "#9C27B0",
    },
    {
      title: "Users",
      description: "Manage users",
      icon: <FaUsers />,
      href: "/users",
      color: "#E91E63",
    },
    {
      title: "Account",
      description: "View and edit your profile",
      icon: <MdManageAccounts />,
      href: "/myProfile",
      color: "#607D8B",
    },
  ];

  // Modified generatePDF function to support both download and email
  const generatePDF = async (forEmail = false) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const date = new Date();

      const day = date.getDate();
      const month = date.toLocaleString("en-GB", { month: "short" });
      const year = date.getFullYear();

      const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const formattedTimestamp = `${day}-${month}-${year}, ${time}`;

      const companyName = session?.user?.companyName || "Dashboard Report";
      const companyAddress = session?.user?.companyName || "";

      // Add title and timestamp
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0); // Pure black text color
      doc.text(companyName, pageWidth / 2, 10, { align: "center" });
      doc.setFontSize(10);
      doc.text(`Generated on: ${formattedTimestamp}`, pageWidth - 15, 20, {
        align: "right",
      });
      doc.setFontSize(12);

      let yPos = 30;

      // Bank Status
      if (bankPositions.length > 0) {
        doc.text("Bank Status", 14, yPos);
        yPos += 5;

        const bankColumns = [
          { header: "Account Title", dataKey: "AccountTitle" },
          { header: "Balance", dataKey: "Balance" },
          { header: "Tag", dataKey: "Tag" },
        ];

        const bankRows = bankPositions.map((bank) => ({
          AccountTitle: bank.AccountTitle,
          Balance: Number(bank.BalanceAmount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          Tag: bank.Tag,
        }));

        // Add total row
        const totalBank = bankPositions.reduce(
          (total, item) => total + Number(item.BalanceAmount || 0),
          0
        );

        bankRows.push({
          AccountTitle: "Total",
          Balance: totalBank.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          Tag: totalBank >= 0 ? "Dr" : "Cr",
        });

        doc.autoTable({
          startY: yPos,
          head: [bankColumns.map((col) => col.header)],
          body: bankRows.map((row) => [row.AccountTitle, row.Balance, row.Tag]),
          theme: "grid",
          styles: {
            fontSize: 8,
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
          },
          headStyles: {
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          columnStyles: {
            1: { halign: "right" },
            2: { halign: "center" },
          },
          didParseCell: function (data) {
            if (data.row.index === bankRows.length - 1) {
              data.cell.styles.fontStyle = "bold";
            }
          },
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // Cash In Hands
      if (cashPositions.length > 0) {
        doc.text("Cash In Hands", 14, yPos);
        yPos += 5;

        const cashColumns = [
          { header: "Account Title", dataKey: "AccountTitle" },
          { header: "Balance", dataKey: "Balance" },
          { header: "Tag", dataKey: "Tag" },
        ];

        const cashRows = cashPositions.map((cash) => ({
          AccountTitle: cash.AccountTitle,
          Balance: Number(cash.BalanceAmount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          Tag: cash.Tag,
        }));

        // Add total row
        const totalCash = cashPositions.reduce(
          (total, item) => total + Number(item.BalanceAmount || 0),
          0
        );

        cashRows.push({
          AccountTitle: "Total",
          Balance: totalCash.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          Tag: totalCash >= 0 ? "Dr" : "Cr",
        });

        doc.autoTable({
          startY: yPos,
          head: [cashColumns.map((col) => col.header)],
          body: cashRows.map((row) => [row.AccountTitle, row.Balance, row.Tag]),
          theme: "grid",
          styles: {
            fontSize: 8,
            textColor: [0, 0, 0], // Pure black text
            lineColor: [0, 0, 0], // Pure black lines/borders
            lineWidth: 0.1, // Slightly thinner lines for better appearance
          },
          headStyles: {
            fillColor: [0, 0, 0], // Pure black header background
            textColor: [255, 255, 255], // White text for header
            fontStyle: "bold",
          },
          columnStyles: {
            1: { halign: "right" }, // Right align Balance column
            2: { halign: "center" }, // Center Tag column
          },
          // Make the total row bold
          didParseCell: function (data) {
            if (data.row.index === cashRows.length - 1) {
              data.cell.styles.fontStyle = "bold";
            }
          },
        });

        yPos = doc.lastAutoTable.finalY + 10;

        // Add new page if not enough space
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }
      }

      // Export Receivable
      if (receivableExport.length > 0) {
        doc.text("Export Receivable", 14, yPos);
        yPos += 5;

        const receiveExportColumns = [
          { header: "Account Title", dataKey: "AccountTitle" },
          { header: "Balance", dataKey: "Balance" },
          { header: "Tag", dataKey: "Tag" },
        ];

        const receiveExportRows = receivableExport.map((item) => ({
          AccountTitle: item.AccountTitle,
          Balance: Number(item.BalanceAmount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          Tag: item.Tag,
        }));

        // Add total row
        const totalExport = receivableExport.reduce(
          (total, item) => total + Number(item.BalanceAmount || 0),
          0
        );

        receiveExportRows.push({
          AccountTitle: "Total",
          Balance: totalExport.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          Tag: totalExport >= 0 ? "Dr" : "Cr",
        });

        doc.autoTable({
          startY: yPos,
          head: [receiveExportColumns.map((col) => col.header)],
          body: receiveExportRows.map((row) => [
            row.AccountTitle,
            row.Balance,
            row.Tag,
          ]),
          theme: "grid",
          styles: {
            fontSize: 8,
            textColor: [0, 0, 0], // Pure black text
            lineColor: [0, 0, 0], // Pure black lines/borders
            lineWidth: 0.1, // Slightly thinner lines for better appearance
          },
          headStyles: {
            fillColor: [0, 0, 0], // Pure black header background
            textColor: [255, 255, 255], // White text for header
            fontStyle: "bold",
          },
          columnStyles: {
            1: { halign: "right" }, // Right align Balance column
            2: { halign: "center" }, // Center Tag column
          },
          // Make the total row bold
          didParseCell: function (data) {
            if (data.row.index === receiveExportRows.length - 1) {
              data.cell.styles.fontStyle = "bold";
            }
          },
        });

        yPos = doc.lastAutoTable.finalY + 10;

        // Add new page if not enough space
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }
      }

      // Local Receivable
      if (receivableLocal.length > 0) {
        doc.text("Local Receivable", 14, yPos);
        yPos += 5;

        const receiveLocalColumns = [
          { header: "Account Title", dataKey: "AccountTitle" },
          { header: "Balance", dataKey: "Balance" },
          { header: "Tag", dataKey: "Tag" },
        ];

        const receiveLocalRows = receivableLocal.map((item) => ({
          AccountTitle: item.AccountTitle,
          Balance: Number(item.BalanceAmount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          Tag: item.Tag,
        }));

        // Add total row
        const totalLocal = receivableLocal.reduce(
          (total, item) => total + Number(item.BalanceAmount || 0),
          0
        );

        receiveLocalRows.push({
          AccountTitle: "Total",
          Balance: totalLocal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          Tag: totalLocal >= 0 ? "Dr" : "Cr",
        });

        doc.autoTable({
          startY: yPos,
          head: [receiveLocalColumns.map((col) => col.header)],
          body: receiveLocalRows.map((row) => [
            row.AccountTitle,
            row.Balance,
            row.Tag,
          ]),
          theme: "grid",
          styles: {
            fontSize: 8,
            textColor: [0, 0, 0], // Pure black text
            lineColor: [0, 0, 0], // Pure black lines/borders
            lineWidth: 0.1, // Slightly thinner lines for better appearance
          },
          headStyles: {
            fillColor: [0, 0, 0], // Pure black header background
            textColor: [255, 255, 255], // White text for header
            fontStyle: "bold",
          },
          columnStyles: {
            1: { halign: "right" }, // Right align Balance column
            2: { halign: "center" }, // Center Tag column
          },
          // Make the total row bold
          didParseCell: function (data) {
            if (data.row.index === receiveLocalRows.length - 1) {
              data.cell.styles.fontStyle = "bold";
            }
          },
        });

        yPos = doc.lastAutoTable.finalY + 10;

        // Add new page if not enough space
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }
      }

      // Traders Payable
      if (tradersPayable?.length > 0) {
        doc.text("Traders Payable", 14, yPos);
        yPos += 5;

        // Group traders by ParentAccountTitle
        const groupedTradersPayable = {};
        tradersPayable.forEach((item) => {
          const parentTitle = item.ParentAccountTitle || "Other";
          if (!groupedTradersPayable[parentTitle]) {
            groupedTradersPayable[parentTitle] = [];
          }
          groupedTradersPayable[parentTitle].push(item);
        });

        const tradersColumns = [
          { header: "Account Title", dataKey: "AccountTitle" },
          { header: "Balance", dataKey: "Balance" },
          { header: "Tag", dataKey: "Tag" },
        ];

        const tradersRows = [];
        // Track total row index for bold styling
        let totalRowIndices = [];
        let currentIndex = 0;

        // Add items with parent title as headers
        Object.keys(groupedTradersPayable).forEach((parentTitle) => {
          const items = groupedTradersPayable[parentTitle];

          // Add parent title row
          tradersRows.push([`${parentTitle} (Group)`, "", ""]);
          currentIndex++;

          // Add child items
          items.forEach((item) => {
            tradersRows.push([
              `  ${item.AccountTitle}`,
              Number(item.BalanceAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              }),
              item.Tag,
            ]);
            currentIndex++;
          });

          // Calculate subtotal
          const subtotal = items.reduce(
            (total, item) => total + Number(item.BalanceAmount || 0),
            0
          );

          tradersRows.push([
            "  Subtotal",
            subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 }),
            subtotal >= 0 ? "Cr" : "Dr",
          ]);
          totalRowIndices.push(currentIndex);
          currentIndex++;
        });

        // Add total row
        const totalTraders = tradersPayable.reduce(
          (total, item) => total + Number(item.BalanceAmount || 0),
          0
        );

        tradersRows.push([
          "Total",
          totalTraders.toLocaleString(undefined, { minimumFractionDigits: 2 }),
          totalTraders <= 0 ? "Dr" : "Cr",
        ]);
        totalRowIndices.push(currentIndex);

        doc.autoTable({
          startY: yPos,
          head: [tradersColumns.map((col) => col.header)],
          body: tradersRows,
          theme: "grid",
          styles: {
            fontSize: 8,
            textColor: [0, 0, 0], // Pure black text
            lineColor: [0, 0, 0], // Pure black lines/borders
            lineWidth: 0.1, // Slightly thinner lines for better appearance
          },
          headStyles: {
            fillColor: [0, 0, 0], // Pure black header background
            textColor: [255, 255, 255], // White text for header
            fontStyle: "bold",
          },
          columnStyles: {
            1: { halign: "right" }, // Right align Balance column
            2: { halign: "center" }, // Center Tag column
          },
          // Make the subtotal and total rows bold
          didParseCell: function (data) {
            if (
              totalRowIndices.includes(data.row.index) ||
              data.row.index === tradersRows.length - 1
            ) {
              data.cell.styles.fontStyle = "bold";
            }

            // Style for parent title rows
            if (
              data.row.raw[0].includes("(Group)") &&
              data.section === "body"
            ) {
              data.cell.styles.fontStyle = "bold";
              data.cell.styles.fillColor = [0, 0, 0]; // Pure black background for group headers
              data.cell.styles.textColor = [255, 255, 255]; // White text for group headers
            }
          },
        });

        yPos = doc.lastAutoTable.finalY + 10;

        // Add new page if not enough space
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }
      }

      // Loans Payable
      if (loansPayable?.length > 0) {
        doc.text("Loans Payable", 14, yPos);
        yPos += 5;

        // Group loans by ParentAccountTitle
        const groupedLoansPayable = {};
        loansPayable.forEach((item) => {
          const parentTitle = item.ParentAccountTitle || "Other";
          if (!groupedLoansPayable[parentTitle]) {
            groupedLoansPayable[parentTitle] = [];
          }
          groupedLoansPayable[parentTitle].push(item);
        });

        const loansColumns = [
          { header: "Account Title", dataKey: "AccountTitle" },
          { header: "Balance", dataKey: "Balance" },
          { header: "Tag", dataKey: "Tag" },
        ];

        const loansRows = [];
        // Track total row index for bold styling
        let totalRowIndices = [];
        let currentIndex = 0;

        // Add items with parent title as headers
        Object.keys(groupedLoansPayable).forEach((parentTitle) => {
          const items = groupedLoansPayable[parentTitle];

          // Add parent title row
          loansRows.push([`${parentTitle} (Group)`, "", ""]);
          currentIndex++;

          // Add child items
          items.forEach((item) => {
            loansRows.push([
              `  ${item.AccountTitle}`,
              Number(item.BalanceAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              }),
              item.Tag,
            ]);
            currentIndex++;
          });

          // Calculate subtotal
          const subtotal = items.reduce(
            (total, item) => total + Number(item.BalanceAmount || 0),
            0
          );

          loansRows.push([
            "  Subtotal",
            subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 }),
            subtotal >= 0 ? "Cr" : "Dr",
          ]);
          totalRowIndices.push(currentIndex);
          currentIndex++;
        });

        // Add total row
        const totalLoans = loansPayable.reduce(
          (total, item) => total + Number(item.BalanceAmount || 0),
          0
        );

        loansRows.push([
          "Total",
          totalLoans.toLocaleString(undefined, { minimumFractionDigits: 2 }),
          totalLoans <= 0 ? "Dr" : "Cr",
        ]);
        totalRowIndices.push(currentIndex);

        doc.autoTable({
          startY: yPos,
          head: [loansColumns.map((col) => col.header)],
          body: loansRows,
          theme: "grid",
          styles: {
            fontSize: 8,
            textColor: [0, 0, 0], // Pure black text
            lineColor: [0, 0, 0], // Pure black lines/borders
            lineWidth: 0.1, // Slightly thinner lines for better appearance
          },
          headStyles: {
            fillColor: [0, 0, 0], // Pure black header background
            textColor: [255, 255, 255], // White text for header
            fontStyle: "bold",
          },
          columnStyles: {
            1: { halign: "right" }, // Right align Balance column
            2: { halign: "center" }, // Center Tag column
          },
          // Make the subtotal and total rows bold
          didParseCell: function (data) {
            if (
              totalRowIndices.includes(data.row.index) ||
              data.row.index === loansRows.length - 1
            ) {
              data.cell.styles.fontStyle = "bold";
            }

            // Style for parent title rows
            if (
              data.row.raw[0].includes("(Group)") &&
              data.section === "body"
            ) {
              data.cell.styles.fontStyle = "bold";
              data.cell.styles.fillColor = [0, 0, 0]; // Pure black background for group headers
              data.cell.styles.textColor = [255, 255, 255]; // White text for group headers
            }
          },
        });

        yPos = doc.lastAutoTable.finalY + 10;

        // Add new page if not enough space
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }
      }

      const filename = `${companyName.replace(/\s+/g, "_")}_Dashboard_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      if (forEmail) {
        // For email: generate base64 PDF directly to ensure compatibility
        // Use jsPDF's built-in base64 output
        const base64PDF = doc.output("datauristring").split(",")[1];

        console.log("Sending PDF via email...");
        const response = await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pdfBuffer: base64PDF,
            filename,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || "Failed to send email");
        }

        alert("Email sent successfully!");
      } else {
        // For download: save as file
        doc.save(filename);
      }
    } catch (error) {
      console.error("Error in generatePDF:", error);
      alert("Failed to " + (forEmail ? "send email" : "generate PDF"));
    }
  };

  // Function to schedule email - simplified to send immediately
  const scheduleEmail = async () => {
    try {
      await generatePDF(true);
    } catch (error) {
      console.error("Error in scheduleEmail:", error);
      alert("Failed to send email");
    }
  };

  // Function to handle scheduling
  const handleDailySchedule = async () => {
    try {
      // Get client's timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (isScheduleActive) {
        // Delete existing schedule
        const response = await fetch("/api/schedule", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobId: scheduledJobId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete schedule");
        }

        setIsScheduleActive(false);
        setScheduledJobId(null);
        setScheduledTime(null);
        alert("Schedule removed");
      } else {
        // Create new schedule
        const response = await fetch("/api/schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ timezone }),
        });

        if (!response.ok) {
          throw new Error("Failed to create schedule");
        }

        const data = await response.json();
        setScheduledJobId(data.jobId);
        setIsScheduleActive(true);
        setScheduledTime(data.scheduledTime);
        alert(`Report scheduled for ${data.scheduledTime}`);
      }
    } catch (error) {
      console.error("Error managing schedule:", error);
      alert("Failed to manage schedule");
    }
  };

  return (
    <>
      <div className="px-6 md:py-6 py-20">
        {/* PDF Export Button */}
        {/* <div className="flex justify-end mb-4 gap-4">
          <motion.button
            onClick={() => generatePDF(false)}
            disabled={isLoading}
            className="flex items-center gap-2 px-2 py-1 text-white rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            style={{ backgroundColor: currentColor }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFilePdf className="text-lg" />
            Export to PDF
          </motion.button>
        </div> */}
        {nextScheduledTime && (
          <motion.div
            className="text-sm text-gray-600 mb-4 text-right"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Next report scheduled for: {nextScheduledTime} (Your local time)
          </motion.div>
        )}

        {/* Dashboard Buttons */}
        <motion.div
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {dashboardButtons.map((button, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="h-full"
            >
              {button.href ? (
                <Link href={button.href} className="h-full block">
                  <DashboardButton
                    title={button.title}
                    description={button.description}
                    icon={button.icon}
                    color={button.color}
                  />
                </Link>
              ) : (
                <DashboardButton
                  title={button.title}
                  description={button.description}
                  icon={button.icon}
                  color={button.color}
                  onClick={() => openPopup(button.popupType, button.title)}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Popups */}
      <DashboardPopup
        isOpen={activePopup === "bankCash"}
        onClose={closePopup}
        title={popupTitle}
      >
        <BankAndCashPosition
          isLoading={isLoading}
          bankPositions={bankPositions}
          cashPositions={cashPositions}
        />
      </DashboardPopup>

      <DashboardPopup
        isOpen={activePopup === "receivables"}
        onClose={closePopup}
        title={popupTitle}
      >
        <Receivable
          isLoading={isLoading}
          receivableExport={receivableExport}
          receivableLocal={receivableLocal}
        />
      </DashboardPopup>

      <DashboardPopup
        isOpen={activePopup === "payables"}
        onClose={closePopup}
        title={popupTitle}
      >
        <PayableAndLoan
          isLoading={isLoading}
          tradersPayable={tradersPayable}
          loansPayable={loansPayable}
        />
      </DashboardPopup>

      {listDisplay ? (
        <FabricReport
          data={listData}
          setListDisplay={setListDisplay}
          cc={session?.user?.companyId}
          bi="1"
          df={dayjs(dtFrom).format("DD-MM-YYYY")}
          dt={dayjs(dtTo).format("DD-MM-YYYY")}
          ghn={(listData[0].ItemGroupName = "Pocket Lining" ? "662" : "660")}
        />
      ) : null}
    </>
  );
};

export default Home;
