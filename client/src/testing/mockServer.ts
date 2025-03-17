import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const handlers = [
  http.delete("http://localhost:3001/recipes/:id", () => {
    return HttpResponse.json(
      { message: "Recipe successfully deleted." },
      { status: 200 },
    );
  }),
];

export const mockServer = setupServer(...handlers);
