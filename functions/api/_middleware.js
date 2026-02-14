export async function onRequest(context) {
  const { request, env, next } = context;
  const method = request.method;

  if (method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const url = new URL(request.url);
  const isPublicPost = method === "POST" && url.pathname === "/api/orders";
  const isPublicInvoice = method === "GET" && url.pathname.startsWith("/api/invoice/");

  if (!isPublicPost && !isPublicInvoice && method !== "OPTIONS") {
    const token = env.ADMIN_TOKEN;
    if (token) {
      const auth = request.headers.get("Authorization");
      if (auth !== `Bearer ${token}`) {
        return new Response(JSON.stringify({ error: "Nicht autorisiert" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  }

  const response = await next();
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  return newResponse;
}
