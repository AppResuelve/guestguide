import { isAuthenticated } from '@/lib/auth';
import { getContacts, getCategories, getTheme } from '@/lib/global-config';
import LoginForm from '@/components/LoginForm';
import AdminShell from '@/components/AdminShell';

export default async function AdminPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    return <LoginForm />;
  }

  const [contacts, categories, theme] = await Promise.all([
    getContacts(),
    getCategories(),
    getTheme(),
  ]);

  return (
    <AdminShell
      initialContacts={contacts}
      initialCategories={categories}
      initialTheme={theme}
    />
  );
}
