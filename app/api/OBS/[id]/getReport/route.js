import { config, connectToDB, closeConnection } from "@/utils/database";
import sql from "mssql";

export const POST = async (req, { params }) => {
  try {
    const {
      companyId,
      orderType,
      customer,
      shippedStatus,
      startDate,
      endDate,
    } = await req.json();

    if (!companyId) {
      return new Response("CompanyId is required", { status: 400 });
    }

    await connectToDB();

    const pool = await sql.connect(config);

    // Execute the stored procedure with proper null handling
    const result = await pool
      .request()
      .input("CompanyId", sql.Int, companyId)
      .input("DateFrom", sql.DateTime, startDate)
      .input("DateTo", sql.DateTime, endDate)
      .input("OrderType", sql.Int, parseInt(orderType) || null)
      .execute("chartCustomerOrderStatus");

    await closeConnection();

    return new Response(JSON.stringify(result.recordset), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response("Failed to execute the stored procedure", {
      status: 500,
    });
  }
};
