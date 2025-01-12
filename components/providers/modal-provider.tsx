"use client";

import { AddGoalModal } from "@/components/modals/add-goal-modal";
import { useSearchParams } from "next/navigation";

export function ModalProvider() {
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");

  return (
    <>
      <AddGoalModal open={modal === "add-goal"} />
    </>
  );
}
