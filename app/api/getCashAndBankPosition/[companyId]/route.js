const sql = require("mssql");
const { config, connectToDB, closeConnection } = require("@/utils/database");

export const GET = async (req, { params }) => {
  let pool;
  try {
    // Extract the companyId from the params
    const { companyId } = params;

    // Connect to the database
    pool = await connectToDB();

    // Get Bank Position
    const bankResult = await pool
      .request()
      .input("IsChildOf", sql.VarChar, "1206002001")
      .execute("BankAndCashPosition");

    // Get Cash In Hand Position
    const cashResult = await pool
      .request()
      .input("IsChildOf", sql.VarChar, "1206001")
      .execute("BankAndCashPosition");

    const receivableExport = await pool
      .request()
      .input("IsChildOf", sql.VarChar, "1201001")
      .execute("BankAndCashPosition");

    const receivableLocal = await pool
      .request()
      .input("IsChildOf", sql.VarChar, "1201002")
      .execute("BankAndCashPosition");

    const tradersPayable = await pool
      .request()
      .input("IsChildOf", sql.VarChar, "2101001")
      .execute("BankAndCashPosition");

    const loansPayable = await pool
      .request()
      .input("IsChildOf", sql.VarChar, "2102001")
      .execute("BankAndCashPosition");

    // Return the results
    return new Response(
      JSON.stringify({
        bankPositions: bankResult.recordset,
        cashPositions: cashResult.recordset,
        receivableExport: receivableExport.recordset,
        receivableLocal: receivableLocal.recordset,
        tradersPayable: tradersPayable.recordset,
        loansPayable: loansPayable.recordset,
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
