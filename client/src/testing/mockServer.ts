import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const MOCK_SERVER_ORIGIN = "http://localhost:3000/api";

const handlers = [
  http.delete(`${MOCK_SERVER_ORIGIN}/recipes/:id`, () => {
    return HttpResponse.json(
      { message: "Recipe successfully deleted." },
      { status: 200 },
    );
  }),
  http.get(`${MOCK_SERVER_ORIGIN}/users/session`, () => {
    return HttpResponse.json({
      message: "Session exists.",
      userId: 1,
      username: "testuser",
    });
  }),
  http.post(`${MOCK_SERVER_ORIGIN}/users/login`, async ({ request }) => {
    const userInfo = await request.formData();

    return HttpResponse.json({
      message: "Login successful.",
      userId: 1,
      username: userInfo.get("username"),
    });
  }),
];

export const mockServer = setupServer(...handlers);
