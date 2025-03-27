import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { cleanup } from "@solidjs/testing-library";
import { mockServer } from "./mockServer";

beforeAll(() => {
  window.scrollTo = vi.fn();
  mockServer.listen();
});

beforeEach(() => {
  mockServer.resetHandlers();
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  mockServer.close();
});
