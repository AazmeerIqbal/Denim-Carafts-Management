import { config, connectToDB, closeConnection } from "@/utils/database";
import sql from "mssql";

export const GET = async (req) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId") || null;
    const vendorId = searchParams.get("vendorId") || null;
    const showHide = parseInt(searchParams.get("showHide")) || null;
    const groupItemId = parseInt(searchParams.get("groupHead")) || null;
    const branchId = parseInt(searchParams.get("location")) || null;
    const dateFrom = searchParams.get("dtFrom") || null;
    const dateTo = searchParams.get("dtTo") || null;
    const greaterThan = searchParams.get("qtyMin") || null;
    const lessThan = searchParams.get("qtyMax") || null;
    const companyId = searchParams.get("companyId") || null;

    // console.log(`
    //   EXEC Fabrice_Stock_Position 
    //   @ItemId = ${itemId !== null ? `'${itemId}'` : null}, 
    //   @CompanyId = '${companyId}', 
    //   @VendorId = ${vendorId !== null ? `'${vendorId}'` : null}, 
    //   @ShowHide = ${showHide !== null ? showHide : null}, 
    //   @GroupItemId = ${groupItemId !== null ? groupItemId : null}, 
    //   @BranchId = ${branchId !== null ? branchId : null}, 
    //   @DateFrom = ${dateFrom !== null ? `'${dateFrom}'` : null}, 
    //   @DateTo = ${dateTo !== null ? `'${dateTo}'` : null}, 
    //   @GreaterThan = ${greaterThan == "null" ? null: `'${greaterThan}'` }, 
    //   @LessThan = ${lessThan == "null" ? null: `'${lessThan}'` }
    // `);


    const pool = await sql.connect(config);
    const result = await pool
  .request()
  .input("ItemId", sql.VarChar(100), itemId || null)
  .input("CompanyId", sql.VarChar(100), companyId || null)
  .input("VendorId", sql.VarChar(100), vendorId || null)
  .input("ShowHide", sql.Int, showHide !== null ? showHide : null)
  .input("GroupItemId", sql.Int, groupItemId !== null ? groupItemId : null)
  .input("BranchId", sql.Int, branchId !== null ? branchId : null)
  .input("DateFrom", sql.DateTime, dateFrom !== null ? dateFrom : null)
  .input("DateTo", sql.DateTime, dateTo !== null ? dateTo : null)
  .input("GreaterThan", sql.VarChar(100), greaterThan == "null" ? null : greaterThan)
  .input("LessThan", sql.VarChar(100), lessThan == "null" ? null : lessThan)
  .execute("Fabrice_Stock_Position_det");

    await closeConnection();

    return new Response(JSON.stringify(result.recordset), {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Failed to execute the stored procedure", {
      status: 500,
    });
  }
};
