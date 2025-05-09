"use client";

import React from "react";
import { FaCalendarDays } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { GiWool } from "react-icons/gi";
import { MdManageAccounts } from "react-icons/md";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useStateContext } from "@/components/contexts/ContextProvider";
import chroma from "chroma-js";
import FabricReport from "@/components/Reports/FabricList";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";

import PayableSummeryCharLoad from "@/components/Charts/payableSummery/PayableSummeryCharLoad";
import PayableSummeryImportChartLoad from "@/components/Charts/payableSummeryImport/PayableSummeryImportChartLoad";
import BankAndCashPosition from "@/components/Dashboard/BandAndCashPosition";
import Receivable from "@/components/Dashboard/Receivable";
import PayableAndLoan from "@/components/Dashboard/PayableAndLoan";
import OrderDetails from "@/components/Dashboard/OrderDetails";
import { GoArrowUpRight } from "react-icons/go";
import { BorderColor } from "@mui/icons-material";

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
  const [orderDetails, setorderDetails] = useState([]);

  console.log("sessionsss:", session?.user);

  const [isLoading, setIsLoading] = useState(true);
  const { currentColor } = useStateContext();
  const [listDisplay, setListDisplay] = useState(false);
  const [listData, setListData] = useState(false);

  const lightColor = chroma(currentColor).brighten(1).hex(); // Lighter shade
  const darkColor = chroma(currentColor).darken(1.5).hex(); // Darker shade

  // Get date
  const dtFrom = "2020-01-01";
  const today = new Date();
  const dtTo = today.toISOString().split("T")[0];

  // Add new state for scheduling
  const [scheduledTime, setScheduledTime] = useState(null);
  const [emailScheduled, setEmailScheduled] = useState(false);

  // Add these state variables at the top with other states
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
      setBankPositions(data.bankPositions);
      setCashPositions(data.cashPositions);
      setReceivableExport(data.receivableExport);
      setreceivableLocal(data.receivableLocal);
      settradersPayable(data.tradersPayable);
      setloansPayable(data.loansPayable);
      setorderDetails(data.orderDetails);
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

  useEffect(() => {
    // getFabricPostions();
    getCashAndBankPositions();
    initializeSchedule(); // Initialize schedule when component mounts

    // Check schedule status every minute
    const intervalId = setInterval(checkScheduleStatus, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [session?.user?.id]);

  const cards = [
    {
      title: "Calendar",
      description: "Manage your schedule",
      href: "/calendar",
      icon: <FaCalendarDays />,
    },
    {
      title: "Users",
      description: "Manage users ",
      href: "/users",
      icon: <FaUsers />,
    },
    {
      title: "Account",
      description: "View and edit your profile",
      href: "/myProfile",
      icon: <MdManageAccounts />,
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
        // For email: convert to base64
        const pdfBuffer = btoa(doc.output("raw"));

        const response = await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pdfBuffer,
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
        <div className="flex justify-end mb-4 gap-4">
          <button
            onClick={() => generatePDF(false)}
            disabled={isLoading}
            className="flex items-center gap-2 px-2 py-1 text-white rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            style={{ backgroundColor: currentColor }}
          >
            <FaFilePdf className="text-lg" />
            Export to PDF
          </button>
        </div>
        {nextScheduledTime && (
          <div className="text-sm text-gray-600 mb-4 text-right">
            Next report scheduled for: {nextScheduledTime} (Your local time)
          </div>
        )}

        {/* Positions */}
        <div
          class="grid gap-2
         grid-cols-1 
         sm:grid-cols-2 
         md:grid-cols-3 
         lg:grid-cols-4"
        >
          <BankAndCashPosition
            isLoading={isLoading}
            bankPositions={bankPositions}
            cashPositions={cashPositions}
          />
        </div>

        {/* Receivable */}
        <div
          class="grid gap-2
         grid-cols-1 
         sm:grid-cols-2 
         md:grid-cols-3 
         lg:grid-cols-4 mt-8"
        >
          <Receivable
            isLoading={isLoading}
            receivableExport={receivableExport}
            receivableLocal={receivableLocal}
          />
        </div>

        {/* Payable and Loan */}
        <div
          class="grid gap-2
         grid-cols-1 
         sm:grid-cols-2 
         md:grid-cols-3 
         lg:grid-cols-4 mt-8"
        >
          <PayableAndLoan
            isLoading={isLoading}
            tradersPayable={tradersPayable}
            loansPayable={loansPayable}
          />
        </div>

        <div class=" mt-8">
          <OrderDetails isLoading={isLoading} orderDetails={orderDetails} />
        </div>

        {/* Chart Component */}
        {/* <div className="mt-2 flex justify-between mb-6 md:mt-8">
          <div className="group md:mb-0  w-full rounded-lg bg-[rgb(255,255,255)] dark:bg-gray-800 dark:border-gray-700  transition relative duration-300 drop-shadow-2xl h-[80%]">
            <h1 className="dark:text-white text-black text-2xl my-5 ml-4">
              Payable Summery
            </h1>
            <Link href="/payableSummary">
              <div className="absolute top-5 right-3 text-xl dark:bg-white dark:text-black bg-[#3f3d3d] text-white p-1 cursor cursor-pointer rounded-md">
                <GoArrowUpRight />
              </div>
            </Link>
            <div className="mx-auto">
              <PayableSummeryCharLoad />
            </div>
          </div>
        </div> */}
      </div>
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
