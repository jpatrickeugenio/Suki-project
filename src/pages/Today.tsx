import {
  AlertTriangle,
  Banknote,
  ListChecks,
  PackagePlus,
  PiggyBank,
  Plus,
  Receipt,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import type {
  Customer,
  CustomerPayment,
  Expense,
  PageId,
  Product,
  Sale,
} from '../types';
import {
  estimatedProfit,
  isLowStock,
  sumExpenses,
  sumSales,
  totalOutstandingDebt,
} from '../utils/calculations';
import { formatPeso, formatTime, isToday } from '../utils/format';
import { STORAGE_KEYS, useLocalStorage } from '../utils/storage';

interface TodayProps {
  onNavigate: (page: PageId) => void;
}

export default function Today({ onNavigate }: TodayProps) {
  // Everything below comes from saved records. Nothing is hardcoded.
  const [products] = useLocalStorage<Product[]>(STORAGE_KEYS.products, []);
  const [sales] = useLocalStorage<Sale[]>(STORAGE_KEYS.sales, []);
  const [expenses] = useLocalStorage<Expense[]>(STORAGE_KEYS.expenses, []);
  const [customers] = useLocalStorage<Customer[]>(STORAGE_KEYS.customers, []);
  const [payments] = useLocalStorage<CustomerPayment[]>(STORAGE_KEYS.payments, []);

  const todaySales = sales.filter((s) => isToday(s.createdAt));
  const todayExpenses = expenses.filter((e) => isToday(e.date));
  const lowStock = products.filter(isLowStock);

  const profit = estimatedProfit(todaySales, todayExpenses);
  const debt = totalOutstandingDebt(customers, sales, payments);

  const recentSales = [...todaySales]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
  const recentExpenses = [...todayExpenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <>
      <div className="quick-actions">
        <button type="button" className="btn btn-primary" onClick={() => onNavigate('sell')}>
          <Plus size={18} /> Record a Sale
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => onNavigate('stock')}>
          <PackagePlus size={18} /> Add a Product
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => onNavigate('expenses')}>
          <Receipt size={18} /> Record an Expense
        </button>
      </div>

      <section className="summary-grid">
        <SummaryCard
          label="Today's Sales"
          value={formatPeso(sumSales(todaySales))}
          icon={<Banknote size={22} />}
          tone="positive"
          hint="Includes sales on utang"
        />
        <SummaryCard
          label="Today's Expenses"
          value={formatPeso(sumExpenses(todayExpenses))}
          icon={<TrendingDown size={22} />}
        />
        <SummaryCard
          label="Estimated Profit"
          value={formatPeso(profit)}
          icon={<PiggyBank size={22} />}
          tone={profit >= 0 ? 'positive' : 'danger'}
          hint="Sales minus item cost and expenses"
        />
        <SummaryCard
          label="Transactions"
          value={String(todaySales.length)}
          icon={<ListChecks size={22} />}
        />
        <SummaryCard
          label="Unpaid Utang"
          value={formatPeso(debt)}
          icon={<Wallet size={22} />}
          tone={debt > 0 ? 'danger' : 'default'}
        />
        <SummaryCard
          label="Low on Stock"
          value={String(lowStock.length)}
          icon={<AlertTriangle size={22} />}
          tone={lowStock.length > 0 ? 'danger' : 'default'}
          hint="Products"
        />
      </section>

      <section className="two-column">
        <div className="card">
          <h2 className="card-title">Recent Sales</h2>
          {recentSales.length === 0 ? (
            <p className="empty">No sales yet today.</p>
          ) : (
            <ul className="record-list">
              {recentSales.map((sale) => (
                <li key={sale.id}>
                  <div>
                    <strong>{formatTime(sale.createdAt)}</strong>
                    <span className="muted">
                      {' '}
                      - {sale.items.length} item{sale.items.length === 1 ? '' : 's'} -{' '}
                      {sale.paymentMethod === 'utang' ? 'Utang' : 'Cash'}
                    </span>
                  </div>
                  <span className="amount-positive">{formatPeso(sale.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="card-title">Recent Expenses</h2>
          {recentExpenses.length === 0 ? (
            <p className="empty">No expenses recorded today.</p>
          ) : (
            <ul className="record-list">
              {recentExpenses.map((e) => (
                <li key={e.id}>
                  <div>
                    <strong>{e.description}</strong>
                    <span className="muted"> - {e.category}</span>
                  </div>
                  <span>{formatPeso(e.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Low-Stock Alerts</h2>
        {lowStock.length === 0 ? (
          <p className="empty">All products have enough stock.</p>
        ) : (
          <ul className="record-list">
            {lowStock.map((p) => (
              <li key={p.id}>
                <div>
                  <strong>{p.name}</strong>
                  <span className="muted"> - {p.category}</span>
                </div>
                <span className="amount-danger">
                  {p.stock} left (min. {p.minStock})
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}