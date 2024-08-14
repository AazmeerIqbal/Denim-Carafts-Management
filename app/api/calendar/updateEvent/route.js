import { config, connectToDB, closeConnection } from "@/utils/database";
const sql = require("mssql");

// PUT (update)
export const PUT = async (req) => {
  try {
    await connectToDB();
    const pool = await sql.connect(config);

    const { id, title, description, location, start, end, people } =
      await req.json();

    // Convert people array to JSON string if it's an array
    const peopleStr = Array.isArray(people) ? JSON.stringify(people) : people;

    const query = `
        UPDATE CalendarSchedule
        SET 
            title = @title,
            description = @description,
            location = @location,
            start = @start,
            [end] = @end,
            people = @people
        WHERE 
            id = @id
    `;

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("title", sql.NVarChar(500), title)
      .input("description", sql.NVarChar(1000), description)
      .input("location", sql.NVarChar(500), location)
      .input("start", sql.DateTime, start)
      .input("end", sql.DateTime, end)
      .input("people", sql.NVarChar(sql.MAX), peopleStr) // Adjusted for JSON string or plain string
      .query(query);

    await closeConnection();

    return new Response(
      JSON.stringify({ message: "Event updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response("Failed to update event", { status: 500 });
  }
};
