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

// Mock data templates
const incomeCategories = [
  {
    category: "salary",
    descriptions: [
      "Monthly Salary",
      "Bi-weekly Paycheck",
      "Annual Bonus",
      "Overtime Pay",
    ],
  },
  {
    category: "freelance",
    descriptions: [
      "Freelance Project",
      "Consulting Work",
      "Side Project",
      "Contract Work",
    ],
  },
  {
    category: "investments",
    descriptions: [
      "Stock Dividends",
      "Rental Income",
      "Investment Returns",
      "Interest Earned",
    ],
  },
  {
    category: "business",
    descriptions: [
      "Business Revenue",
      "Client Payment",
      "Product Sales",
      "Service Income",
    ],
  },
  {
    category: "other",
    descriptions: ["Gift Money", "Refund", "Cashback", "Prize Money"],
  },
];

const expenseCategories = [
  {
    category: "housing",
    descriptions: [
      "Rent Payment",
      "Mortgage Payment",
      "Property Tax",
      "Home Insurance",
      "Utilities",
    ],
  },
  {
    category: "food",
    descriptions: [
      "Grocery Shopping",
      "Restaurant Dinner",
      "Coffee Shop",
      "Lunch",
      "Food Delivery",
    ],
  },
  {
    category: "transportation",
    descriptions: [
      "Gas Station",
      "Public Transit",
      "Uber Ride",
      "Car Maintenance",
      "Parking Fee",
    ],
  },
  {
    category: "entertainment",
    descriptions: [
      "Movie Tickets",
      "Streaming Subscriptions",
      "Concert Tickets",
      "Gaming",
      "Books",
    ],
  },
  {
    category: "utilities",
    descriptions: [
      "Electricity Bill",
      "Water Bill",
      "Internet Bill",
      "Phone Bill",
      "Gas Bill",
    ],
  },
  {
    category: "healthcare",
    descriptions: [
      "Doctor Visit",
      "Pharmacy",
      "Dental Checkup",
      "Health Insurance",
      "Medical Supplies",
    ],
  },
  {
    category: "shopping",
    descriptions: [
      "Clothing",
      "Electronics",
      "Home Goods",
      "Personal Care",
      "Gifts",
    ],
  },
  {
    category: "education",
    descriptions: [
      "Course Fee",
      "Books",
      "Online Learning",
      "Workshop",
      "Certification",
    ],
  },
  {
    category: "travel",
    descriptions: [
      "Flight Tickets",
      "Hotel Booking",
      "Travel Insurance",
      "Vacation Expenses",
      "Business Trip",
    ],
  },
  {
    category: "subscriptions",
    descriptions: [
      "Software Subscription",
      "Gym Membership",
      "Magazine Subscription",
      "Cloud Storage",
    ],
  },
];

// Helper function to get random item from array
const getRandomItem = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

// Helper function to generate random date within last 6 months
const getRandomDate = (): Date => {
  const now = new Date();
  const sixMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 6,
    now.getDate()
  );
  const randomTime =
    sixMonthsAgo.getTime() +
    Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  return new Date(randomTime);
};

// Helper function to generate random amount based on type and category
const getRandomAmount = (
  type: "income" | "expense",
  category: string
): number => {
  if (type === "income") {
    switch (category) {
      case "salary":
        return Math.round((Math.random() * 3000 + 2000) * 100) / 100; // $2000-$5000
      case "freelance":
        return Math.round((Math.random() * 1500 + 300) * 100) / 100; // $300-$1800
      case "investments":
        return Math.round((Math.random() * 800 + 50) * 100) / 100; // $50-$850
      case "business":
        return Math.round((Math.random() * 2000 + 500) * 100) / 100; // $500-$2500
      default:
        return Math.round((Math.random() * 500 + 50) * 100) / 100; // $50-$550
    }
  } else {
    switch (category) {
      case "housing":
        return Math.round((Math.random() * 1500 + 500) * 100) / 100; // $500-$2000
      case "food":
        return Math.round((Math.random() * 150 + 10) * 100) / 100; // $10-$160
      case "transportation":
        return Math.round((Math.random() * 100 + 15) * 100) / 100; // $15-$115
      case "entertainment":
        return Math.round((Math.random() * 200 + 10) * 100) / 100; // $10-$210
      case "utilities":
        return Math.round((Math.random() * 200 + 50) * 100) / 100; // $50-$250
      case "healthcare":
        return Math.round((Math.random() * 300 + 25) * 100) / 100; // $25-$325
      case "shopping":
        return Math.round((Math.random() * 400 + 20) * 100) / 100; // $20-$420
      case "travel":
        return Math.round((Math.random() * 1000 + 200) * 100) / 100; // $200-$1200
      default:
        return Math.round((Math.random() * 150 + 10) * 100) / 100; // $10-$160
    }
  }
};

// Function to generate a single random transaction
const generateRandomTransaction = (id: string): Transaction => {
  const isIncome = Math.random() < 0.3; // 30% chance for income, 70% for expense
  const categoryData = isIncome
    ? getRandomItem(incomeCategories)
    : getRandomItem(expenseCategories);

  const description = getRandomItem(categoryData.descriptions);
  const amount = getRandomAmount(
    isIncome ? "income" : "expense",
    categoryData.category
  );

  return {
    id,
    amount,
    description,
    category: categoryData.category,
    date: getRandomDate(),
    type: isIncome ? "income" : "expense",
  };
};

// Function to generate multiple transactions
const generateMockTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];

  for (let i = 1; i <= count; i++) {
    transactions.push(generateRandomTransaction(i.toString()));
  }

  // Sort by date (newest first)
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Generate 200 mock transactions on server start
const transactions: Transaction[] = generateMockTransactions(200);

console.log(`Generated ${transactions.length} mock transactions`);

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
