"use client";

import { useState } from "react";
import DailyGoal from "@/components/DailyGoal";
import ProblemCard from "@/components/ProblemCard";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [sessionCount, setSessionCount] = useState<number | null>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const startSession = async (count: number) => {
    setSessionCount(count);
    const response = await fetch(`http://localhost:5000/api/daily-tasks?limit=${count}`, {
      headers: { 'user-id': '00000000-0000-0000-0000-000000000000' } // Temporary manual ID
    });
    const data = await response.json();
    setProblems(data);
  };

  const handleReview = async (performance: string) => {
    const currentProblem = problems[currentIndex];

    // 1. Safety Check: If there's no problem at this index, stop.
    if (!currentProblem) {
      console.error("No problem found at index", currentIndex);
      return;
    }

    // 2. Make the API call
    try {
      await fetch('http://localhost:5000/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '00000000-0000-0000-0000-000000000000',
          problemId: currentProblem.id, // Now safe to access
          performance: performance
        })
      });

      // 3. Move to next index
      setCurrentIndex(prev => prev + 1);

    } catch (err) {
      console.error("Failed to update progress", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {!sessionCount ? (
        <DailyGoal onSelect={startSession} />
      ) : (
        <div className="p-8">
          {/* If problems are still loading */}
          {problems.length === 0 ? (
            <div className="text-center">Loading your daily set...</div>
          ) : currentIndex < problems.length ? (
            <>
              <h2 className="text-center text-sm font-mono mb-4 text-muted-foreground">
                Problem {currentIndex + 1} of {problems.length}
              </h2>
              <ProblemCard 
                problem={problems[currentIndex]} 
                onReview={handleReview} 
              />
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold">Session Complete! 🎉</h2>
              <Button onClick={() => {
                setSessionCount(null);
                setProblems([]);
                setCurrentIndex(0);
              }} className="mt-6">
                Back to Dashboard
              </Button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}