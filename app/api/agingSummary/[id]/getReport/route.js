import { config, connectToDB, closeConnection } from "@/utils/database";
import sql from "mssql";

export const POST = async (req, { params }) => {
  try {
    // const { companyId } = params;
    const {
      companyId,
      supplierID,
      invoiceType,
      gstNonGst,
      currencyCode,
      agingDays,
      dateFrom,
      dateTo,
    } = await req.json();

    if (!companyId) {
      return new Response("CompanyId is required", { status: 400 });
    }

    await connectToDB();

    const pool = await sql.connect(config);

    // Execute the stored procedure with proper null handling
    const result = await pool
      .request()
      .input("CompanyId", sql.VarChar(100), companyId.toString())
      .input("AccountId", sql.VarChar(100), null)
      .input("SupplierID", sql.VarChar(100), supplierID || null)
      .input("InvoiceType", sql.VarChar(100), invoiceType || null)
      .input("GSTNonGST", sql.VarChar(10), gstNonGst || null)
      .input("CurrencyCode", sql.VarChar(10), currencyCode || null)
      .input("AgingDays", sql.VarChar(10), agingDays || null)
      .input("DateFrom", sql.DateTime, dateFrom)
      .input("DateTo", sql.DateTime, dateTo)
      .execute("rptAgingPayableSummaryTemp");

    await closeConnection();

    return new Response(JSON.stringify(result.recordset), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response("Failed to execute the stored procedure", {
      status: 500,
    });
  }
};
