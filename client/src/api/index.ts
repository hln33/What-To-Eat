import { ClientResponse, hc } from "hono/client";
import { AppType } from "../../../server/src";

const API_URL = "http://localhost:3001";
export const api = hc<AppType>(API_URL);

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
