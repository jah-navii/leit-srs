export const calculatePriority = (p: any) => {
  const now = new Date();
  const lastSolved = new Date(p.last_solved);
  const daysSince = Math.max(1, (now.getTime() - lastSolved.getTime()) / (1000 * 3600 * 24));

  const difficultyWeight = { 'Easy': 1, 'Medium': 1.5, 'Hard': 2 }[p.difficulty as 'Easy'|'Medium'|'Hard'] || 1;
  
  // The Leitner Factor: Box 1 = 1, Box 2 = 3, Box 3 = 7, Box 4 = 14
  const boxFactors: Record<number, number> = { 1: 1, 2: 3, 3: 7, 4: 14 };
  const intervalFactor = boxFactors[p.box_level] || 1;

  // Priority Score: Higher means more urgent
  return (daysSince * difficultyWeight) / intervalFactor;
};

export const getDailyQueue = (problems: any[], limit: number) => {
  return problems
    .map(p => ({ ...p, score: calculatePriority(p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};