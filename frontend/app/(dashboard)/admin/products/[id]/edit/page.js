'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchProducts, updateProduct, fetchCategories, uploadImageAPI } from '@/lib/api';
import { UploadCloud, Loader2 } from 'lucide-react';

export default function EditProductPage() {
    const { id } = useParams();
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        discountPercent: '',
        isOnSale: false,
        isNewArrival: false,
        isFeatured: false,
        stock: '',
        category: '',
        unstitchedType: '',
        slug: '',
        sku: '',
        fabric: '',
        fit: '',
        composition: '',
        sizeChart: '',
        sizes: [],
        colors: [],
        images: [{ url: '', alt: '', isPrimary: true }],
    });

    const [newSize, setNewSize] = useState('');
    const [newColor, setNewColor] = useState('');
    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadingSizeChart, setUploadingSizeChart] = useState(false);

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const router = useRouter();

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [catData, prodData] = await Promise.all([
                fetchCategories(),
                fetchProducts({ limit: 100 }),
            ]);

            setCategories(catData.data?.items || []);

            const product = prodData.data?.items?.find((p) => p._id === id);
            if (product) {
                setForm({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || '',
                    originalPrice: product.originalPrice || '',
                    discountPercent: product.discountPercent || '',
                    isOnSale: product.isOnSale || false,
                    isNewArrival: product.isNewArrival || false,
                    isFeatured: product.isFeatured || false,
                    stock: product.stock || '',
                    category: typeof product.category === 'object' ? product.category._id : (product.category || ''),
                    unstitchedType: product.tags?.find(t => t.toLowerCase() === '2 piece' || t.toLowerCase() === '3 piece') || '',
                    slug: product.slug || '',
                    sku: product.sku || '',
                    fabric: product.fabric || '',
                    fit: product.fit || '',
                    composition: product.composition || '',
                    sizeChart: product.sizeChart || '',
                    sizes: product.sizes || [],
                    colors: product.colors || [],
                    images: (product.images && product.images.length > 0)
                        ? product.images
                        : [{ url: '', alt: '', isPrimary: true }],
                });
            }
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newVal = type === 'checkbox' ? checked : value;
        const updated = { ...form, [name]: newVal };

        // Auto-compute discountPercent when both prices are filled
        if (name === 'originalPrice' || name === 'price') {
            const orig = parseFloat(name === 'originalPrice' ? value : form.originalPrice);
            const sale = parseFloat(name === 'price' ? value : form.price);
            if (orig > 0 && sale > 0 && orig > sale) {
                updated.discountPercent = Math.round(((orig - sale) / orig) * 100);
            } else {
                updated.discountPercent = '';
            }
        }
        setForm(updated);
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingImages(true);
        try {
            const formData = new FormData();
            files.forEach(file => formData.append('images', file));

            const res = await uploadImageAPI(formData);
            if (res.success && res.data.urls) {
                const newImageObjects = res.data.urls.map(url => ({
                    url,
                    alt: '',
                    isPrimary: false
                }));

                const existingValidImgs = form.images.filter((img) => img.url);
                if (existingValidImgs.length === 0 && newImageObjects.length > 0) {
                    newImageObjects[0].isPrimary = true;
                }

                setForm({
                    ...form,
                    images: [...existingValidImgs, ...newImageObjects],
                });
            }
        } finally {
            setUploadingImages(false);
            e.target.value = null;
        }
    };

    const handleSizeChartUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingSizeChart(true);
        try {
            const formData = new FormData();
            formData.append('images', file); // Use 'images' key as expected by backend upload endpoint

            const res = await uploadImageAPI(formData);
            if (res.success && res.data.urls && res.data.urls.length > 0) {
                setForm({
                    ...form,
                    sizeChart: res.data.urls[0],
                });
            }
        } catch (error) {
            console.error('Failed to upload size chart', error);
            alert('Failed to upload size chart. Please try again.');
        } finally {
            setUploadingSizeChart(false);
            if (e.target) e.target.value = null;
        }
    };

    const removeImageField = (index) => {
        if (form.images.length === 1) return;
        const newImages = form.images.filter((_, i) => i !== index);
        if (!newImages.some((img) => img.isPrimary)) {
            newImages[0].isPrimary = true;
        }
        setForm({ ...form, images: newImages });
    };

    const setPrimaryImage = (index) => {
        const newImages = form.images.map((img, i) => ({
            ...img,
            isPrimary: i === index,
        }));
        setForm({ ...form, images: newImages });
    };

    const addSize = (e) => {
        e.preventDefault();
        if (newSize.trim()) {
            if (!form.sizes.includes(newSize.trim())) {
                setForm({ ...form, sizes: [...form.sizes, newSize.trim()] });
            }
            setNewSize('');
        }
    };

    const removeSize = (sizeToRemove) => {
        setForm({ ...form, sizes: form.sizes.filter(s => s !== sizeToRemove) });
    };

    const addColor = (e) => {
        e.preventDefault();
        if (newColor.trim()) {
            if (!form.colors.includes(newColor.trim())) {
                setForm({ ...form, colors: [...form.colors, newColor.trim()] });
            }
            setNewColor('');
        }
    };

    const removeColor = (colorToRemove) => {
        setForm({ ...form, colors: form.colors.filter(c => c !== colorToRemove) });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
                discountPercent: form.discountPercent ? Number(form.discountPercent) : undefined,
                stock: Number(form.stock),
                images: form.images.filter((img) => img.url),
                tags: form.unstitchedType ? [form.unstitchedType] : [],
            };

            // Convert empty optional fields to null to prevent Mongoose CastErrors and Unique Constraint errors
            const optionalStringFields = ['category', 'sku', 'slug', 'fabric', 'fit', 'composition', 'sizeChart'];
            for (const field of optionalStringFields) {
                if (payload[field] === '') {
                    payload[field] = null;
                }
            }

            await updateProduct(id, payload);
            router.push('/admin/products');
        } catch (error) {
            console.error('Failed to update product', error);
            alert(`Failed to update product: ${error?.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-display font-semibold mb-8 text-gray-900">Edit Product</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                            rows="5"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price (Rs.)</label>
                            <input
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                            <input
                                name="stock"
                                type="number"
                                value={form.stock}
                                onChange={handleChange}
                                className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (Rs.)</label>
                            <input
                                name="originalPrice"
                                type="number"
                                value={form.originalPrice}
                                onChange={handleChange}
                                className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                                placeholder="e.g. 5000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-gray-400">Discount (%)</label>
                            <input
                                name="discountPercent"
                                type="number"
                                value={form.discountPercent}
                                className="w-full border border-gray-100 bg-gray-50 px-4 py-2.5 rounded-xl outline-none transition text-gray-400"
                                readOnly
                                placeholder="Auto-computed"
                            />
                        </div>
                    </div>

                    {/* Flags */}
                    <div className="flex flex-wrap gap-6 py-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="isOnSale"
                                checked={form.isOnSale}
                                onChange={handleChange}
                                className="w-5 h-5 rounded-lg border-gray-300 text-black focus:ring-black cursor-pointer"
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-black transition">On Sale</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="isNewArrival"
                                checked={form.isNewArrival}
                                onChange={handleChange}
                                className="w-5 h-5 rounded-lg border-gray-300 text-black focus:ring-black cursor-pointer"
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-black transition">New Arrival</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={form.isFeatured}
                                onChange={handleChange}
                                className="w-5 h-5 rounded-lg border-gray-300 text-black focus:ring-black cursor-pointer"
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-black transition">Featured</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 border border-gray-100 bg-gray-50/50 p-4 rounded-xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-display uppercase tracking-wider text-[11px]">Category</label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full border border-gray-100 bg-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                            >
                                <option value="">Select Category</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {categories.find(c => c._id === form.category)?.name?.toLowerCase().includes('unstitched') && (
                            <div className="pt-2 border-t border-gray-200 mt-2">
                                <label className="block text-sm font-bold text-gray-900 mb-3 font-display uppercase tracking-wider text-[11px]">Unstitched Type</label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="unstitchedType" value="" checked={form.unstitchedType === ''} onChange={handleChange} className="w-4 h-4 text-black focus:ring-black" />
                                        <span className="text-sm font-medium">Standard</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="unstitchedType" value="2 piece" checked={form.unstitchedType === '2 piece'} onChange={handleChange} className="w-4 h-4 text-black focus:ring-black" />
                                        <span className="text-sm font-medium">2 Piece</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="unstitchedType" value="3 piece" checked={form.unstitchedType === '3 piece'} onChange={handleChange} className="w-4 h-4 text-black focus:ring-black" />
                                        <span className="text-sm font-medium">3 Piece</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-display uppercase tracking-wider text-[11px]">SKU</label>
                            <input
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                className="w-full border border-gray-100 bg-gray-50/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                                placeholder="e.g. 25-10-12"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-display uppercase tracking-wider text-[11px]">Material / Fabric</label>
                            <input
                                name="fabric"
                                value={form.fabric}
                                onChange={handleChange}
                                className="w-full border border-gray-100 bg-gray-50/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                                placeholder="e.g. Khaddar"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-display uppercase tracking-wider text-[11px]">Fit</label>
                            <input
                                name="fit"
                                value={form.fit}
                                onChange={handleChange}
                                className="w-full border border-gray-100 bg-gray-50/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                                placeholder="e.g. Smart Fit"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-display uppercase tracking-wider text-[11px]">Fabric Composition</label>
                            <input
                                name="composition"
                                value={form.composition}
                                onChange={handleChange}
                                className="w-full border border-gray-100 bg-gray-50/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                                placeholder="e.g. 100% Cotton"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-display uppercase tracking-wider text-[11px]">Size Chart Image</label>
                        <div className="space-y-4">
                            {form.sizeChart ? (
                                <div className="relative group w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                                    <img 
                                        src={form.sizeChart} 
                                        alt="Size Chart" 
                                        className="w-full h-full object-contain" 
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                                        <button 
                                            type="button"
                                            onClick={() => setForm({ ...form, sizeChart: '' })}
                                            className="bg-white text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition"
                                        >
                                            Remove Chart
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${uploadingSizeChart ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {uploadingSizeChart ? (
                                            <Loader2 size={20} className="animate-spin text-gray-400 mb-2" />
                                        ) : (
                                            <UploadCloud size={20} className="text-gray-400 mb-2" />
                                        )}
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">
                                            {uploadingSizeChart ? 'Uploading chart...' : 'Upload Single Size Chart'}
                                        </p>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleSizeChartUpload}
                                        disabled={uploadingSizeChart}
                                    />
                                </label>
                            )}
                            <p className="text-[10px] text-gray-400 italic">If no custom chart is uploaded, the default boutique guide will be displayed.</p>
                        </div>
                    </div>

                    {/* Size Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 font-display uppercase tracking-wider text-[11px]">Available Sizes</label>
                        <div className="flex gap-2 flex-wrap mb-3">
                            {form.sizes.map((s) => (
                                <span key={s} className="bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-2">
                                    {s}
                                    <button type="button" onClick={() => removeSize(s)} className="hover:text-red-400">×</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                value={newSize}
                                onChange={(e) => setNewSize(e.target.value)}
                                className="flex-1 border border-gray-100 bg-gray-50/50 px-4 py-2 rounded-xl focus:ring-2 focus:ring-black outline-none transition sm:text-sm"
                                placeholder="Add size (e.g. 8, M, XL)"
                            />
                            <button
                                type="button"
                                onClick={addSize}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 transition text-sm font-semibold"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Color Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 font-display uppercase tracking-wider text-[11px]">Available Colors</label>
                        <div className="flex gap-2 flex-wrap mb-3">
                            {form.colors?.map((c) => (
                                <span key={c} className="bg-gray-100 text-gray-900 border border-gray-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-2">
                                    {c}
                                    <button type="button" onClick={() => removeColor(c)} className="hover:text-red-500">×</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                value={newColor}
                                onChange={(e) => setNewColor(e.target.value)}
                                className="flex-1 border border-gray-100 bg-gray-50/50 px-4 py-2 rounded-xl focus:ring-2 focus:ring-black outline-none transition sm:text-sm"
                                placeholder="Add color (e.g. Ivory, Jet Black)"
                            />
                            <button
                                type="button"
                                onClick={addColor}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 transition text-sm font-semibold"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                </div>

                {/* Right Column: Images */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Product Images</label>
                            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploadingImages ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400'}`}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {uploadingImages ? (
                                        <Loader2 size={24} className="animate-spin text-gray-400 mb-2" />
                                    ) : (
                                        <UploadCloud size={24} className="text-gray-400 mb-2" />
                                    )}
                                    <p className="text-xs text-gray-500 font-medium">
                                        {uploadingImages ? 'Uploading files securely...' : 'Click to select JPG, PNG, WEBP files'}
                                    </p>
                                </div>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/png, image/jpeg, image/webp" 
                                    className="hidden" 
                                    onChange={handleFileUpload}
                                    disabled={uploadingImages}
                                />
                            </label>
                        </div>

                        <div className="space-y-4">
                            {form.images.filter(img => img.url).length === 0 ? (
                                <p className="text-xs text-gray-400 italic text-center py-4">No images uploaded yet.</p>
                            ) : form.images.filter(img => img.url).map((img, index) => (
                                <div key={index} className="p-4 border border-gray-100 rounded-xl space-y-3 relative group bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                                            <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-gray-400 truncate mb-2" title={img.url}>{img.url.split('/').pop()}</p>
                                            <label className="flex items-center gap-2 cursor-pointer w-fit">
                                                <input
                                                    type="radio"
                                                    checked={img.isPrimary}
                                                    onChange={() => setPrimaryImage(index)}
                                                    className="w-3 h-3 accent-black"
                                                />
                                                <span className="text-[10px] uppercase tracking-wider text-gray-900 font-bold">Primary Image</span>
                                            </label>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImageField(index)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition shrink-0"
                                            title="Remove image"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/products')}
                            className="flex-1 border border-gray-300 py-4 rounded-2xl font-semibold hover:border-black transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-black text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
