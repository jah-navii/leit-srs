import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// This is a placeholder UUID. In a real app, this comes from Supabase Auth.
const TEST_USER_ID = '00000000-0000-0000-0000-000000000000';

async function seedUserProgress() {
  console.log('🔄 Fetching problems to link to user...');

  // 1. Get all problem IDs
  const { data: problems, error: pError } = await supabase
    .from('problems')
    .select('id');

  if (pError) {
    console.error('❌ Error fetching problems:', pError.message);
    return;
  }

  // 2. Create progress entries for the test user
  const progressEntries = problems.map((p) => ({
    user_id: TEST_USER_ID,
    problem_id: p.id,
    box_level: 1,
    times_solved: 0,
    status: 'learning',
    last_solved: new Date(Date.now() - 86400000 * 2).toISOString(), // Set to 2 days ago so they appear "due"
  }));

  console.log(`🌱 Inserting ${progressEntries.length} progress records...`);

  const { error: iError } = await supabase
    .from('user_progress')
    .upsert(progressEntries, { onConflict: 'user_id,problem_id' });

  if (iError) {
    console.error('❌ Error seeding progress:', iError.message);
  } else {
    console.log('✅ Success! Test user now has problems in Box 1.');
    console.log(`👉 Use this User ID in your Frontend/Backend: ${TEST_USER_ID}`);
  }
}

seedUserProgress();