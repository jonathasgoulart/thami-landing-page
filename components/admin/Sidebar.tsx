import Link from 'next/link';
import { LayoutDashboard, Image as ImageIcon, Settings, LogOut } from 'lucide-react';

export function Sidebar() {
    return (
        <aside className="w-64 bg-card border-r border-white/5 flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-serif text-primary">THAMI ADMIN</h2>
                <p className="text-xs text-foreground/50">v2.0 Beta</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-3 px-4 py-3 text-foreground/80 hover:bg-white/5 rounded-md hover:text-primary transition-colors"
                >
                    <LayoutDashboard size={18} />
                    <span>Conteúdo</span>
                </Link>
                <Link
                    href="/admin/dashboard/gallery"
                    className="flex items-center gap-3 px-4 py-3 text-foreground/80 hover:bg-white/5 rounded-md hover:text-primary transition-colors"
                >
                    <ImageIcon size={18} />
                    <span>Galeria</span>
                </Link>
                <Link
                    href="/admin/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-3 text-foreground/80 hover:bg-white/5 rounded-md hover:text-primary transition-colors"
                >
                    <Settings size={18} />
                    <span>Configurações</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-white/5">
                <form action="/admin/dashboard/logout" method="POST">
                    <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-md w-full transition-colors">
                        <LogOut size={18} />
                        <span>Sair</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
