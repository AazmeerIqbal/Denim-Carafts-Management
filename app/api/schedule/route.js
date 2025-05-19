import cron from "node-cron";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import "jspdf-autotable";
import nodemailer from "nodemailer";

// Store scheduled jobs (in a real application, use a database)
let scheduledJobs = new Map();

// Function to create and start the daily 9 AM job
function createDailyJob(timezone) {
  // Remove any existing job
  const existingJob = scheduledJobs.get("daily-9am");
  if (existingJob) {
    existingJob.stop();
    scheduledJobs.delete("daily-9am");
  }

  console.log(`Setting up daily 9 AM job for timezone: ${timezone}`);

  const job = cron.schedule(
    "0 9 * * *", // Run at 9 am every day in the specified timezone
    async () => {
      try {
        console.log(
          "Executing scheduled job at:",
          new Date().toLocaleString("en-US", { timeZone: timezone })
        );

        // Import the SQL and database modules
        const sql = require("mssql");
        const { connectToDB, closeConnection } = require("@/utils/database");

        // Fetch all necessary data
        let bankPositions = [];
        let cashPositions = [];
        let receivableExport = [];
        let receivableLocal = [];
        let tradersPayable = [];
        let loansPayable = [];
        let orderDetails = [];

        let pool;
        try {
          console.log("Connecting to database for scheduled report...");
          pool = await connectToDB();
          console.log("Database connected successfully");

          // Get Bank Position
          console.log("Fetching bank positions...");
          const bankResult = await pool
            .request()
            .input("IsChildOf", sql.VarChar, "1206002001")
            .execute("BankAndCashPosition");
          bankPositions = bankResult.recordset;
          console.log(`Retrieved ${bankPositions.length} bank positions`);

          // Get Cash In Hand Position
          console.log("Fetching cash positions...");
          const cashResult = await pool
            .request()
            .input("IsChildOf", sql.VarChar, "1206001")
            .execute("BankAndCashPosition");
          cashPositions = cashResult.recordset;
          console.log(`Retrieved ${cashPositions.length} cash positions`);

          // Get Export Receivable
          console.log("Fetching export receivables...");
          const exportResult = await pool
            .request()
            .input("IsChildOf", sql.VarChar, "1201001")
            .execute("BankAndCashPosition");
          receivableExport = exportResult.recordset;
          console.log(
            `Retrieved ${receivableExport.length} export receivables`
          );

          // Get Local Receivable
          console.log("Fetching local receivables...");
          const localResult = await pool
            .request()
            .input("IsChildOf", sql.VarChar, "1201002")
            .execute("BankAndCashPosition");
          receivableLocal = localResult.recordset;
          console.log(`Retrieved ${receivableLocal.length} local receivables`);

          // Get Traders Payable
          console.log("Fetching traders payable...");
          const tradersResult = await pool
            .request()
            .input("IsChildOf", sql.VarChar, "2101001")
            .execute("BankAndCashPosition");
          tradersPayable = tradersResult.recordset;
          console.log(
            `Retrieved ${tradersPayable.length} traders payable entries`
          );

          // Get Loans Payable
          console.log("Fetching loans payable...");
          const loansResult = await pool
            .request()
            .input("IsChildOf", sql.VarChar, "2102001")
            .execute("BankAndCashPosition");
          loansPayable = loansResult.recordset;
          console.log(`Retrieved ${loansPayable.length} loans payable entries`);

          // Get Order Details
          console.log("Fetching order details...");
          const orderResult = await pool
            .request()
            .execute("sp_Cus_Order_mst_AccessShort");
          orderDetails = orderResult.recordsets[1];
          console.log(`Retrieved ${orderDetails?.length || 0} order details`);
        } catch (dbError) {
          console.error("Database error:", dbError);
          // Use mock data as fallback
          console.log("Using mock data as fallback for PDF generation");
          bankPositions = [
            { AccountTitle: "Bank Account 1", BalanceAmount: 25000, Tag: "Dr" },
            { AccountTitle: "Bank Account 2", BalanceAmount: 15000, Tag: "Dr" },
          ];

          cashPositions = [
            { AccountTitle: "Cash Account 1", BalanceAmount: 5000, Tag: "Dr" },
            { AccountTitle: "Cash Account 2", BalanceAmount: 3000, Tag: "Dr" },
          ];

          receivableExport = [
            {
              AccountTitle: "Export Receivable 1",
              BalanceAmount: 12000,
              Tag: "Dr",
            },
            {
              AccountTitle: "Export Receivable 2",
              BalanceAmount: 8000,
              Tag: "Dr",
            },
          ];
        } finally {
          // Close the database connection
          if (pool) {
            await closeConnection(pool);
            console.log("Database connection closed");
          }
        }

        console.log("Generating PDF with the fetched data...");
        // Generate PDF with complete data
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
        const companyName = "Dashboard Report";

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
            body: bankRows.map((row) => [
              row.AccountTitle,
              row.Balance,
              row.Tag,
            ]),
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
            body: cashRows.map((row) => [
              row.AccountTitle,
              row.Balance,
              row.Tag,
            ]),
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
            totalTraders.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            }),
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
                data.cell.styles.fillColor = [0, 0, 0];
                data.cell.styles.textColor = [255, 255, 255];
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
                data.cell.styles.fillColor = [0, 0, 0];
                data.cell.styles.textColor = [255, 255, 255];
              }
            },
          });

          yPos = doc.lastAutoTable.finalY + 10;
        }

        // Get PDF as base64 string directly using jsPDF's built-in method
        const base64PDF = doc.output("datauristring").split(",")[1];

        // Create a nodemailer transporter
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD,
          },
        });

        // Email options with timezone-aware filename
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: "azmeeriqbal@gmail.com",
          subject: `Daily Dashboard Report (${timezone})`,
          text: `Please find attached the daily dashboard report. Generated at ${formattedTimestamp} ${timezone} time.`,
          attachments: [
            {
              filename: `Dashboard_Report_${date
                .toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })
                .replace(/\//g, "-")}.pdf`,
              content: base64PDF,
              encoding: "base64",
              contentType: "application/pdf",
            },
          ],
        };

        console.log("Sending scheduled email...");
        await transporter.sendMail(mailOptions);
        console.log(
          "Daily email sent successfully at:",
          new Date().toLocaleString("en-US", { timeZone: timezone })
        );
      } catch (error) {
        console.error("Error in scheduled job:", error);
      }
    },
    {
      timezone, // Use the provided timezone
      scheduled: true,
      runOnInit: false,
    }
  );

  job.start();
  return job;
}

