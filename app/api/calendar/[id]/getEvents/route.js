import { config, connectToDB, closeConnection } from "@/utils/database";
import sql from "mssql";

export const GET = async (req, { params }) => {
  const { id } = params; // Extract the last segment as ID

  try {
    await connectToDB();
    console.log("ID:", id);
    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        "SELECT id, start, [end], title, description, location, people FROM CalendarSchedule WHERE UserId = @id"
      );

    await closeConnection();

    const events = result.recordset;
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Failed to fetch the event", { status: 500 });
  }
};
