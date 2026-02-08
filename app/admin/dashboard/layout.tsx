import { Sidebar } from '@/components/admin/Sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Simple protection
    // Next.js 15: cookies() is async
    const session = (await cookies()).get('admin_session');

    if (!session) {
        redirect('/admin');
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
