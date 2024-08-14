import { config, connectToDB, closeConnection } from "@/utils/database";
import sql from "mssql";

export const DELETE = async (req) => {
  try {
    // Extract query parameters from the URL
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Event ID is required", { status: 400 });
    }

    // Ensure the database is connected
    await connectToDB();
    const pool = await sql.connect(config);

    // Perform the query with parameterized query
    const result = await pool
      .request()
      .input("id", sql.Int, id) // Bind the id parameter
      .query("DELETE FROM CalendarSchedule WHERE id = @id");

    // Optionally close the connection
    await closeConnection();

    // Check if any rows were affected
    if (result.rowsAffected[0] === 0) {
      return new Response("No event found with the provided ID", {
        status: 404,
      });
    }

    // Return a success response
    return new Response("Event deleted successfully", { status: 200 });
  } catch (err) {
    console.error(err);
    // Return an error response if the query fails
    return new Response("Failed to delete the event", { status: 500 });
  }
};
