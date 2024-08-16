import {
  config,
  connectToDB,
  closeConnection,
} from "../../../../utils/database";
import { revalidatePath } from "next/cache";
const sql = require("mssql");

export const PUT = async (req) => {
  try {
    await connectToDB();
    const pool = await sql.connect(config);

    const { id, title, description, location, start, end, people } =
      await req.json();

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
      .input("people", sql.NVarChar(sql.MAX), peopleStr)
      .query(query);

    await closeConnection();

    // Revalidate the calendar page after the update
    revalidatePath("/calendar");

    return new Response(
      JSON.stringify({ message: "Event updated successfully" }),
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store", // prevents caching
        },
      }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response("Failed to update event", {
      status: 500,
      headers: {
        "Cache-Control": "no-store", // prevents caching
      },
    });
  }
};
