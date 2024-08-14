import { config, connectToDB, closeConnection } from "@/utils/database";
import sql from "mssql";

export const GET = async (req) => {
  try {
    // Ensure the database is connected
    await connectToDB();
    const pool = await sql.connect(config);

    // Perform the query
    const result = await pool
      .request()
      .query(
        "SELECT id, start, [end], title, description, location, people FROM CalendarSchedule"
      );

    // Optionally close the connection
    await closeConnection();

    // Extract the data from the result
    const events = result.recordset;

    // Return the response with the events data
    return new Response(JSON.stringify(events), { status: 200 });
  } catch (err) {
    console.error(err);
    // Return an error response if the query fails
    return new Response("Failed to fetch all Events", { status: 500 });
  }
};
