import { fetchPage } from "@/lib/cms";
import { fetchPublicSettings } from "@/lib/api";
import PageContent from "@/components/ui/PageContent";
import ContactFormWrapper from "@/components/contact/ContactFormWrapper";

export async function generateMetadata() {
  const res = await fetchPage("contact");
  const page = res?.data;
  return {
    title: `${page?.title || "Contact Us"} | Jannah Chic`,
    description: page?.content?.substring(0, 160) || "Get in touch with Jannah Chic for inquiries or support.",
  };
}

export default async function ContactPage() {
  const [pageRes, settingsRes] = await Promise.all([
    fetchPage("contact"),
    fetchPublicSettings(),
  ]);

  const page = pageRes?.data;
  const brand = {
    contactPhone: settingsRes?.data?.contactPhone || '923141988998',
    contactEmail: settingsRes?.data?.contactEmail || 'support@jannahchic.com',
    storeAddress: settingsRes?.data?.storeAddress || 'DHA Phase 6, Pakistan',
  };

  // Build a Google Maps search URL from the address
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.storeAddress)}`;

  const contactItems = [
    {
      label: "Live Chat",
      val: "Available on WhatsApp 24/7",
      link: `https://wa.me/${brand.contactPhone}`,
      linkText: "Message us"
    },
    {
      label: "Customer Support",
      val: brand.contactEmail,
      link: `mailto:${brand.contactEmail}`,
      linkText: "Email us"
    },
    {
      label: "Phone & SMS",
      val: `+${brand.contactPhone}`,
      link: `tel:+${brand.contactPhone}`,
      linkText: "Call us"
    },
    {
      label: "Flagship Store",
      val: brand.storeAddress,
      link: mapsUrl,
      linkText: "Get directions"
    }
  ];

  return (
    <div className="space-y-20 pb-20 animate-in fade-in duration-1000">
      <section className="space-y-6 max-w-2xl">
        <h2 className="text-3xl font-display font-medium text-gray-900 tracking-tight">
          {page?.title || "Contact Us"}
        </h2>
        <PageContent content={page?.content} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 border-t border-gray-200 pt-16">
        {/* Contact Details */}
        <div className="space-y-16">
          <div className="space-y-12">
            {contactItems.map((item, i) => (
              <div key={i} className="flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.label}</p>
                <p className="text-[14px] text-gray-900">{item.val}</p>
                <a
                  href={item.link}
                  target={item.label === "Flagship Store" ? "_blank" : undefined}
                  rel={item.label === "Flagship Store" ? "noopener noreferrer" : undefined}
                  className="text-[11px] font-bold text-black border-b border-black uppercase tracking-widest pb-0.5 w-fit mt-2 hover:text-gray-600 hover:border-gray-600 transition-colors"
                >
                  {item.linkText}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-8 md:p-12 border border-gray-100 h-fit">
          <h3 className="text-xl font-display font-medium text-gray-900 mb-8">Send a Message</h3>
          <ContactFormWrapper contactPhone={brand.contactPhone} />
        </div>
      </div>
    </div>
  );
}

