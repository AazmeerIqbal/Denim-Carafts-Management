import { config, connectToDB, closeConnection } from "@/utils/database";
const sql = require("mssql");

export const POST = async (req) => {
  try {
    // Parse the request body
    const body = await req.json();
    console.log("Received body:", body); // Log the body

    const { companyId, CusOrderID, SP } = body; // Ensure the field names match exactly

    console.log("Received inputs:", companyId, CusOrderID); // Check values

    if (!companyId || !CusOrderID) {
      return new Response("Missing required inputs", { status: 400 });
    }

    await connectToDB();
    const pool = await sql.connect(config);

    // Execute the stored procedure with CompanyID and CusOrderID
    const result = await pool
      .request()
      .input("CompanyID", sql.VarChar(100), companyId.toString())
      .input("CusOrderID", sql.VarChar(100), CusOrderID.toString())
      .execute(SP);

    // Close the connection
    await closeConnection();

    // Return the result
    return new Response(JSON.stringify(result.recordset), {
      status: 200,
    });
  } catch (err) {
    console.error("Error executing the stored procedure:", err);

    // Ensure connection is closed on error
    await closeConnection();

    return new Response("Failed to execute the stored procedure", {
      status: 500,
    });
  }
};
