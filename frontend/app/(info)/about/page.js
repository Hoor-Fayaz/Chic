export const revalidate = 60;
import { fetchPage } from "@/lib/cms";
import PageContent from "@/components/ui/PageContent";
import { Sparkles, Heart, Star, Users } from "lucide-react";

export async function generateMetadata() {
  try {
    const res = await fetchPage("about");
    const page = res?.data;
    return {
      title: `${page?.title || "Our Story"} | Jannah Chic`,
      description: page?.content?.substring(0, 160) || "Discover the heritage and philosophy of Jannah Chic.",
    };
  } catch (e) {
    return { title: "Our Story | Jannah Chic" };
  }
}

export default async function AboutPage() {
  let page = null;
  try {
    const res = await fetchPage("about");
    page = res?.data;
  } catch (e) {
    console.error("❌ Failed to load About page data:", e.message);
  }

  return (
    <div className="space-y-20 pb-20 max-w-2xl animate-in fade-in duration-1000">
      {/* Brand Story */}
      <section className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Our Heritage</h2>
          <h3 className="text-3xl md:text-4xl font-display font-medium text-gray-900 tracking-tight leading-[1.2]">
            {page?.title || "Crafting Elegance, One Stitch at a Time."}
          </h3>
        </div>
        <PageContent content={page?.content} />
      </section>

      {/* Values (Kept static for premium design integrity) */}
      <div className="space-y-12 border-t border-gray-200 pt-16">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-8">Our Pillars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
          {[
            { icon: Sparkles, title: "Artisan Craftmanship", desc: "Hand-finished by master craftspeople perfecting their art over generations." },
            { icon: Heart, title: "Premium Quality", desc: "Sourcing only the finest silks, khaddars, and cottons for a luxurious feel." },
            { icon: Star, title: "Modern Sophistication", desc: "Bridging the gap between traditional heritage and global fashion." },
            { icon: Users, title: "Community First", desc: "Ethical production and supporting the growth of local tailoring clusters." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-4">
              <item.icon size={20} strokeWidth={1.5} className="text-gray-900" />
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">{item.title}</h4>
                <p className="text-[13px] text-gray-500 leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-gray-50 p-12 md:p-16 text-center space-y-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Philosophy</h3>
        <p className="text-lg md:text-xl font-display font-medium text-gray-900 leading-relaxed italic max-w-xl mx-auto">
          "To empower the modern woman with attire that celebrates her roots and echoes her ambition. Fashion that is as bold as it is graceful."
        </p>
      </section>
    </div>
  );
}
