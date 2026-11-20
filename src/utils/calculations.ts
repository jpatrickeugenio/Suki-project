import type { Customer, CustomerPayment, Expense, Product, Sale } from '../types';

export const RESTOCK_CATEGORY = 'Product restocking';

export function sumSales(sales: Sale[]): number {
  return sales.reduce((total, sale) => total + sale.total, 0);
}

export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((total, e) => total + e.amount, 0);
}

// Sales minus the cost of the items sold.
export function grossProfit(sales: Sale[]): number {
  let profit = 0;
  for (const sale of sales) {
    for (const item of sale.items) {
      profit += (item.unitPrice - item.unitCost) * item.quantity;
    }
  }
  return profit;
}

// Estimated profit = (sales - cost of items sold) - operating expenses.
// "Product restocking" is NOT subtracted, because the cost of the items
// sold is already counted. Subtracting it too would count it twice.
export function estimatedProfit(sales: Sale[], expenses: Expense[]): number {
  const operatingExpenses = expenses.filter((e) => e.category !== RESTOCK_CATEGORY);
  return grossProfit(sales) - sumExpenses(operatingExpenses);
}

export function isLowStock(product: Product): boolean {
  return product.stock <= product.minStock;
}

// How much one customer still owes.
export function customerBalance(
  customerId: string,
  sales: Sale[],
  payments: CustomerPayment[],
): number {
  const owed = sales
    .filter((s) => s.paymentMethod === 'utang' && s.customerId === customerId)
    .reduce((total, s) => total + s.total, 0);
  const paid = payments
    .filter((p) => p.customerId === customerId)
    .reduce((total, p) => total + p.amount, 0);
  return Math.max(0, owed - paid);
}

export function totalOutstandingDebt(
  customers: Customer[],
  sales: Sale[],
  payments: CustomerPayment[],
): number {
  return customers.reduce(
    (total, c) => total + customerBalance(c.id, sales, payments),
    0,
  );
}