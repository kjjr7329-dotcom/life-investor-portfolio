import { createClient } from '@supabase/supabase-js';

// ★ 여기에 아까 복사한 [Project URL]을 붙여넣으세요!
const supabaseUrl = 'https://sinjocrqqilneoyygref.supabase.co'; 

// ★ 여기에 아까 복사한 [API Key - anon]을 붙여넣으세요!
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbmpvY3JxcWlsbmVveXlncmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNzQ1MzAsImV4cCI6MjA4MDg1MDUzMH0.SkY93qm5gwg8P643SdbxMHfnEAigKi0G7klxhkI6z_E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);