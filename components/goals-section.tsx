import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import Link from "next/link";
import { AddGoalModal } from "./modals/add-goal-modal";
import { useSearchParams } from "next/navigation";
import { getGoals } from "@/app/protected/notes/actions";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Medal } from "lucide-react";

export async function GoalsSection() {
  const goals = await getGoals();

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Medal className="w-4 h-4 mr-2" />
          Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {goals?.map((goal) => (
            <div
              key={goal.id}
              className="flex items-center gap-2  text-muted-foreground"
            >
              <span className="truncate">{goal.name}</span>
            </div>
          ))}
          {!goals?.length && (
            <p className="text-sm text-muted-foreground">No goals set yet</p>
          )}
        </div>
        <Link href="?modal=add-goal" className="block mt-8">
          <Button variant="outline" size="sm" className="w-full">
            Add Goal
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
