import { isAuthenticated } from '@/lib/auth';
import { getItems, getCategories, getTheme, getConfig } from '@/lib/global-config';
import LoginForm from '@/components/LoginForm';
import AdminShell from '@/components/AdminShell';

export default async function AdminPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    return <LoginForm />;
  }

  const [items, categories, theme, config] = await Promise.all([
    getItems(),
    getCategories(),
    getTheme(),
    getConfig(),
  ]);

  return (
    <AdminShell
      initialItems={items}
      initialCategories={categories}
      initialTheme={theme}
      initialConfig={config}
    />
  );
}
