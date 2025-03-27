import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const handlers = [
  http.delete("http://localhost:3001/recipes/:id", () => {
    return HttpResponse.json(
      { message: "Recipe successfully deleted." },
      { status: 200 },
    );
  }),
  http.get("http://localhost:3001/users/session", () => {
    return HttpResponse.json({
      message: "Session exists.",
      userId: 1,
      username: "testuser",
    });
  }),
  http.post("http://localhost:3001/users/login", async ({ request }) => {
    const userInfo = await request.formData();

    return HttpResponse.json({
      message: "Login successful.",
      userId: 1,
      username: userInfo.get("username"),
    });
  }),
];

export const mockServer = setupServer(...handlers);
