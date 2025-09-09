// app/api/transactions/route.ts
import { NextRequest, NextResponse } from "next/server";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: "income" | "expense";
}

export type TransactionFormData = Omit<Transaction, "id">;

// In-memory storage for transactions
const transactions: Transaction[] = [
  {
    id: "1",
    amount: 2500.0,
    description: "Monthly Salary",
    category: "salary",
    date: new Date("2024-08-01"),
    type: "income",
  },
  {
    id: "2",
    amount: 850.0,
    description: "Rent Payment",
    category: "housing",
    date: new Date("2024-08-01"),
    type: "expense",
  },
  {
    id: "3",
    amount: 120.5,
    description: "Grocery Shopping",
    category: "food",
    date: new Date("2024-08-02"),
    type: "expense",
  },
  {
    id: "4",
    amount: 500.0,
    description: "Freelance Project",
    category: "freelance",
    date: new Date("2024-08-03"),
    type: "income",
  },
  {
    id: "5",
    amount: 45.0,
    description: "Gas Station",
    category: "transportation",
    date: new Date("2024-08-04"),
    type: "expense",
  },
  {
    id: "6",
    amount: 89.99,
    description: "Streaming Subscriptions",
    category: "entertainment",
    date: new Date("2024-08-05"),
    type: "expense",
  },
];

// GET /api/transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as "income" | "expense" | null;
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");

    let filteredTransactions = [...transactions];

    // Filter by type if specified
    if (type) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.type === type
      );
    }

    // Filter by category if specified
    if (category) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.category === category
      );
    }

    // Limit results if specified
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredTransactions = filteredTransactions.slice(0, limitNum);
      }
    }

    // Sort by date (newest first)
    filteredTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({
      success: true,
      data: filteredTransactions,
      total: filteredTransactions.length,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST /api/transactions
export async function POST(request: NextRequest) {
  try {
    const body: TransactionFormData = await request.json();

    // Validate required fields
    if (
      !body.amount ||
      !body.description ||
      !body.category ||
      !body.date ||
      !body.type
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate type
    if (!["income", "expense"].includes(body.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid transaction type. Must be "income" or "expense"',
        },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof body.amount !== "number" || body.amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Create new transaction with generated ID
    const newTransaction: Transaction = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: body.amount,
      description: body.description,
      category: body.category,
      date: new Date(body.date),
      type: body.type,
    };

    // Add to in-memory storage
    transactions.push(newTransaction);

    return NextResponse.json(
      {
        success: true,
        message: "Transaction created successfully",
        data: newTransaction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
