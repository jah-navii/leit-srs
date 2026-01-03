// backend/src/routes/session.ts
import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { calculatePriority } from '../services/algo.js';


const router = Router();

router.get('/daily-tasks', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 4;
  const userId = req.headers['user-id']; 
  console.log("Fetching for user" + userId);

  try {
    const { data, error } = await supabase
      .from('problems')
      .select(`
        *,
        user_progress!inner (
          box_level,
          last_solved,
          status
        )
      `)
      .eq('user_progress.user_id', userId);

    if (error) throw error;

    // 2. Map and Calculate Scores
    const scoredProblems = data.map((p: any) => {
      const progress = p.user_progress[0]; // Supabase returns an array for joins
      return {
        ...p,
        box_level: progress.box_level,
        last_solved: progress.last_solved,
        priority_score: calculatePriority({
          difficulty: p.difficulty,
          box_level: progress.box_level,
          last_solved: progress.last_solved
        })
      };
    });

    // 3. Sort by priority score and limit
    const dailyQueue = scoredProblems
      .sort((a, b) => b.priority_score - a.priority_score)
      .slice(0, limit);

    res.json(dailyQueue);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/review', async (req, res) => {
  const { userId, problemId, performance } = req.body;

  try {
    // 1. Fetch current box_level AND times_solved
    const { data: currentProgress, error: fetchError } = await supabase
      .from('user_progress')
      .select('box_level, times_solved') // <--- Add times_solved here
      .eq('user_id', userId)
      .eq('problem_id', problemId)
      .single();

    if (fetchError) throw fetchError;

    let newBoxLevel = currentProgress.box_level;
    // Calculate new solve count
    const newTimesSolved = performance === 'failed' 
      ? (currentProgress.times_solved || 0) 
      : (currentProgress.times_solved || 0) + 1;

    // 2. Transition logic
    if (performance === 'easy') {
      newBoxLevel = Math.min(newBoxLevel + 1, 5);
    } else if (performance === 'failed') {
      newBoxLevel = Math.max(newBoxLevel - 1, 1);
    }

    // 3. Update the record
    const { error: updateError } = await supabase
      .from('user_progress')
      .update({ 
        box_level: newBoxLevel, 
        last_solved: new Date().toISOString(),
        times_solved: newTimesSolved // <--- Now this will work
      })
      .eq('user_id', userId)
      .eq('problem_id', problemId);

    if (updateError) throw updateError;

    res.json({ message: 'Progress updated', newBoxLevel });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;