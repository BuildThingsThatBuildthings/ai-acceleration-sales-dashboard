import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import FeedbackWidget from '@/components/FeedbackWidget';
import { getLeads } from './actions';
import { isToday, isBefore, parseISO, startOfToday } from 'date-fns';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Acceleration Sales',
  description: 'Regional Tour Sales Dashboard',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Calculate follow-up count for sidebar badge
  let followUpCount = 0;
  try {
    const leads = await getLeads();
    const today = startOfToday();
    followUpCount = leads.filter((l) => {
      if (!l.followUpDate) return false;
      try {
        const date = parseISO(l.followUpDate);
        return isToday(date) || isBefore(date, today);
      } catch {
        return false;
      }
    }).length;
  } catch {
    // Ignore errors, show 0
  }

  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} bg-black text-white h-full flex flex-col md:flex-row overflow-hidden`}>
        {/* Mobile Navigation */}
        <MobileNav followUpCount={followUpCount} />

        {/* Desktop Sidebar */}
        <Sidebar followUpCount={followUpCount} />

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 h-full overflow-y-auto relative bg-surface-950">
          <div className="min-h-full p-4 md:p-6 lg:p-8 xl:p-12 pb-24 md:pb-32">
            {children}
          </div>
        </main>

        <FeedbackWidget />
      </body>
    </html>
  );
}
