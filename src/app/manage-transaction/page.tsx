"use client";

import { useState, JSX } from "react";
import {
  Home,
  Utensils,
  Car,
  Film,
  ShoppingBag,
  Heart,
  Zap,
  FileText,
  Briefcase,
  Laptop,
  Building2,
  TrendingUp,
  Gift,
  DollarSign,
  TrendingDown,
  Check,
} from "lucide-react";

interface TransactionFormData {
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: Date;
}

interface CategoryItem {
  id: string;
  name: string;
  icon: JSX.Element;
}

const EXPENSE_CATEGORIES: CategoryItem[] = [
  { id: "housing", name: "Housing", icon: <Home size={24} /> },
  { id: "food", name: "Food & Dining", icon: <Utensils size={24} /> },
  { id: "transportation", name: "Transportation", icon: <Car size={24} /> },
  { id: "entertainment", name: "Entertainment", icon: <Film size={24} /> },
  { id: "shopping", name: "Shopping", icon: <ShoppingBag size={24} /> },
  { id: "health", name: "Health & Fitness", icon: <Heart size={24} /> },
  { id: "utilities", name: "Utilities", icon: <Zap size={24} /> },
  { id: "other", name: "Other", icon: <FileText size={24} /> },
];

const INCOME_CATEGORIES: CategoryItem[] = [
  { id: "salary", name: "Salary", icon: <Briefcase size={24} /> },
  { id: "freelance", name: "Freelance", icon: <Laptop size={24} /> },
  { id: "business", name: "Business", icon: <Building2 size={24} /> },
  { id: "investment", name: "Investment", icon: <TrendingUp size={24} /> },
  { id: "gift", name: "Gift", icon: <Gift size={24} /> },
  { id: "other", name: "Other", icon: <DollarSign size={24} /> },
];

export default function AddTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    amount: 0,
    description: "",
    category: "food",
    date: new Date(),
  });

  const categories =
    formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: "income" | "expense") => {
    const defaultCategory = type === "expense" ? "food" : "salary";
    setFormData({ ...formData, type, category: defaultCategory });
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl flex items-center justify-center mb-6 mx-auto">
            <Check className="text-white" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Transaction Added!
          </h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Add Transaction
            </h1>
            <p className="text-gray-600 text-lg">
              Track your income and expenses
            </p>
          </div>
        </div>

        <div onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Transaction Type
            </h3>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleTypeChange("expense")}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
                  formData.type === "expense"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <div className="flex flex-col items-center">
                  <TrendingDown size={32} className="mb-2" />
                  <span>Expense</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("income")}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
                  formData.type === "income"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <div className="flex flex-col items-center">
                  <TrendingUp size={32} className="mb-2" />
                  <span>Income</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
            <label className="block text-xl font-semibold text-gray-900 mb-6">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl font-semibold">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full pl-14 pr-6 py-4 text-3xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
            <label className="block text-xl font-semibold text-gray-900 mb-6">
              Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, category: category.id })
                  }
                  className={`p-4 rounded-2xl text-center transition-all duration-200 ${
                    formData.category === category.id
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
            <label className="block text-xl font-semibold text-gray-900 mb-6">
              Description
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-6 py-4 text-lg text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              placeholder="What was this for?"
            />
            <div className="text-right text-sm text-gray-500 mt-2">
              {formData.description.length}/100
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
            <label className="block text-xl font-semibold text-gray-900 mb-6">
              Date
            </label>
            <input
              type="date"
              required
              value={formatDateForInput(formData.date)}
              onChange={(e) =>
                setFormData({ ...formData, date: new Date(e.target.value) })
              }
              className="w-full px-6 py-4 text-lg text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || formData.amount <= 0}
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 ${
              loading || formData.amount <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : formData.type === "expense"
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Adding Transaction...
              </div>
            ) : (
              `Add ${formData.type === "expense" ? "Expense" : "Income"}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
