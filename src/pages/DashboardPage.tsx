import { useAuth } from '../context/AuthContext';

export function DashboardPage() {
  const { logout } = useAuth();

  return (
    <main className="min-h-screen bg-bg text-text flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold mb-4">Dashboard</h1>
        <p className="font-body text-sm text-text/50 mb-8">
          You're logged in. Real dashboard content coming in a later task.
        </p>
        <button
          onClick={logout}
          className="bg-surface text-text font-body text-sm rounded-lg px-6 py-3 border border-text/10 hover:border-forge transition-colors"
        >
          Log out
        </button>
      </div>
    </main>
  );
}