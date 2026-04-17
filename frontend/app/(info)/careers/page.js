export const dynamic = "force-dynamic";
import { fetchPage } from "@/lib/cms";
import { fetchPublicSettings } from "@/lib/api";
import PageContent from "@/components/ui/PageContent";

export async function generateMetadata() {
  const res = await fetchPage("careers");
  const page = res?.data;
  return {
    title: `${page?.title || "Careers"} | Jannah Chic`,
    description: page?.content?.substring(0, 160) || "Join the Jannah Chic atelier and explore career opportunities in fashion.",
  };
}

export default async function CareersPage() {
  const [res, settingsRes] = await Promise.all([
    fetchPage("careers"),
    fetchPublicSettings(),
  ]);
  const page = res?.data;
  const talentEmail = settingsRes?.data?.talentEmail || 'talent@jannahchic.com';

  return (
    <div className="space-y-16 pb-20 max-w-2xl animate-in fade-in duration-1000">
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-medium text-gray-900 tracking-tight">
          {page?.title || "Careers"}
        </h2>
        <PageContent content={page?.content} />
      </section>

      {/* Perks (Kept static for premium design) */}
      <div className="border-t border-gray-200 pt-16">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-8">Culture & Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
          {[
            { title: "Fast Growth", desc: "Mentorship and rapid career progression in a fast-paced retail environment." },
            { title: "Work Culture", desc: "An inclusive, diverse workspace that values creativity and collaboration." },
            { title: "Hybrid Work", desc: "Flexible schedules for corporate and creative roles." },
            { title: "Health Perks", desc: "Comprehensive health coverage for our full-time atelier members." }
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">{item.title}</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed max-w-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 text-center space-y-4 border-t border-gray-100 mt-12">
        <p className="text-[14px] text-gray-600 italic">"Don’t see a role that fits? Send us your portfolio anyway."</p>
        <a href={`mailto:${talentEmail}`} className="text-[11px] font-bold text-black border-b border-black uppercase tracking-widest pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors inline-block mt-4">
          {talentEmail}
        </a>
      </div>
    </div>
  );
}
