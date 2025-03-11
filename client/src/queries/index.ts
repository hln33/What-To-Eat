import { createQuery } from "@tanstack/solid-query";
import { checkUserSessionExists } from "@/features/users/api";

export const createSessionExistanceQuery = () =>
  createQuery(() => ({
    queryKey: ["sessionExists"],
    queryFn: checkUserSessionExists,
  }));
