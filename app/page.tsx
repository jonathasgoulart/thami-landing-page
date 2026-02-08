import Hero from "@/components/Hero";
import { getSiteContent, getMessages } from "@/lib/db";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { MessageBoard } from "@/components/MessageBoard";

export const revalidate = 0; // Disable cache for Phase 1 (Local JSON) to see instant updates

export default async function Home() {
  console.log('🚀 RENDERING HOME PAGE...');
  const content = await getSiteContent();
  console.log('✅ Content fetched:', content ? 'Found' : 'Null');
  const messages = await getMessages();

  return (
    <main className="min-h-screen text-foreground selection:bg-primary selection:text-white relative z-10">

      {/* Hero Section (Connected to DB) */}
      <Hero content={content.hero} />

      {/* Story Section */}
      <section className="py-12 md:py-24 container mx-auto px-4 relative z-10">
        <div className="max-w-prose mx-auto text-center space-y-8 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-serif text-primary tracking-wide">{content.story.title}</h2>

          <div
            className="text-lg md:text-xl font-serif leading-relaxed text-foreground/80 space-y-4"
            dangerouslySetInnerHTML={{ __html: content.story.body }}
          />

          <p className="text-accent font-medium tracking-widest pt-8 uppercase text-sm">
            {content.story.signature}
          </p>
        </div>
      </section>

      {/* Gallery Section - Carousel */}
      <Gallery images={content.gallery} />

      {/* Contact & Message Board Section (Unified) */}
      <MessageBoard messages={messages} contact={content.contact} />

      {/* Footer (Simple) */}
      <Footer contact={content.contact} />
    </main>
  );
}
