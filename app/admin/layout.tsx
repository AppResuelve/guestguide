import { dmSans } from '@/app/fonts';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${dmSans.variable} font-admin`}>{children}</div>;
}
