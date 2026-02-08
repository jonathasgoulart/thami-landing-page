export function Watermark({ url }: { url?: string }) {
    if (!url) return null;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.3]">
            <div
                className="w-full h-full bg-no-repeat bg-center bg-cover"
                style={{ backgroundImage: `url(${url})` }}
            />
        </div>
    );
}
