export async function onRequestGet(context) {
  try {
    // context.env.DB is bound to your D1 database via wrangler.toml
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM items"
    ).all();

    return new Response(JSON.stringify({ items: results }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
