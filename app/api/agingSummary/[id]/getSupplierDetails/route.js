import { config, connectToDB, closeConnection } from "@/utils/database";
import sql from "mssql";

export const POST = async (req, { params }) => {
  try {
    // const { companyId } = params;
    const {
      companyId,
      supplierId,
      invoiceType,
      gstNonGst,
      currencyCode,
      dateFrom,
      dateTo,
    } = await req.json();

    if (!companyId) {
      return new Response("CompanyId is required", { status: 400 });
    }

    console.log(`supplierID: ${supplierId} (type: ${typeof supplierId})`);

    await connectToDB();

    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("CompanyID", sql.VarChar(100), companyId.toString())
      .input("AccountID", sql.VarChar(100), null)
      .input("SupplierId", sql.VarChar(100), supplierId.toString() || null)
      .input("InvoiceType", sql.VarChar(100), invoiceType || null)
      .input("GSTNonGST", sql.VarChar(10), gstNonGst || null)
      .input("CurrencyCode", sql.VarChar(10), currencyCode || null)
      .input("AgingDays", sql.VarChar(10), null || null)
      .input("DateFrom", sql.DateTime, dateFrom)
      .input("DateTo", sql.DateTime, dateTo)
      .execute("rptAgingPayablePartyWise");

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
