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
    const result = await pool
      .request()
      .input("CompanyId", sql.VarChar(100), companyId)
      .execute("Customers_sel");

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
