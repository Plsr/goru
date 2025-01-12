"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createGoal } from "@/app/protected/notes/actions";

export function AddGoalModal({ open }: { open: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onClose() {
    router.back();
  }

  async function onSubmit(formData: FormData) {
    startTransition(async () => {
      await createGoal(formData);
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>
        <form action={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Goal</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your goal"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
