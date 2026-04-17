export const dynamic = "force-dynamic";
import { fetchPage } from "@/lib/cms";
import { fetchPublicSettings } from "@/lib/api";
import PageContent from "@/components/ui/PageContent";

export async function generateMetadata() {
  const res = await fetchPage("privacy");
  const page = res?.data;
  return {
    title: `${page?.title || "Privacy Policy"} | Jannah Chic`,
    description: page?.content?.substring(0, 160) || "Privacy policy and data protection charter for Jannah Chic customers.",
  };
}

export default async function PrivacyPage() {
  const [res, settingsRes] = await Promise.all([
    fetchPage("privacy"),
    fetchPublicSettings(),
  ]);
  const page = res?.data;
  const privacyEmail = settingsRes?.data?.privacyEmail || 'privacy@jannahchic.com';

  return (
    <div className="space-y-16 pb-20 max-w-2xl animate-in fade-in duration-1000">
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-medium text-gray-900 tracking-tight">
          {page?.title || "Privacy Policy"}
        </h2>
        <PageContent content={page?.content} />
      </section>

      <div className="pt-12 text-[13px] text-gray-500 italic border-t border-gray-100">
        For any privacy concerns, please reach out to our data concierge at <a href={`mailto:${privacyEmail}`} className="underline hover:text-gray-900">{privacyEmail}</a>.
      </div>
    </div>
  );
}
