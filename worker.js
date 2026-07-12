export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Intercept API requests
    if (url.pathname === '/api/catalog') {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM items").all();
        return new Response(JSON.stringify({ items: results }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    
    // Otherwise, serve the static React app from the dist/ folder
    return env.ASSETS.fetch(request);
  }
}
