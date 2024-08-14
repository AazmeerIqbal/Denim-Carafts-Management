import { config, connectToDB, closeConnection } from "@/utils/database";
const sql = require("mssql");

export const GET = async (req) => {
  try {
    await connectToDB();
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query("  select RoleId, RoleName from User_RoleType");
    await closeConnection();
    const role = result.recordset;
    console.log(role);
    return new Response(JSON.stringify(role), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to fetch all Roles", { status: 500 });
  }
};
