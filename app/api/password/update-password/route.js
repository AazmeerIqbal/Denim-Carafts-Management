import {
  config,
  connectToDB,
  closeConnection,
} from "../../../../utils/database";
const sql = require("mssql");

export const PUT = async (req) => {
  try {
    await connectToDB();

    const { password } = await req.json();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    const pool = await sql.connect(config);
    const query = `UPDATE User_mst SET UserPassword = @password WHERE UserId = @id;`;

    const result = await pool
      .request()
      .input("password", sql.VarChar, password)
      .input("id", sql.Int, id)
      .query(query);
    await closeConnection();

    console.log("Password update result:", result); // Log the result

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to update password:", err);
    return new Response(
      JSON.stringify({ error: "Failed to update password" }),
      { status: 500 }
    );
  }
};
