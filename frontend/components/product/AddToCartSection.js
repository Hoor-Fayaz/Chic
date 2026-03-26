"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { Minus, Plus, ChevronDown, ChevronUp, Ruler, ShoppingBag } from "lucide-react";

export default function AddToCartSection({ product }) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const { showToast } = useToastStore();

  const [openSection, setOpenSection] = useState("details"); // accordion state
  
  const user = useAuthStore((state) => state.user);
  const setCart = useCartStore((state) => state.setCart);
  const router = useRouter();

  async function handleAddToCart() {
    if (!user) {
      router.push("/auth/login");
      return;
    }

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
      const res = await addToCart({
        productId: product?._id,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
      });


      if (res.success && res.data?.cart?.items) {
        setCart(res.data.cart.items);
        showToast(`${product.name} added to bag!`, "success");
      }
    } catch (err) {
      console.error("Add to cart failed", err);
      showToast("Failed to add to bag. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

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
                className={`px-4 h-11 border text-[11px] uppercase tracking-tighter font-bold rounded-lg transition-all duration-300 ${
                  selectedSize === s 
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
          <div className="flex gap-3">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`group flex flex-col items-center gap-2`}
              >
                <div 
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    selectedColor === c 
                      ? "p-1 border-black scale-110 shadow-lg" 
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                    {/* Visual circle representing the color if we had hex, but since it's just names, we use a placeholder or initials */}
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


      {/* Add To Bag */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full bg-black text-white py-4 rounded-[1.5rem] font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-black/5 hover:bg-gray-900 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50"
      >
        {loading ? "Adding to Bag..." : "Add to Bag"}
      </button>

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
                    <div className="border border-gray-100 rounded-3xl p-6">
                        <table className="w-full text-sm text-left">
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
