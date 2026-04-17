export const dynamic = "force-dynamic";
import { fetchPage } from "@/lib/cms";
import { fetchPublicSettings } from "@/lib/api";
import PageContent from "@/components/ui/PageContent";

export async function generateMetadata() {
  try {
    const res = await fetchPage("shipping");
    const page = res?.data;
    return {
      title: `${page?.title || "Shipping"} | Jannah Chic`,
      description: page?.content?.substring(0, 160) || "Shipping policies and delivery information for Jannah Chic.",
    };
  } catch (e) {
    return { title: "Shipping | Jannah Chic" };
  }
}

export default async function ShippingPage() {
  let page = null;
  let settings = null;

  try {
    const [pageRes, settingsRes] = await Promise.all([
      fetchPage("shipping"),
      fetchPublicSettings(),
    ]);
    page = pageRes?.data;
    settings = settingsRes?.data;
  } catch (e) {
    console.error("Failed to load shipping page data:", e);
  }

  const contactPhone = settings?.contactPhone || "923141988998";
  const formattedPhone = contactPhone.replace(/\D/g, "");

  // Default rates if none are set in CMS
  const defaultRates = [
    { region: "Major Cities", courier: "TCS / Leopards", time: "2-3 Working Days" },
    { region: "Other Areas", courier: "TCS / Call Courier", time: "4-6 Working Days" }
  ];

  const shippingRates = settings?.shippingRates?.length > 0 ? settings.shippingRates : defaultRates;

  return (
    <div className="space-y-16 max-w-2xl animate-in fade-in duration-1000">
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-medium text-gray-900 tracking-tight leading-tight">
          {page?.title || "Shipping at Jannah Chic"}
        </h2>
        <PageContent content={page?.content} />
      </section>

      {/* Standard Delivery Rates (Now Dynamic) */}
      <section className="space-y-8 pt-10 border-t border-gray-200">
        <h3 className="text-2xl font-display font-medium text-gray-900">Standard Delivery Rates</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200">
              <tr>
                <th className="py-4 pr-4 font-bold">Region</th>
                <th className="py-4 px-4 font-bold">Courier Partner</th>
                <th className="py-4 pl-4 font-bold text-right">Estimated Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-500">
              {shippingRates.map((rate, i) => (
                <tr key={i}>
                  <td className="py-5 pr-4">{rate.region}</td>
                  <td className="py-5 px-4 font-medium text-gray-900">{rate.courier}</td>
                  <td className="py-5 pl-4 text-right">{rate.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="px-8 py-10 bg-gray-50 flex flex-col items-start gap-4 border border-gray-100 rounded-3xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Need it urgently?</p>
        <p className="text-lg font-display text-gray-900">Fast-track shipping is available for major cities.</p>
        <a 
          href={`https://wa.me/${formattedPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
        >
          Contact Concierge
        </a>
      </div>
    </div>
  );
}
