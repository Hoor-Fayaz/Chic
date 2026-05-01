"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { trackInquiry, fetchPublicSettings } from "@/lib/api";
import { Minus, Plus, ChevronDown, ChevronUp, Ruler, ShoppingBag } from "lucide-react";

export default function AddToCartSection({ product }) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [contactPhone, setContactPhone] = useState('923098730221');
  const { showToast } = useToastStore();

  useEffect(() => {
    fetchPublicSettings()
      .then(res => { if (res?.data?.contactPhone) setContactPhone(res.data.contactPhone); })
      .catch(() => {});
  }, []);

  const [openSection, setOpenSection] = useState("details"); // accordion state

  async function handleAddToCart() {
    if (product.sizes?.length > 0 && !selectedSize) {
      showToast("Please select a size", "info");
      return;
    }

    if (product.colors?.length > 0 && !selectedColor) {
      showToast("Please select a color", "info");
      return;
    }

    try {
      setLoading(true);
      useCartStore.getState().addItem(product, quantity, selectedSize, selectedColor);
      showToast(`${product.name} added to cart!`, "success");
    } catch (err) {
      console.error("Add to cart failed", err);
      showToast("Failed to add to cart. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleWhatsAppOrder = async () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      showToast("Please select a size before ordering via WhatsApp", "info");
      return;
    }

    if (product.colors?.length > 0 && !selectedColor) {
      showToast("Please select a color before ordering via WhatsApp", "info");
      return;
    }

    // Log the inquiry to the backend for admin analytics
    try {
        await trackInquiry({
            productId: product._id,
            name: product.name,
            size: selectedSize,
            color: selectedColor,
            quantity: quantity
        });
    } catch (err) {
        console.error("Failed to track inquiry:", err);
    }

    const phoneNumber = contactPhone;
    const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug}` : `https://jannah.com/product/${product.slug}`;
    
    let message = `🛍️ *JANNAH - NEW ORDER INQUIRY*\n\n`;
    message += `Hello team, I would like to place an order for the following item:\n\n`;
    message += `📋 *PRODUCT DETAILS*\n`;
    message += `------------------------------\n`;
    message += `*Item:* ${product.name}\n`;
    message += `*Quantity:* ${quantity}\n`;
    if (selectedSize) message += `*Size:* ${selectedSize}\n`;
    if (selectedColor) message += `*Color:* ${selectedColor}\n`;
    message += `*Price:* PKR ${(product.price * quantity).toLocaleString()}\n`;
    message += `*Article Link:*\n${currentUrl}\n\n`;
    message += `------------------------------\n`;
    message += `Please confirm the payment and delivery details! Thank you. ✨`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-8 pt-4 border-t border-gray-100">

      {/* SKU */}
      {product.sku && (
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
          SKU: {product.sku}
        </p>
      )}

      {/* Quantity */}
      <div className="space-y-3">
        <label className="text-[11px] uppercase tracking-widest font-bold text-gray-900 block">Quantity</label>
        <div className="flex items-center w-32 border border-gray-200 rounded-lg overflow-hidden h-11 bg-gray-50/50">
          <button
            type="button"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="flex-1 flex justify-center items-center hover:bg-gray-100 transition"
          >
            <Minus size={14} />
          </button>
          <div className="flex-1 flex justify-center items-center font-semibold text-sm">
            {quantity}
          </div>
          <button
            type="button"
            onClick={() => setQuantity(q => q + 1)}
            className="flex-1 flex justify-center items-center hover:bg-gray-100 transition"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Sizes */}
      {product.sizes?.length > 0 && (
        <div className="space-y-4">
          <label className="text-[11px] uppercase tracking-widest font-bold text-gray-900 block">Size</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-4 h-11 border text-[11px] uppercase tracking-tighter font-bold rounded-lg transition-all duration-300 ${selectedSize === s
                    ? "bg-black text-white border-black"
                    : "border-gray-200 text-gray-600 hover:border-black"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Size Guide Button */}
          <button
            onClick={() => setShowSizeChart(true)}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-900 hover:text-black hover:underline transition group"
          >
            <Ruler size={14} className="group-hover:rotate-12 transition-transform" />
            Size Guide
          </button>
        </div>
      )}

      {/* Colors */}
      {product.colors?.length > 0 && (
        <div className="space-y-4">
          <label className="text-[11px] uppercase tracking-widest font-bold text-gray-900 block">Color</label>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`group flex flex-col items-center gap-2`}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${selectedColor === c
                      ? "p-1 border-black scale-110 shadow-lg"
                      : "border-gray-100 hover:border-gray-300"
                    }`}
                >
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400 overflow-hidden">
                    {c.charAt(0).toUpperCase()}
                  </div>
                </div>
                <span className={`text-[9px] uppercase tracking-tighter font-bold transition-colors ${selectedColor === c ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>{c}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Checkout Actions */}
      <div className="space-y-3 pt-2">
        {/* Primary Add To Cart */}
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-[1.5rem] font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-black/5 hover:bg-gray-900 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Adding to Cart..." : "Add to Cart"}
        </button>

        {/* WhatsApp Order */}
        <button
          onClick={handleWhatsAppOrder}
          className="w-full bg-white border-2 border-black text-black py-4 flex items-center justify-center gap-2 rounded-[1.5rem] font-bold uppercase tracking-[0.2em] text-[11px] shadow-sm hover:bg-gray-50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          Order via Whatsapp
        </button>

        {/* Online Stylists Indicator */}
        <div className="flex items-center justify-center gap-2 pt-1 pb-2">
            <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            <span className="text-[10px] text-gray-500">Our stylists are online now</span>
        </div>
      </div>

      {/* Details Accordion */}
      <div className="border-t border-gray-100 mt-10">
        <div className="border-b border-gray-50">
          <button
            onClick={() => setOpenSection(openSection === 'details' ? null : 'details')}
            className="w-full py-5 flex justify-between items-center text-[12px] font-bold uppercase tracking-widest text-gray-900"
          >
            Details
            {openSection === 'details' ? <Minus size={14} /> : <Plus size={14} />}
          </button>

          <div className={`overflow-hidden transition-all duration-500 ${openSection === 'details' ? 'max-h-96 pb-6' : 'max-h-0'}`}>
            <div className="space-y-2 text-xs leading-relaxed text-gray-600">
              {product.fit && <p><span className="font-bold text-gray-900">Fit:</span> {product.fit}</p>}
              {product.composition && <p><span className="font-bold text-gray-900">Fabric Composition:</span> {product.composition}</p>}
              {product.fabric && <p><span className="font-bold text-gray-900">Material:</span> {product.fabric}</p>}
              {product.description && (
                <div className="pt-2">
                  <span className="font-bold text-gray-900 block mb-1 uppercase tracking-tighter">Description:</span>
                  <p>{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions Section (Static or dynamic) */}
        <div className="border-b border-gray-50">
          <button
            onClick={() => setOpenSection(openSection === 'instructions' ? null : 'instructions')}
            className="w-full py-5 flex justify-between items-center text-[12px] font-bold uppercase tracking-widest text-gray-900"
          >
            Core Instructions
            {openSection === 'instructions' ? <Minus size={14} /> : <Plus size={14} />}
          </button>
          <div className={`overflow-hidden transition-all duration-500 ${openSection === 'instructions' ? 'max-h-96 pb-6' : 'max-h-0'}`}>
            <ul className="text-xs space-y-2 text-gray-600 leading-relaxed list-disc pl-4">
              <li>Hand wash only in cold water</li>
              <li>Do not bleach or tumble dry</li>
              <li>Iron at low temperature</li>
              <li>Wash dark colors separately</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Simple Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowSizeChart(false)}>
          <div className="bg-white p-8 rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowSizeChart(false)} className="absolute right-6 top-6 text-gray-400 hover:text-black">
              <Plus className="rotate-45" size={24} />
            </button>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-display font-bold tracking-tight mb-2">Size Guide</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">Standard Boutique Measurements (Inches)</p>
            </div>

            {product.sizeChart ? (
              <img src={product.sizeChart} alt="Size Chart" className="w-full h-auto rounded-3xl border border-gray-100" />
            ) : (
              <div className="border border-gray-100 rounded-3xl p-6 overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[300px]">
                  <thead className="text-[10px] uppercase font-bold text-gray-400 border-b">
                    <tr>
                      <th className="py-3">Size</th>
                      <th className="py-3">Chest</th>
                      <th className="py-3">Waist</th>
                      <th className="py-3">Shoulder</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { s: 'XS', c: 18, w: 16, sh: 14 },
                      { s: 'S', c: 19, w: 17, sh: 14.5 },
                      { s: 'M', c: 20, w: 18, sh: 15 },
                      { s: 'L', c: 21, w: 19, sh: 15.5 },
                      { s: 'XL', c: 22, w: 20, sh: 16 }
                    ].map(item => (
                      <tr key={item.s}>
                        <td className="py-4 font-bold">{item.s}</td>
                        <td className="py-4 text-gray-600">{item.c}</td>
                        <td className="py-4 text-gray-600">{item.w}</td>
                        <td className="py-4 text-gray-600">{item.sh}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}

            <p className="mt-8 text-[11px] text-gray-400 leading-relaxed text-center italic">
              * Please note that these are approximate measurements and may vary slightly depending on the style.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

