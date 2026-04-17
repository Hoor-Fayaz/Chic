import { fetchPublicSettings } from "@/lib/api";
import FaqAccordion from "@/components/faqs/FaqAccordion";

export async function generateMetadata() {
  return {
    title: "Frequently Asked Questions | Jannah Chic",
    description: "Find answers to frequently asked questions about shopping, shipping, and caring for your luxury Jannah Chic garments.",
  };
}

export default async function FAQPage() {
  const settingsRes = await fetchPublicSettings().catch(() => null);
  const settings = settingsRes?.data;
  const contactPhone = settings?.contactPhone || "923141988998";
  
  // Format phone number for WhatsApp URL (remove non-digits)
  const formattedPhone = contactPhone.replace(/\D/g, "");

  const displayFaqs = [
    {
      category: "Orders & Shipping",
      items: [
        { 
          q: "What is your standard delivery time in Pakistan?", 
          a: "For major cities (Karachi, Lahore, Islamabad), we deliver within 2-3 business days. For other remote locations, please allow 4-5 business days." 
        },
        { 
          q: "How can I track my order once it is dispatched?", 
          a: "Once your order is handed over to our courier partner, you will receive a tracking link via SMS and WhatsApp. You can use this to monitor your parcel in real-time." 
        },
        { 
          q: "Is Cash on Delivery (COD) available?", 
          a: "Yes, we offer Cash on Delivery for all orders within Pakistan. You can also opt for Direct Bank Transfer for faster processing." 
        }
      ]
    },
    {
      category: "Customization & Sizing",
      items: [
        { 
          q: "Do you offer custom stitching for Sarees and Frocks?", 
          a: "We offer basic adjustments and custom stitching services for our high-end collections. Please contact our WhatsApp atelier support with your specific measurements after placing an order." 
        },
        { 
          q: "How do I ensure I select the right size?", 
          a: "Each product page features a detailed size chart. We follow standard Pakistani boutique sizing (XS to XXL). If you are between sizes, we recommend ordering the larger size for a better fit." 
        }
      ]
    },
    {
      category: "Exchanges & Returns",
      items: [
        { 
          q: "What is your return policy?", 
          a: "Items can be exchanged within 7 days of delivery if they are unused and in original packaging. Please note that custom-stitched or sale items are not eligible for returns or exchanges." 
        },
        { 
          q: "What should I do if I receive a damaged product?", 
          a: "Quality is our priority. In the rare event of a defect, please contact us on WhatsApp within 24 hours of delivery with photos of the damage, and we will arrange an immediate replacement." 
        }
      ]
    },
    {
      category: "Garment Care",
      items: [
        { 
          q: "How should I care for my embroidered silk items?", 
          a: "We highly recommend Dry Clean Only for all our silk, chiffon, and heavily embroidered pieces to preserve the intricate handwork and fabric texture." 
        }
      ]
    }
  ];

  return (
    <div className="space-y-16 pb-20 max-w-2xl animate-in fade-in duration-1000">
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-medium text-gray-900 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 text-[15px] leading-relaxed">
          Everything you need to know about our boutique experience, artisanal craftsmanship, and shipping policies.
        </p>
      </section>

      <div className="border-t border-gray-200">
        <FaqAccordion faqs={displayFaqs} />
      </div>

      <div className="bg-gray-50 p-8 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Still have questions?</h3>
        <p className="text-gray-600 text-sm">
          Our customer care team is available on WhatsApp from 10:00 AM to 8:00 PM (PST) to assist you with any inquiries.
        </p>
        <a 
          href={`https://wa.me/${formattedPhone}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-black text-white px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Contact on WhatsApp
        </a>
      </div>
    </div>
  );
}
