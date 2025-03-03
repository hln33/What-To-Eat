import { hc } from "hono/client";
import { AppType } from "../../../server/src";

const API_URL = "http://localhost:3001";

export const api = hc<AppType>(API_URL);
