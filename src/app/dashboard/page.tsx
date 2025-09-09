"use client";

import { JSX, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import {
  Utensils,
  Car,
  Zap,
  DollarSign,
  Laptop,
  Gift,
  Film,
  ShoppingBag,
  Heart,
  BookOpen,
  CreditCard,
  BarChart3,
  Hash,
  Tag,
  FileText,
  AlertCircle,
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense";
  date: Date;
}

interface ChartData {
  date: string;
  amount: number;
  count: number;
}

interface APIResponse {
  success: boolean;
  data: Transaction[];
  total: number;
  error?: string;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeTab, setTypeTab] = useState<"income" | "expense">("expense");
  const [viewTab, setViewTab] = useState<"trends" | "transactions">("trends");

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/transaction");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch transactions");
      }

      // Convert date strings back to Date objects
      const transactionsWithDates = result.data.map((transaction) => ({
        ...transaction,
        date: new Date(transaction.date),
      }));

      setTransactions(transactionsWithDates);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t) => t.type === typeTab);

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Prepare line chart data - group by date
  const chartData = (): ChartData[] => {
    const grouped = filteredTransactions.reduce((acc, transaction) => {
      const dateKey = transaction.date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { amount: 0, count: 0 };
      }
      acc[dateKey].amount += transaction.amount;
      acc[dateKey].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    return Object.entries(grouped)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amount: data.amount,
        count: data.count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const totalAmount = filteredTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const getCategoryIcon = (category: string) => {
    const iconProps = { size: 20, className: "text-gray-600" };

    const icons: Record<string, JSX.Element> = {
      food: <Utensils {...iconProps} />,
      transportation: <Car {...iconProps} />,
      utilities: <Zap {...iconProps} />,
      salary: <DollarSign {...iconProps} />,
      freelance: <Laptop {...iconProps} />,
      bonus: <Gift {...iconProps} />,
      entertainment: <Film {...iconProps} />,
      shopping: <ShoppingBag {...iconProps} />,
      health: <Heart {...iconProps} />,
      healthcare: <Heart {...iconProps} />,
      education: <BookOpen {...iconProps} />,
      housing: <CreditCard {...iconProps} />,
      investments: <BarChart3 {...iconProps} />,
      business: <DollarSign {...iconProps} />,
      travel: <Film {...iconProps} />,
      subscriptions: <Film {...iconProps} />,
      default: <CreditCard {...iconProps} />,
    };
    return icons[category] || icons.default;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <DollarSign className="text-white" size={24} />
          </div>
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTransactions}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Budget Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Track your financial journey
              </p>
            </div>
          </div>
        </div>

        {/* Type Tabs - Income/Expense */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white/60 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/20 w-fit">
            <button
              onClick={() => setTypeTab("expense")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                typeTab === "expense"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-red-500 hover:bg-white/50"
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setTypeTab("income")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                typeTab === "income"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-green-500 hover:bg-white/50"
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                {formatCurrency(totalAmount)}
              </h2>
              <p className="text-gray-500 text-lg">
                Total {typeTab} • {filteredTransactions.length} transactions
              </p>
            </div>
            <div
              className={`p-4 rounded-2xl ${
                typeTab === "income"
                  ? "bg-gradient-to-r from-green-400 to-green-500"
                  : "bg-gradient-to-r from-red-400 to-red-500"
              }`}
            >
              <div className="w-8 h-8 text-white font-bold text-2xl flex items-center justify-center">
                {typeTab === "income" ? "↗" : "↙"}
              </div>
            </div>
          </div>
        </div>

        {/* View Tabs - Trends/Transactions */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white/60 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/20 w-fit">
            <button
              onClick={() => setViewTab("trends")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                viewTab === "trends"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-blue-500 hover:bg-white/50"
              }`}
            >
              Trends
            </button>
            <button
              onClick={() => setViewTab("transactions")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                viewTab === "transactions"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-purple-500 hover:bg-white/50"
              }`}
            >
              Transactions
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
          {viewTab === "trends" ? (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {typeTab === "income" ? "Income" : "Expense"} Trends
              </h3>
              {chartData().length > 0 ? (
                <div className="h-96 min-h-[384px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient
                          id={`gradient-${typeTab}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={
                              typeTab === "income" ? "#10B981" : "#EF4444"
                            }
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={
                              typeTab === "income" ? "#10B981" : "#EF4444"
                            }
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        strokeOpacity={0.5}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        dy={10}
                      />
                      <YAxis
                        tickFormatter={(value) => `${value}`}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        dx={-10}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(10px)",
                          border: "none",
                          borderRadius: "16px",
                          boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        }}
                        formatter={(value) => [
                          formatCurrency(value as number),
                          "Amount",
                        ]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke={typeTab === "income" ? "#10B981" : "#EF4444"}
                        strokeWidth={0}
                        fill={`url(#gradient-${typeTab})`}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke={typeTab === "income" ? "#10B981" : "#EF4444"}
                        strokeWidth={4}
                        dot={{
                          r: 6,
                          fill: typeTab === "income" ? "#10B981" : "#EF4444",
                          stroke: "#ffffff",
                          strokeWidth: 3,
                        }}
                        activeDot={{
                          r: 8,
                          fill: typeTab === "income" ? "#10B981" : "#EF4444",
                          stroke: "#ffffff",
                          strokeWidth: 3,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-500 text-lg">No data to display</p>
                  <p className="text-gray-400 text-sm">
                    Add some {typeTab}s to see trends
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Recent {typeTab === "income" ? "Income" : "Expenses"}
              </h3>

              {sortedTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-500 text-lg">No {typeTab}s found</p>
                  <p className="text-gray-400 text-sm">
                    Start adding transactions to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sortedTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/30 hover:shadow-md hover:bg-white/70 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center shadow-sm">
                            {getCategoryIcon(transaction.category)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-base">
                              {transaction.description}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span className="capitalize">
                                {transaction.category}
                              </span>
                              <span>•</span>
                              <span>{formatDate(transaction.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">
                Average per transaction
              </h4>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-blue-600" size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(
                filteredTransactions.length > 0
                  ? totalAmount / filteredTransactions.length
                  : 0
              )}
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">
                Total transactions
              </h4>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Hash className="text-purple-600" size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {filteredTransactions.length}
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">Categories</h4>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Tag className="text-orange-600" size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(filteredTransactions.map((t) => t.category)).size}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
