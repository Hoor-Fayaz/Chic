import { fetchPage } from "@/lib/cms";
import { fetchPublicSettings } from "@/lib/api";
import PageContent from "@/components/ui/PageContent";

export async function generateMetadata() {
  const res = await fetchPage("terms");
  const page = res?.data;
  return {
    title: `${page?.title || "Terms & Conditions"} | Jannah Chic`,
    description: page?.content?.substring(0, 160) || "Legal terms and conditions for Jannah Chic.",
  };
}

export default async function TermsPage() {
  const [res, settingsRes] = await Promise.all([
    fetchPage("terms"),
    fetchPublicSettings(),
  ]);
  const page = res?.data;
  const legalEmail = settingsRes?.data?.legalEmail || 'legal@jannahchic.com';

  return (
    <div className="space-y-16 pb-20 max-w-2xl animate-in fade-in duration-1000">
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-medium text-gray-900 tracking-tight">
          {page?.title || "Terms & Conditions"}
        </h2>
        <PageContent content={page?.content} />
      </section>

      <div className="pt-12 text-[13px] text-gray-500 italic border-t border-gray-100">
        For specific questions regarding these terms, please contact our legal concierge at <a href={`mailto:${legalEmail}`} className="underline hover:text-gray-900">{legalEmail}</a>
      </div>
    </div>
  );
}
