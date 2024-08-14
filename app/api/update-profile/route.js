import { config, connectToDB, closeConnection } from "../../../utils/database";
const sql = require("mssql");

// PATCH (update)
export const PATCH = async (req) => {
  try {
    await connectToDB();

    // Extract query parameters from the URL
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    // Parse the request body to get the updated user data
    const { name, fullName, email, phone, isActive, roleId, dateOfBirth } =
      await req.json();

    // Build the SQL query
    const que = `
        UPDATE User_mst
        SET UserName = @name,
            FullName = @fullName,
            Email = @email,
            Phone = @phone,
            IsActive = @isActive,
            RoleId = @roleId
        WHERE UserId = @id
      `;

    // Prepare the SQL statement with parameters
    await connectToDB();
    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.VarChar(500), name)
      .input("fullName", sql.NVarChar(500), fullName)
      .input("email", sql.NVarChar(500), email)
      .input("phone", sql.NVarChar(50), phone)
      .input("isActive", sql.Bit, isActive)
      .input("roleId", sql.Int, roleId)
      .input("dateOfBirth", sql.Date, dateOfBirth)
      .query(que);
    await closeConnection();

    // return new Response("User data updated successfully", { status: 200 });
    return new Response(
      JSON.stringify({ message: "User data updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.log("Error:", err);
    return new Response("Failed to update user data", { status: 500 });
  }
};
