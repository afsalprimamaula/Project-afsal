import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PortalLayout from '@/components/portal/PortalLayout';
import { ToastContainer } from '@/components/portal/Toast';
import SopChatbotWidget from '@/components/widgets/SopChatbotWidget';

export const metadata = {
  title: 'Panel Admin Pengurus — Kopma Unpas',
};

export default async function PengurusLayout({ children }: { children: React.ReactNode }) {
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

  if (!profile || profile.role !== 'pengurus') redirect('/anggota');

  return (
    <>
      <PortalLayout profile={profile}>{children}</PortalLayout>
      <ToastContainer />
      <SopChatbotWidget />
    </>
  );
}
