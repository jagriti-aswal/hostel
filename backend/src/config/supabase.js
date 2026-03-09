// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// const supabase = createClient(supabaseUrl, supabaseKey);

// export default supabase;
import dotenv from "dotenv";
dotenv.config();
import { createClient } from "@supabase/supabase-js";
//console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
//console.log("URL:", process.env.SUPABASE_URL);
export default supabase;