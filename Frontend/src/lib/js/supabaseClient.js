import { createClient } from '@supabase/supabase-js';
const SUPABASE_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDk4Nzc4NCwiZXhwIjoxOTUwNTYzNzg0fQ.pvNjymNGXdj4HTKsHUsN3uhZNJr9FYKbXpS7Xyxhq2A';
const SUPABASE_URL = 'https://aesfbivwcjawvnujxazv.supabase.co';
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
