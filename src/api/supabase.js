import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fauurxzprfxckydzcgyo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhdXVyeHpwcmZ4Y2t5ZHpjZ3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwOTg3MTksImV4cCI6MjA1NTY3NDcxOX0.COrlF47_u0Oqz1NVtp0XFOMDlZ6ltQnK8SleRs6Cm7M";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
