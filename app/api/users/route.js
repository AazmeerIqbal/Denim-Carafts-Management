import { config, connectToDB, closeConnection } from "@/utils/database";
const sql = require("mssql");

export const GET = async (req) => {
  try {
    await connectToDB();
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "  select UserId, CompanyId, UserName, FullName, Email, Gender, Phone, IsActive from User_mst"
      );
    await closeConnection();
    const user = result.recordset;
    console.log(user);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to fetch all Prompts", { status: 500 });
  }
};
