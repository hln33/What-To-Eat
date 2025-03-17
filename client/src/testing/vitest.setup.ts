import { afterAll, beforeAll } from "vitest";
import { mockServer } from "./mockServer";
import { beforeEach } from "node:test";

beforeAll(() => {
  mockServer.listen();
});

beforeEach(() => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});
