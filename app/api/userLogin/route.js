// import { config, connectToDB, closeConnection } from "@/utils/database";
// const sql = require("mssql");

// export const POST = async (req) => {
//   try {
//     await connectToDB();
//     const { username, password } = await req.json();

//     const pool = await sql.connect(config);
//     const result = await pool
//       .request()
//       .input("UserName", sql.VarChar, username)
//       .input("UserPassword", sql.VarChar, password)
//       .execute("User_mst_CheckLogin");

//     const user = result.recordset[0]; // Get the first record
//     await closeConnection();

//     if (user) {
//       return new Response(
//         JSON.stringify({ message: "Login Successful", user }),
//         {
//           status: 200,
//         }
//       );
//     } else {
//       return new Response(JSON.stringify({ error: "Invalid credentials" }), {
//         status: 401,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     await closeConnection();
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//     });
//   }
// };
