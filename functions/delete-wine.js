import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const handler = async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  const { id } = JSON.parse(event.body);

  const { error } = await supabase.from("wines").delete().eq("id", id);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
