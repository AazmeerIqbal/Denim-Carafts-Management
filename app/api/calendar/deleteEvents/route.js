import { config, connectToDB, closeConnection } from "@/utils/database";
import sql from "mssql";
import { revalidatePath } from "next/cache";

export const DELETE = async (req) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Event ID is required", { status: 400 });
    }

    await connectToDB();
    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM CalendarSchedule WHERE id = @id");

    await closeConnection();

    if (result.rowsAffected[0] === 0) {
      return new Response("No event found with the provided ID", {
        status: 404,
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    // Revalidate the calendar page after deletion
    revalidatePath("/calendar");

    return new Response(
      JSON.stringify({ message: "Event deleted successfully" }),
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store", // prevents caching
        },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response("Failed to delete the event", {
      status: 500,
      headers: {
        "Cache-Control": "no-store", // prevents caching
      },
    });
  }
};