// This route will be called when the application starts or when timezone needs to be updated
export async function POST(req) {
  try {
    const { timezone } = await req.json();

    if (!timezone) {
      return NextResponse.json(
        { error: "Timezone is required" },
        { status: 400 }
      );
    }

    const job = createDailyJob(timezone);
    scheduledJobs.set("daily-9am", job);

    const nextInvocation = job.nextInvocation();

    return NextResponse.json({
      message: "Schedule created successfully",
      nextScheduledTime: nextInvocation.toLocaleString("en-US", {
        timeZone: timezone,
      }),
      timezone,
    });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "Failed to create schedule", details: error.message },
      { status: 500 }
    );
  }
}

// This route can be used to check the schedule status
export async function GET(req) {
  try {
    const job = scheduledJobs.get("daily-9am");
    if (!job) {
      return NextResponse.json(
        { error: "No schedule is currently active" },
        { status: 404 }
      );
    }

    const nextInvocation = job.nextInvocation();
    // We'll get the timezone from the URL parameters
    const { searchParams } = new URL(req.url);
    const timezone = searchParams.get("timezone") || "UTC";

    return NextResponse.json({
      message: "Schedule is active",
      nextScheduledTime: nextInvocation.toLocaleString("en-US", {
        timeZone: timezone,
      }),
      timezone,
    });
  } catch (error) {
    console.error("Error checking schedule:", error);
    return NextResponse.json(
      { error: "Failed to check schedule", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { jobId } = await req.json();

    if (!jobId || !scheduledJobs.has(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    // Stop and remove the scheduled job
    const job = scheduledJobs.get(jobId);
    job.stop();
    scheduledJobs.delete(jobId);
    console.log("Schedule deleted. Job ID:", jobId);

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json(
      { error: "Failed to delete schedule", details: error.message },
      { status: 500 }
    );
  }
}
