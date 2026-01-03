"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const goals = [
  { id: 'light', title: 'Light', count: 2, color: 'text-green-500', desc: 'Consistency is key. 15-20 mins.' },
  { id: 'standard', title: 'Standard', count: 4, color: 'text-blue-500', desc: 'The daily grind. 45-60 mins.' },
  { id: 'deep', title: 'Deep Dive', count: 7, color: 'text-purple-500', desc: 'Mastery mode. 2+ hours.' },
];

export default function DailyGoal({ onSelect }: { onSelect: (count: number) => void }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight">Ready to code today?</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className={goal.color}>{goal.title}</CardTitle>
              <CardDescription>{goal.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">{goal.count} Problems</div>
              <Button onClick={() => onSelect(goal.count)} className="w-full">
                Start Session
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}