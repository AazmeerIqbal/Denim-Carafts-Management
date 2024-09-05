import { config, connectToDB, closeConnection } from "@/utils/database";
const sql = require("mssql");
import dayjs from "dayjs";

export const GET = async (req, { params }) => {
  const companyId = params.id;

  const currentDate = new Date();
  const dateFrom = dayjs(currentDate)
    .subtract(6, "month")
    .startOf("month")
    .format("YYYY-MM-DD");
  const dateTo = dayjs(currentDate)
    .add(6, "month")
    .endOf("month")
    .format("YYYY-MM-DD");
  const invoiceType = "2";

  if (!companyId || !dateFrom || !dateTo || !invoiceType) {
    return new Response("Missing parameters", { status: 400 });
  }

  try {
    await connectToDB();
    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("CompanyID", sql.VarChar(100), companyId)
      .input("InvoiceType", sql.VarChar(100), invoiceType)
      .input("DateFrom", sql.DateTime, dateFrom)
      .input("DateTo", sql.DateTime, dateTo)
      .execute("rptAgingPayableImportSummaryChart");

    await closeConnection();
    return new Response(JSON.stringify(result.recordset), { status: 200 });
  } catch (err) {
    console.error("Error running stored procedure:", err);
    return new Response("Failed to run stored procedure", { status: 500 });
  }
};
