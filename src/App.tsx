import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Placeholder from './pages/Placeholder';
import Today from './pages/Today';
import type { PageId } from './types';
import { formatLongDate } from './utils/format';

const PAGE_TITLES: Record<PageId, string> = {
  today: 'Today',
  sell: 'Sell',
  stock: 'Stock',
  expenses: 'Expenses',
  utang: 'Utang',
  reports: 'Reports',
  settings: 'Settings',
};

// Reads the page from the address bar (e.g. #stock) so a refresh keeps your place.
function readPageFromHash(): PageId {
  const hash = window.location.hash.replace('#', '');
  return hash in PAGE_TITLES ? (hash as PageId) : 'today';
}

export default function App() {
  const [page, setPage] = useState<PageId>(readPageFromHash);

  useEffect(() => {
    const onHashChange = () => setPage(readPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (next: PageId) => {
    window.location.hash = next;
    setPage(next);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (page) {
      case 'today':
        return <Today onNavigate={navigate} />;
      case 'sell':
        return (
          <Placeholder
            title="Sell"
            stage={3}
            description="Record product sales and automatically reduce stock."
          />
        );
      case 'stock':
        return (
          <Placeholder
            title="Stock"
            stage={2}
            description="Add, edit, and track your products and inventory."
          />
        );
      case 'expenses':
        return (
          <Placeholder
            title="Expenses"
            stage={4}
            description="Record electricity, rent, transportation, and other expenses."
          />
        );
      case 'utang':
        return (
          <Placeholder
            title="Utang"
            stage={5}
            description="Track customers who owe you and their payments."
          />
        );
      case 'reports':
        return (
          <Placeholder
            title="Reports"
            stage={6}
            description="See your sales, expenses, and profit over time."
          />
        );
      case 'settings':
        return (
          <Placeholder
            title="Settings"
            stage={7}
            description="Manage your business name and app settings."
          />
        );
    }
  };

  return (
    <div className="app">
      <Sidebar current={page} onNavigate={navigate} />
      <main className="main">
        <header className="topbar">
          <h1>{PAGE_TITLES[page]}</h1>
          <p className="date">{formatLongDate(new Date())}</p>
        </header>
        {renderPage()}
      </main>
    </div>
  );
}