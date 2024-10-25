import Expense from "@/model/Expense.js";

export async function GET() {
  console.log(process.env.MOONGOOSE_URI);
  const expenses = await Expense.find();
  console.log(expenses);
  return new Response(
    JSON.stringify({ message: "API is working!", expenses }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
