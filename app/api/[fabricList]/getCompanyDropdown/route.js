import { config, connectToDB, closeConnection } from "@/utils/database";
import sql from "mssql";

export const GET = async (req) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId") || null;
    console.log(companyId);

    if (!companyId) {
      return new Response("companyId is required", { status: 400 });
    }

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("CompanyId", sql.VarChar(100), companyId)
      .execute("Company_Branches_sel_dropdown");

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
