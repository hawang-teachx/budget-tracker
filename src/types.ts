export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: "income" | "expense";
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  type: "income" | "expense";
}

export type TransactionFormData = Omit<Transaction, "id">;
