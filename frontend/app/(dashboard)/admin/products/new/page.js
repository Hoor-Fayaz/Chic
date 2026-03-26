'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, fetchCategories } from '@/lib/api';

export default function NewProductPage() {
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



    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data.data?.items || []);
            } catch (error) {
                console.error('Failed to load categories', error);
            }
        };
        loadCategories();
    }, []);

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

    const handleImageChange = (index, field, value) => {
        const newImages = [...form.images];
        newImages[index][field] = value;
        setForm({ ...form, images: newImages });
    };

    const addImageField = () => {
        setForm({
            ...form,
            images: [...form.images, { url: '', alt: '', isPrimary: false }],
        });
    };

    const removeImageField = (index) => {
        if (form.images.length === 1) return;
        const newImages = form.images.filter((_, i) => i !== index);
        // Ensure at least one is primary if we removed the primary one
        if (!newImages.some(img => img.isPrimary)) {
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


    // ✅ auto slug generator
    const slugify = (text) =>
        text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...form,
                slug: form.slug || slugify(form.name),
                price: Number(form.price),
                originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
                discountPercent: form.discountPercent ? Number(form.discountPercent) : undefined,
                stock: Number(form.stock),
                images: form.images.filter((img) => img.url), // remove empty images
            };

            // Strip empty optional string fields so MongoDB doesn't treat '' as a real value
            // (important for unique fields like `sku` — empty string != null)
            const optionalStringFields = ['category', 'sku', 'slug', 'fabric', 'fit', 'composition', 'sizeChart'];
            for (const field of optionalStringFields) {
                if (!payload[field] || String(payload[field]).trim() === '') {
                    delete payload[field];
                }
            }

            // Slug is required — re-compute from name if it got deleted above
            if (!payload.slug) {
                payload.slug = slugify(form.name);
            }

            await createProduct(payload);
            router.push('/admin/products');
        } catch (error) {
            console.error('Failed to create product', error);
            alert(`Failed to create product: ${error?.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-display font-semibold mb-8 text-gray-900">Add New Product</h1>

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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-display uppercase tracking-wider text-[11px]">Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border border-gray-100 bg-gray-50/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-display uppercase tracking-wider text-[11px]">Size Chart Image URL</label>
                        <input
                            name="sizeChart"
                            value={form.sizeChart}
                            onChange={handleChange}
                            className="w-full border border-gray-100 bg-gray-50/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                            placeholder="https://..."
                        />
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
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">Product Images</label>
                            <button
                                type="button"
                                onClick={addImageField}
                                className="text-xs bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-800 transition"
                            >
                                + Add Image
                            </button>
                        </div>

                        <div className="space-y-4">
                            {form.images.map((img, index) => (
                                <div key={index} className="p-4 border border-gray-100 rounded-xl space-y-3 relative group">
                                    <div className="flex items-center gap-3">
                                        <input
                                            value={img.url}
                                            onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                                            className="flex-1 border border-gray-200 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-black"
                                            placeholder="Image URL"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImageField(index)}
                                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"
                                            title="Remove image"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={img.isPrimary}
                                                onChange={() => setPrimaryImage(index)}
                                                className="w-3 h-3 accent-black"
                                            />
                                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Primary Image</span>
                                        </label>
                                        
                                        {img.url && (
                                            <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-100 ml-auto">
                                                <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Product...' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}