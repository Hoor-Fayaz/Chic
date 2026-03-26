"use client";

import { useState, useEffect } from "react";
import { fetchSettings, updateSettings, fetchCategories } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";
import { Plus, Trash2, Save, Image as ImageIcon, Layout, ExternalLink, Columns, Layers, Grid } from "lucide-react";

export default function AdminCMSPage() {
  const [settings, setSettings] = useState({
    section1: { subtitle: "", title: "", description: "", slides: [] },
    section2: { slides: [] },
    section3: { title: "", items: [] },
    checkout: { shippingLimit: 5000, shippingDefault: 250, taxPercentage: 15, fbrFee: 1 }
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToastStore();
  const [activeTab, setActiveTab] = useState("section1");

  useEffect(() => {
    Promise.all([fetchSettings(), fetchCategories()])
      .then(([settingsRes, categoriesRes]) => {
        if (settingsRes.success && settingsRes.data) {
          setSettings({
            section1: settingsRes.data.section1 || { subtitle: "", title: "", description: "", slides: [] },
            section2: settingsRes.data.section2 || { slides: [] },
            section3: settingsRes.data.section3 || { title: "", items: [] },
            checkout: settingsRes.data.checkout || { shippingLimit: 5000, shippingDefault: 250, taxPercentage: 15, fbrFee: 1 }
          });
        }
        if (categoriesRes.success) {
          setCategories(categoriesRes.data?.items || []);
        }
      })
      .catch(err => {
          console.error("Load failed", err);
          showToast("Failed to load CMS settings", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      showToast("Homepage updated and deployed!", "success");
    } catch (err) {
      console.error(err);
      showToast("Error deploying changes", "error");
    } finally {
      setSaving(false);
    }
  };

  // Section 1 Helpers
  const updateS1Text = (field, value) => {
    setSettings({ ...settings, section1: { ...settings.section1, [field]: value } });
  };
  const addS1Slide = () => {
    setSettings({ ...settings, section1: { ...settings.section1, slides: [...settings.section1.slides, { imageUrl: "", link: "/shop" }] } });
  };
  const updateS1Slide = (index, field, value) => {
    const slides = [...settings.section1.slides];
    slides[index][field] = value;
    setSettings({ ...settings, section1: { ...settings.section1, slides } });
  };
  const removeS1Slide = (index) => {
    const slides = settings.section1.slides.filter((_, i) => i !== index);
    setSettings({ ...settings, section1: { ...settings.section1, slides } });
  };

  // Section 2 Helpers
  const addS2Slide = () => {
    setSettings({ ...settings, section2: { ...settings.section2, slides: [...settings.section2.slides, { imageUrl: "", title: "", link: "/shop" }] } });
  };
  const updateS2Slide = (index, field, value) => {
    const slides = [...settings.section2.slides];
    slides[index][field] = value;
    setSettings({ ...settings, section2: { ...settings.section2, slides } });
  };
  const removeS2Slide = (index) => {
    const slides = settings.section2.slides.filter((_, i) => i !== index);
    setSettings({ ...settings, section2: { ...settings.section2, slides } });
  };

  // Section 3 Helpers
  const updateS3Title = (val) => setSettings({...settings, section3: {...settings.section3, title: val}});
  const addS3Item = () => {
    setSettings({ ...settings, section3: { ...settings.section3, items: [...settings.section3.items, { categoryId: "", imageUrl: "", label: "" }] } });
  };
  const updateS3Item = (index, field, value) => {
    const items = [...settings.section3.items];
    items[index][field] = value;
    setSettings({ ...settings, section3: { ...settings.section3, items } });
  };
  const removeS3Item = (index) => {
    const items = settings.section3.items.filter((_, i) => i !== index);
    setSettings({ ...settings, section3: { ...settings.section3, items } });
  };

  // Checkout Helpers
  const updateCheckout = (field, value) => {
    setSettings({ ...settings, checkout: { ...settings.checkout, [field]: Number(value) } });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 sticky top-4 z-50">
        <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 leading-tight">Storefront CMS</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-1">Refining Your Boutique Identity</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-black text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-all shadow-black/10 shadow-lg active:scale-95"
            >
              {saving ? "Deploying..." : <><Save size={16} /> Save & Deploy</>}
            </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-gray-200/50 p-1.5 rounded-full w-fit mx-auto">
          {[
              { id: "section1", label: "Hero (Slider + Text)", icon: Columns },
              { id: "section2", label: "Full-Width Banners", icon: Layers },
              { id: "section3", label: "Featured Collections", icon: Grid },
              { id: "checkout", label: "Checkout & Fees", icon: Layout }
          ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              >
                  <tab.icon size={14} />
                  {tab.label}
              </button>
          ))}
      </div>

      {/* SECTION 1: HERO */}
      {activeTab === "section1" && (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs">1</span>
                            Hero Content (Left Side)
                        </h3>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Main Heading</label>
                            <input value={settings.section1.title} onChange={e => updateS1Text("title", e.target.value)} className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-black/5" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Tagline / Subtitle</label>
                            <input value={settings.section1.subtitle} onChange={e => updateS1Text("subtitle", e.target.value)} className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-black/5" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Intro Description</label>
                            <textarea value={settings.section1.description} onChange={e => updateS1Text("description", e.target.value)} className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-black/5 min-h-[120px]" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs">2</span>
                                Hero Slides (Right Side)
                            </h3>
                            <button onClick={addS1Slide} className="text-[10px] font-bold uppercase tracking-widest text-black flex items-center gap-1 hover:underline"><Plus size={14}/> Add Slide</button>
                        </div>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {settings.section1.slides.map((slide, i) => (
                                <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                                    <button onClick={() => removeS1Slide(i)} className="absolute -top-2 -right-2 bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"><Trash2 size={12}/></button>
                                    <input placeholder="Image URL" value={slide.imageUrl} onChange={e => updateS1Slide(i, "imageUrl", e.target.value)} className="w-full bg-white px-4 py-2 text-xs rounded-xl mb-3 outline-none border border-gray-100" />
                                    <input placeholder="Link" value={slide.link} onChange={e => updateS1Slide(i, "link", e.target.value)} className="w-full bg-white px-4 py-2 text-xs rounded-xl outline-none border border-gray-100" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* SECTION 2: FULL WIDTH */}
      {activeTab === "section2" && (
        <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-display font-bold">Featured Banner Slider</h3>
                <button onClick={addS2Slide} className="bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all"><Plus size={14} className="inline mr-2" /> Add Banner</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {settings.section2.slides.map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative group">
                         <button onClick={() => removeS2Slide(i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                         <div className="aspect-[21/9] bg-gray-50 rounded-2xl mb-6 overflow-hidden border border-gray-100">
                            {s.imageUrl ? <img src={s.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={40} className="text-gray-200" /></div>}
                         </div>
                         <div className="space-y-4">
                            <input placeholder="Banner Title (e.g. Summer Sale)" value={s.title} onChange={e => updateS2Slide(i, "title", e.target.value)} className="w-full bg-gray-50 px-5 py-3 rounded-xl outline-none text-sm font-bold" />
                            <input placeholder="Image URL" value={s.imageUrl} onChange={e => updateS2Slide(i, "imageUrl", e.target.value)} className="w-full bg-gray-50 px-5 py-3 rounded-xl outline-none text-xs" />
                            <input placeholder="Target Link" value={s.link} onChange={e => updateS2Slide(i, "link", e.target.value)} className="w-full bg-gray-50 px-5 py-3 rounded-xl outline-none text-xs" />
                         </div>
                    </div>
                ))}
             </div>
        </div>
      )}

      {/* SECTION 3: CATEGORIES */}
      {activeTab === "section3" && (
        <div className="space-y-8 animate-in fade-in duration-500">
             <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-display font-bold">Featured Categories Grid</h3>
                        <input value={settings.section3.title} onChange={e => updateS3Title(e.target.value)} className="bg-gray-50 px-4 py-2 mt-2 rounded-xl text-xs font-bold w-64 outline-none border border-gray-100" placeholder="Section Title" />
                    </div>
                    <button onClick={addS3Item} className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl"><Plus size={14} className="inline mr-2" /> Add Selection</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {settings.section3.items.map((item, i) => (
                        <div key={i} className="p-8 bg-gray-50 rounded-[2.5rem] space-y-5 border border-gray-100 relative group">
                            <button onClick={() => removeS3Item(i)} className="absolute -top-2 -right-2 bg-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                            
                            <select 
                                value={item.categoryId || ""} 
                                onChange={e => updateS3Item(i, "categoryId", e.target.value)}
                                className="w-full p-4 bg-white rounded-2xl text-xs font-bold outline-none border border-gray-100 shadow-sm"
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>

                            <input placeholder="Display Label (Optional)" value={item.label} onChange={e => updateS3Item(i, "label", e.target.value)} className="w-full p-4 bg-white rounded-2xl text-xs outline-none border border-gray-100 shadow-sm" />

                            <div>
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Custom Banner URL</label>
                                <input placeholder="https://..." value={item.imageUrl} onChange={e => updateS3Item(i, "imageUrl", e.target.value)} className="w-full p-4 bg-white rounded-2xl text-xs outline-none border border-gray-100 shadow-sm" />
                            </div>

                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200 shadow-inner">
                                {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">No Banner</div>}
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        </div>
      )}

      {/* SECTION 4: CHECKOUT SETTINGS */}
      {activeTab === "checkout" && (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-2xl font-display font-bold mb-8">Checkout & Financial Rules</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Shipping Logic</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Free Shipping Above</label>
                                <input type="number" value={settings.checkout.shippingLimit} onChange={e => updateCheckout("shippingLimit", e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none border border-gray-100" />
                            </div>
                            <div>
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Default Shipping Fee</label>
                                <input type="number" value={settings.checkout.shippingDefault} onChange={e => updateCheckout("shippingDefault", e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none border border-gray-100" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Tax & Regulatory Fees</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Sales Tax (%)</label>
                                <input type="number" value={settings.checkout.taxPercentage} onChange={e => updateCheckout("taxPercentage", e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none border border-gray-100" />
                            </div>
                            <div>
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">FBR Service Fee (PKR)</label>
                                <input type="number" value={settings.checkout.fbrFee} onChange={e => updateCheckout("fbrFee", e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none border border-gray-100" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">💡 Strategic Insight</p>
                    <p className="text-xs text-blue-500 mt-2 leading-relaxed">
                        These values are live. Changes will immediately affect the Checkout Summary for all customers.
                        Ensure legal compliance with regional tax authorities before making adjustments.
                    </p>
                </div>
            </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ddd; }
      `}</style>
    </div>
  );
}
