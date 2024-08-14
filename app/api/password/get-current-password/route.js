import { config, connectToDB, closeConnection } from "@/utils/database";
const sql = require("mssql");

export const GET = async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    if (!id) {
      return new Response("User ID is required", { status: 400 });
    }

    // console.log(id);
    await connectToDB();
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT UserPassword FROM User_mst WHERE UserId = @id"); // Example query, adjust as needed
    await closeConnection();
    const pass = result.recordset[0]?.UserPassword;

    return new Response(JSON.stringify({ password: pass }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to fetch the password", { status: 500 });
  }
};
