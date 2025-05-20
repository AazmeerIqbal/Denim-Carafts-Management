const sql = require("mssql");
const { config, connectToDB, closeConnection } = require("@/utils/database");

export const GET = async (req, { params }) => {
  let pool;
  try {
    // Extract the companyId from the params
    const { companyId } = await params;

    // Connect to the database
    pool = await connectToDB();

    const orderDetails = await pool
      .request()
      .execute("sp_Cus_Order_mst_AccessShort");

    // Return the results
    return new Response(
      JSON.stringify({
        orderDetails: orderDetails.recordsets[1],
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch cash and bank positions" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    if (pool) {
      await closeConnection(pool);
    }
  }
};
