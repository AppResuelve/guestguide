import { isAuthenticated } from '@/lib/auth';
import { getContacts, getTheme } from '@/lib/edge-config';
import LoginForm from '@/components/LoginForm';
import AdminDashboard from '@/components/AdminDashboard';

export default async function AdminPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    return <LoginForm />;
  }

  const [contacts, theme] = await Promise.all([getContacts(), getTheme()]);

  return <AdminDashboard initialContacts={contacts} initialTheme={theme} />;
}
