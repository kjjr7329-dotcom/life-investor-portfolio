import { createClient } from '@supabase/supabase-js';

// 👇 1. Supabase에서 복사한 'Project URL'을 아래 따옴표 안에 넣으세요.
const supabaseUrl = "https://sinjocrqqilneoyygref.supabase.co";

// 👇 2. Supabase에서 복사한 'anon public key'를 아래 따옴표 안에 넣으세요.
// (eyJh... 로 시작하는 아주 긴 문자열입니다)
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbmpvY3JxcWlsbmVveXlncmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNzQ1MzAsImV4cCI6MjA4MDg1MDUzMH0.SkY93qm5gwg8P643SdbxMHfnEAigKi0G7klxhkI6z_E";

// 이제 주소가 비어있을 일이 없으므로 에러가 나지 않습니다!
export const supabase = createClient(supabaseUrl, supabaseAnonKey);