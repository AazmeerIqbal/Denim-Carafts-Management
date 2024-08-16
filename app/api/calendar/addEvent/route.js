import { config, connectToDB, closeConnection } from "@/utils/database";
import sql from "mssql";
import { revalidatePath } from "next/cache";

export const POST = async (req) => {
  const {
    CompanyId,
    UserId,
    start,
    end,
    title,
    description,
    location,
    people,
  } = await req.json();

  try {
    // Convert the array to a comma-separated string if it's an array
    const peopleString = Array.isArray(people) ? people.join(",") : people;

    // Connect to the database
    await connectToDB();
    const pool = await sql.connect(config);

    // Insert event into CalendarSchedule table
    const result = await pool
      .request()
      .input("CompanyId", sql.Int, CompanyId)
      .input("UserId", sql.Int, UserId)
      .input("start", sql.DateTime, start)
      .input("end", sql.DateTime, end)
      .input("title", sql.NVarChar, title)
      .input("description", sql.NVarChar, description || null)
      .input("location", sql.NVarChar, location || null)
      .input("people", sql.NVarChar, peopleString || null)
      .query(
        `INSERT INTO CalendarSchedule ([CompanyId], [UserId], [start], [end], [title], [description], [location], [people])
         VALUES (@CompanyId, @UserId, @start, @end, @title, @description, @location, @people)`
      );

    await closeConnection();

    revalidatePath("/calendar"); // Adjust this path as necessary

    return new Response(
      JSON.stringify({ message: "Event added successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to add event:", error);
    return new Response(
      JSON.stringify({ message: "Failed to add event", error }),
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store", // prevents caching
        },
      }
    );
  }
};
