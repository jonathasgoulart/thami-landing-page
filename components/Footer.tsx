import { Instagram, Youtube, Twitter, Music2 } from "lucide-react";
import Link from "next/link";

export function Footer({ contact }: { contact: any }) {
    // Helper to check if link exists
    const hasLink = (url?: string) => url && url.length > 5;

    return (
        <footer className="py-12 bg-black relative z-10 border-t border-white/10">
            <div className="container mx-auto px-4 text-center">

                {/* Icons Grid */}
                <div className="flex justify-center gap-8 mb-8">
                    {hasLink(contact?.spotify) && (
                        <Link href={contact.spotify} target="_blank" className="text-white/40 hover:text-[#1DB954] transition-colors" title="Spotify">
                            <Music2 className="w-6 h-6" />
                        </Link>
                    )}

                    {hasLink(contact?.instagram) && (
                        <Link href={contact.instagram} target="_blank" className="text-white/40 hover:text-[#E4405F] transition-colors" title="Instagram">
                            <Instagram className="w-6 h-6" />
                        </Link>
                    )}

                    {hasLink(contact?.youtube) && (
                        <Link href={contact.youtube} target="_blank" className="text-white/40 hover:text-[#FF0000] transition-colors" title="YouTube">
                            <Youtube className="w-6 h-6" />
                        </Link>
                    )}

                    {hasLink(contact?.twitter) && (
                        <Link href={contact.twitter} target="_blank" className="text-white/40 hover:text-white transition-colors" title="X / Twitter">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </Link>
                    )}

                    {hasLink(contact?.tiktok) && (
                        <Link href={contact.tiktok} target="_blank" className="text-white/40 hover:text-[#00F2EA] transition-colors" title="TikTok">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.55-1.1-.17-.15-.47-.42-1-.87v7.65c0 2.25-1.11 4.28-2.98 5.4-2.14 1.28-4.9.98-6.73-.72-1.35-1.27-1.89-3.26-1.39-5.07.72-2.58 3.2-4.18 5.8-3.76v4.05c-1.18-.32-2.45.32-2.91 1.46-.35.85-.05 1.86.68 2.4.98.74 2.46.54 3.2-.4.49-.63.74-1.43.71-2.22V.02h.47z" /></svg>
                        </Link>
                    )}
                </div>

                {/* Copyright */}
                <div className="text-xs text-white/20">
                    <p>&copy; 2026 THAMI. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
