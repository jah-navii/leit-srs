"use client";

import { Badge } from "@/components/ui/badge"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react" 

export default function ProblemCard({ problem, onReview }: { problem: any, onReview: (status: string) => void }) {

  if(!problem) return null;

  return (
    <Card className="max-w-xl mx-auto mt-10 shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant={problem.difficulty === 'Hard' ? 'destructive' : 'secondary'}>
            {problem.difficulty}
          </Badge>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{problem.pattern}</span>
        </div>
        <CardTitle className="text-2xl pt-4">{problem.title}</CardTitle>
      </CardHeader>
      
      <CardFooter className="flex flex-col space-y-4">
        <Button variant="outline" className="w-full gap-2" asChild>
          <a href={problem.url} target="_blank" rel="noreferrer">
            Solve on LeetCode <ExternalLink size={16} />
          </a>
        </Button>
        
        <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t">
          <Button variant="ghost" onClick={() => onReview('failed')} className="text-red-500 hover:bg-red-50">Failed</Button>
          <Button variant="ghost" onClick={() => onReview('struggled')} className="text-yellow-500 hover:bg-yellow-50">Struggled</Button>
          <Button variant="ghost" onClick={() => onReview('easy')} className="text-green-500 hover:bg-green-50">Crushed it</Button>
        </div>
      </CardFooter>
    </Card>
  )
}