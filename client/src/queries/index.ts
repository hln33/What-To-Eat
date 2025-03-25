import { createQuery } from "@tanstack/solid-query";
import { getUserSession } from "@/features/users/api";

export const createSessionQuery = () =>
  createQuery(() => ({
    queryKey: ["sessionExists"],
    queryFn: getUserSession,
  }));
