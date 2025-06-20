import { createClient } from "@supabase/supabase-js";

let url="https://ebtahrbgutdgjnybbjdn.supabase.co"
let key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidGFocmJndXRkZ2pueWJiamRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDI5NjQsImV4cCI6MjA2NTk3ODk2NH0.BKB-asFTVMaBFqx4uw444OlLge_TuURJucnySZ8Y-Dw"

export const supabase = createClient(url, key);
