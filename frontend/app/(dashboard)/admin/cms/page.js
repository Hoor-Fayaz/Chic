"use client";

import { useState, useEffect } from "react";
import { fetchSettings, updateSettings, fetchCategories, uploadImageAPI } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";
import { Plus, Trash2, Save, Image as ImageIcon, Layout, ExternalLink, Columns, Layers, Grid, UploadCloud, Loader2, Phone } from "lucide-react";

export default function AdminCMSPage() {
  const [settings, setSettings] = useState({
    section1: { subtitle: "", title: "", description: "", slides: [] },
    section2: { slides: [] },
    section3: { title: "", items: [] },
    checkout: { shippingLimit: 5000, shippingDefault: 250, taxPercentage: 15, fbrFee: 1 },
    contactPhone: '923141988998',
    contactEmail: 'support@jannahchic.com',
    legalEmail: 'legal@jannahchic.com',
    privacyEmail: 'privacy@jannahchic.com',
    talentEmail: 'talent@jannahchic.com',
    storeAddress: 'DHA Phase 6, Pakistan',
    instagramUrl: 'https://www.instagram.com/jannah_chic',
    shippingRates: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null); // { section, index }
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
            checkout: settingsRes.data.checkout || { shippingLimit: 5000, shippingDefault: 250, taxPercentage: 15, fbrFee: 1 },
            contactPhone: settingsRes.data.contactPhone || '923141988998',
            contactEmail: settingsRes.data.contactEmail || 'support@jannahchic.com',
            legalEmail: settingsRes.data.legalEmail || 'legal@jannahchic.com',
            privacyEmail: settingsRes.data.privacyEmail || 'privacy@jannahchic.com',
            talentEmail: settingsRes.data.talentEmail || 'talent@jannahchic.com',
            storeAddress: settingsRes.data.storeAddress || 'DHA Phase 6, Pakistan',
            instagramUrl: settingsRes.data.instagramUrl || 'https://www.instagram.com/jannah_chic',
            shippingRates: settingsRes.data.shippingRates || [],
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

  const handleCMSFileUpload = async (e, section, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingIndex({ section, index });
    try {
      const formData = new FormData();
      formData.append('images', file); // API expects 'images' field

      const res = await uploadImageAPI(formData);
      if (res.success && res.data.urls && res.data.urls[0]) {
        const cloudUrl = res.data.urls[0];
        
        if (section === 'section1') updateS1Slide(index, "imageUrl", cloudUrl);
        else if (section === 'section2') updateS2Slide(index, "imageUrl", cloudUrl);
        else if (section === 'section3') updateS3Item(index, "imageUrl", cloudUrl);
        
        showToast("Image uploaded successfully!", "success");
      }
    } catch (error) {
      console.error('CMS Upload Error:', error);
      showToast("Failed to upload image", "error");
    } finally {
      setUploadingIndex(null);
      e.target.value = null;
    }
  };

  const updateCheckout = (field, value) => {
    setSettings({ ...settings, checkout: { ...settings.checkout, [field]: Number(value) } });
  };

  // Shipping Rates Helpers
  const addShippingRate = () => {
    setSettings({ ...settings, shippingRates: [...settings.shippingRates, { region: "", courier: "", time: "" }] });
  };
  const updateShippingRate = (index, field, value) => {
    const rates = [...settings.shippingRates];
    rates[index][field] = value;
    setSettings({ ...settings, shippingRates: rates });
  };
  const removeShippingRate = (index) => {
    const rates = settings.shippingRates.filter((_, i) => i !== index);
    setSettings({ ...settings, shippingRates: rates });
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
      <div className="flex flex-wrap bg-gray-200/50 p-1.5 rounded-full w-fit mx-auto gap-1">
          {[
              { id: "section1", label: "Hero (Slider + Text)", icon: Columns },
              { id: "section2", label: "Full-Width Banners", icon: Layers },
              { id: "section3", label: "Featured Collections", icon: Grid },
              { id: "brand", label: "Brand & Contact", icon: Phone }
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
                                    <button onClick={() => removeS1Slide(i)} className="absolute -top-2 -right-2 bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"><Trash2 size={12}/></button>
                                    
                                    <div className="flex gap-4 items-start">
                                        <div className="w-20 h-20 rounded-xl bg-white border border-gray-100 shrink-0 overflow-hidden relative">
                                            {slide.imageUrl ? (
                                                <img src={slide.imageUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon size={24}/></div>
                                            )}
                                            {uploadingIndex?.section === 'section1' && uploadingIndex?.index === i && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <Loader2 size={16} className="text-white animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <label className="block">
                                                <span className="text-[9px] font-bold uppercase text-gray-400 block mb-1 ml-1">Hero Image</span>
                                                <div className="relative group/btn">
                                                    <input 
                                                        type="file" 
                                                        className="hidden" 
                                                        id={`s1-file-${i}`} 
                                                        onChange={e => handleCMSFileUpload(e, 'section1', i)}
                                                        disabled={uploadingIndex}
                                                    />
                                                    <label 
                                                        htmlFor={`s1-file-${i}`}
                                                        className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-black hover:text-white transition-all shadow-sm"
                                                    >
                                                        <UploadCloud size={12}/> {slide.imageUrl ? 'Change Image' : 'Upload Image'}
                                                    </label>
                                                </div>
                                            </label>
                                            <input placeholder="Target Link (e.g. /shop/dresses)" value={slide.link} onChange={e => updateS1Slide(i, "link", e.target.value)} className="w-full bg-white px-4 py-2 text-[10px] rounded-lg outline-none border border-gray-100 shadow-sm" />
                                        </div>
                                    </div>
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
                         <div className="space-y-5">
                            <div>
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Banner Title</label>
                                <input placeholder="e.g. Summer Collection" value={s.title} onChange={e => updateS2Slide(i, "title", e.target.value)} className="w-full bg-gray-50 px-5 py-3 rounded-xl outline-none text-sm font-bold border border-gray-100" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Banner Image</label>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        id={`s2-file-${i}`} 
                                        onChange={e => handleCMSFileUpload(e, 'section2', i)}
                                        disabled={uploadingIndex}
                                    />
                                    <label 
                                        htmlFor={`s2-file-${i}`}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-bold cursor-pointer hover:bg-black hover:text-white transition-all shadow-sm"
                                    >
                                        {uploadingIndex?.section === 'section2' && uploadingIndex?.index === i ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14}/>} 
                                        {s.imageUrl ? 'Replace File' : 'Upload File'}
                                    </label>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Banner Link</label>
                                    <input placeholder="Target Link" value={s.link} onChange={e => updateS2Slide(i, "link", e.target.value)} className="w-full bg-white px-5 py-3 rounded-xl outline-none text-xs border border-gray-200 shadow-sm" />
                                </div>
                            </div>
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

                            <div className="space-y-4">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1 text-center">Section Banner</label>
                                <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-white shadow-inner border border-gray-100 relative group/img">
                                    {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon size={48} /></div>}
                                    
                                    {uploadingIndex?.section === 'section3' && uploadingIndex?.index === i && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                                            <Loader2 size={24} className="text-white animate-spin" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            id={`s3-file-${i}`} 
                                            onChange={e => handleCMSFileUpload(e, 'section3', i)}
                                            disabled={uploadingIndex}
                                        />
                                        <label 
                                            htmlFor={`s3-file-${i}`}
                                            className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-bold cursor-pointer hover:bg-gray-100 transition-all flex items-center gap-2"
                                        >
                                            <UploadCloud size={14}/> {item.imageUrl ? 'Change' : 'Upload'}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        </div>
      )}

      {/* Checkout Settings Section Removed */}

      {/* BRAND & CONTACT */}
      {activeTab === "brand" && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-2xl font-display font-bold flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs"><Phone size={14} /></span>
              Brand & Contact Settings
            </h3>
            <p className="text-xs text-gray-400 -mt-4">These details are used across the entire website — contact page, footer, WhatsApp redirects, legal pages, and more.</p>

            {/* Primary Contact */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-4">Primary Contact</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">WhatsApp / Phone Number</label>
                  <p className="text-[10px] text-gray-400 mb-2 ml-1">Digits only, e.g. <span className="font-mono bg-gray-100 px-1 rounded">923141988998</span></p>
                  <input
                    value={settings.contactPhone}
                    onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
                    placeholder="923141988998"
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-black/5 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Customer Support Email</label>
                  <p className="text-[10px] text-gray-400 mb-2 ml-1">Shown on the Contact page and in the footer.</p>
                  <input
                    value={settings.contactEmail}
                    onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                    placeholder="support@jannahchic.com"
                    type="email"
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-black/5 text-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Store / Flagship Address</label>
                  <p className="text-[10px] text-gray-400 mb-2 ml-1">Used on the Contact page and Google Maps "Get Directions" link.</p>
                  <input
                    value={settings.storeAddress}
                    onChange={e => setSettings({ ...settings, storeAddress: e.target.value })}
                    placeholder="DHA Phase 6, Pakistan"
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-black/5 text-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Instagram Profile URL</label>
                  <input
                    value={settings.instagramUrl}
                    onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/your_account"
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-black/5 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Departmental Emails */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-4">Departmental Emails</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Legal / Terms Email</label>
                  <p className="text-[10px] text-gray-400 mb-2 ml-1">Shown on the Terms & Conditions page.</p>
                  <input
                    value={settings.legalEmail}
                    onChange={e => setSettings({ ...settings, legalEmail: e.target.value })}
                    placeholder="legal@jannahchic.com"
                    type="email"
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-black/5 text-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Privacy / Data Email</label>
                  <p className="text-[10px] text-gray-400 mb-2 ml-1">Shown on the Privacy Policy page.</p>
                  <input
                    value={settings.privacyEmail}
                    onChange={e => setSettings({ ...settings, privacyEmail: e.target.value })}
                    placeholder="privacy@jannahchic.com"
                    type="email"
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-black/5 text-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Careers / Talent Email</label>
                  <p className="text-[10px] text-gray-400 mb-2 ml-1">Shown on the Careers page.</p>
                  <input
                    value={settings.talentEmail}
                    onChange={e => setSettings({ ...settings, talentEmail: e.target.value })}
                    placeholder="talent@jannahchic.com"
                    type="email"
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-black/5 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Rates Management */}
            <div className="pt-8 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-1">Logistics & Delivery</p>
                  <h4 className="text-lg font-bold">Standard Delivery Rates</h4>
                </div>
                <button 
                  onClick={addShippingRate}
                  className="bg-black text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all"
                >
                  <Plus size={14} /> Add Region
                </button>
              </div>

              {settings.shippingRates.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-3xl p-10 text-center">
                  <p className="text-gray-400 text-sm italic">No custom shipping rates defined. Public site will show defaults.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {settings.shippingRates.map((rate, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100 relative group">
                      <button 
                        onClick={() => removeShippingRate(i)}
                        className="absolute -top-2 -right-2 bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
                      >
                        <Trash2 size={12}/>
                      </button>
                      
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Region</label>
                        <input
                          value={rate.region}
                          onChange={e => updateShippingRate(i, "region", e.target.value)}
                          placeholder="e.g. Major Cities"
                          className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 text-[13px] font-semibold"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Courier Partner(s)</label>
                        <input
                          value={rate.courier}
                          onChange={e => updateShippingRate(i, "courier", e.target.value)}
                          placeholder="e.g. TCS / Leopards"
                          className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Est. Time</label>
                        <input
                          value={rate.time}
                          onChange={e => updateShippingRate(i, "time", e.target.value)}
                          placeholder="e.g. 2-3 Working Days"
                          className="w-full bg-white px-4 py-3 rounded-xl outline-none border border-gray-100 text-[13px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-xs text-blue-700 font-medium">
              <strong className="uppercase tracking-widest text-[10px]">Tip:</strong> Click <strong>Save & Deploy</strong> above to push all changes live.
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
