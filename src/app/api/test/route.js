export async function GET() {
  console.log(process.env.MOONGOOSE_URI);
  return new Response(JSON.stringify({ message: "API is working!" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
