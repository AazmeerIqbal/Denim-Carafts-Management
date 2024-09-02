import { config, connectToDB, closeConnection } from "@/utils/database";
import sql from "mssql";

export const GET = async (req, { params }) => {
  try {
    const { id } = params;
    const companyId = id;
    console.log(companyId);
    await connectToDB();

    if (!companyId) {
      return new Response("companyId is required", { status: 400 });
    }

    const pool = await sql.connect(config);

    // Execute the query as per the new requirement
    const result = await pool
      .request()
      .input("CompanyID", sql.VarChar(100), companyId)
      .input("SupplierId", sql.VarChar(100), null)
      .input("IsMultipurpuse", sql.VarChar(100), null)
      .input("IsImporter", sql.VarChar(100), "1")
      .input("IsActive", sql.VarChar(100), "0")
      .input("SearchText", sql.VarChar(100), null)
      .execute("Suppliers_sel_dropdown");

    await closeConnection();

    return new Response(JSON.stringify(result.recordset), {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Failed to execute the stored procedure", {
      status: 500,
    });
  }
};
