import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function auth() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@environics.com',
    password: 'password123'
  });
  if (error) {
    console.error("Auth Error:", error.message);
    return;
  }
  
  const token = data.session?.access_token;
  console.log("Token:", token?.substring(0, 20) + "...");
  
  const res = await fetch('http://localhost:3000/api/v1/document-types', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();
  console.log("Document Types:", JSON.stringify(json, null, 2));

  // Let's also fetch events just in case
  const projectsRes = await fetch('http://localhost:3000/api/v1/projects', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const projectsJson = await projectsRes.json();
  if (projectsJson.data?.length > 0) {
    const projId = projectsJson.data[0].id;
    const eventsRes = await fetch(`http://localhost:3000/api/v1/projects/${projId}/events`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const eventsJson = await eventsRes.json();
    console.log("Events:", JSON.stringify(eventsJson, null, 2));
  }
}

auth();
