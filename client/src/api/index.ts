import { ClientResponse, hc } from "hono/client";
import { type ApiRoutes } from "@server/src";

const API_URL = "http://localhost:3000";
export const api = hc<ApiRoutes>(API_URL).api;

export const callRPC = async <T>(
  rpc: Promise<ClientResponse<T>>,
): Promise<T> => {
  const res = await rpc;
  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(errorMessage);
  }

  return res.json() as T;
};
