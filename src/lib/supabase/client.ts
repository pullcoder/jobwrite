import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nkhjhyywyvgydriihfvj.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5raGpoeXl3eXZneWRyaWloZnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyOTY3OTUsImV4cCI6MjA5MDg3Mjc5NX0.bTRx5rIgmctjUNux4bZJIIua2ScTbZULd70Djly2CxA";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
