import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("Received email request");
    const { pdfBuffer, filename } = await req.json();

    if (!pdfBuffer) {
      console.error("PDF buffer is missing");
      return NextResponse.json(
        { error: "PDF buffer is required" },
        { status: 400 }
      );
    }

    console.log("Creating email transporter...");
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "azmeeriqbal@gmail.com",
      subject: "Dashboard Report",
      text: "Please find attached the dashboard report.",
      attachments: [
        {
          filename:
            filename ||
            `Dashboard_Report_${new Date().toISOString().split("T")[0]}.pdf`,
          content: pdfBuffer,
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    };

    console.log("Sending email...");
    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    // Check for specific error types
    if (error.code === "EAUTH") {
      return NextResponse.json(
        {
          error: "Email authentication failed",
          details: "Please check your email credentials",
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
