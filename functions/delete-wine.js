import { createClient } from "@supabase/supabase-js";
import { response } from "../utils/response";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const handler = async (event) => {
  const { id } = JSON.parse(event.body);

  const { error } = await supabase.from("wines").delete().eq("id", id);

  if (error) {
    return response(500, { error: error.message });
  }

  return response(200, data);
};
