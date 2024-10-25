export async function GET() {
  console.log(process.env.MOONGOOSE_URI);
  return new Response(
    JSON.stringify({
      message: "API is working!",
      data: process.env.MOONGOOSE_URI,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
