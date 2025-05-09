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
    "0 9 * * *", // Run at 9 AM every day in the specified timezone
    async () => {
      try {
        console.log(
          "Executing scheduled job at:",
          new Date().toLocaleString("en-US", { timeZone: timezone })
        );

        // Generate PDF
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Add basic content with timezone-aware timestamp
        doc.setFontSize(16);
        doc.text("Dashboard Report", pageWidth / 2, 10, { align: "center" });
        doc.setFontSize(12);
        doc.text(
          `Generated on: ${new Date().toLocaleString("en-US", {
            timeZone: timezone,
          })}`,
          14,
          20
        );

        // Convert PDF to base64
        const pdfBuffer = doc.output("base64");

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
          to: "iqbalmehram1974@gmail.com",
          subject: `Daily Dashboard Report (${timezone})`,
          text: `Please find attached the daily dashboard report. Generated at 9:00 AM ${timezone} time.`,
          attachments: [
            {
              filename: `Dashboard_Report_${new Date()
                .toLocaleString("en-US", {
                  timeZone: timezone,
                  dateStyle: "short",
                })
                .replace(/\//g, "-")}.pdf`,
              content: pdfBuffer,
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
