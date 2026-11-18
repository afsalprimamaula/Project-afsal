import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PortalLayout from '@/components/portal/PortalLayout';
import { ToastContainer } from '@/components/portal/Toast';
import SopChatbotWidget from '@/components/widgets/SopChatbotWidget';

export const metadata = {
  title: 'Portal Anggota — Kopma Unpas',
};

export default async function AnggotaLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/');

  return (
    <>
      <PortalLayout profile={profile}>{children}</PortalLayout>
      <ToastContainer />
      <SopChatbotWidget />
    </>
  );
}
