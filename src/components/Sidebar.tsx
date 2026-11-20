import { Package, Receipt, Settings, ShoppingCart, Sun, TrendingUp, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';
import type { PageId } from '../types';

interface SidebarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
}

const NAV_ITEMS: { id: PageId; label: string; icon: ReactNode }[] = [
  { id: 'today', label: 'Today', icon: <Sun size={20} /> },
  { id: 'sell', label: 'Sell', icon: <ShoppingCart size={20} /> },
  { id: 'stock', label: 'Stock', icon: <Package size={20} /> },
  { id: 'expenses', label: 'Expenses', icon: <Receipt size={20} /> },
  { id: 'utang', label: 'Utang', icon: <Wallet size={20} /> },
  { id: 'reports', label: 'Reports', icon: <TrendingUp size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export default function Sidebar({ current, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-name">Suki</span>
        <span className="brand-tagline">Negosyo Manager</span>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-button ${current === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-current={current === item.id ? 'page' : undefined}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}