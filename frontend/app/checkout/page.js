"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { placeOrder, apiFetch, fetchPublicSettings } from "@/lib/api";
import Link from "next/link";
import { ChevronDown, ChevronRight, Check, CreditCard, Truck, Mail, MapPin, Loader2 } from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import StripeWrapper from "@/components/checkout/StripeWrapper";
import PaymentForm from "@/components/checkout/PaymentForm";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart || []);
  const user = useAuthStore((state) => state.user);
  const loadingCart = useCartStore((state) => state.loading);
  const clearCart = useCartStore((state) => state.clearCart);
  const { showToast } = useToastStore();

  const [step, setStep] = useState(1); // 1: Email, 2: Shipping, 3: Payment
  const [loading, setLoading] = useState(false);
  const [stripeConfig, setStripeConfig] = useState({ clientSecret: "", publishableKey: "" });
  const [checkoutSettings, setCheckoutSettings] = useState({
      shippingLimit: 5000,
      shippingDefault: 250,
      taxPercentage: 15,
      fbrFee: 1
  });

  const [formData, setFormData] = useState({
    email: user?.email || "",
    fullName: user?.name || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    paymentMethod: "cod",
  });

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price || item.product?.price || 0) * item.quantity, 0);
  const shippingFee = subtotal >= checkoutSettings.shippingLimit ? 0 : checkoutSettings.shippingDefault;
  const salesTax = Math.round(subtotal * (checkoutSettings.taxPercentage / 100));
  const total = subtotal + shippingFee + salesTax + checkoutSettings.fbrFee;


  useEffect(() => {
    // Fetch Dynamic Settings
    fetchPublicSettings().then(res => {
        if (res.success && res.data?.checkout) {
            setCheckoutSettings(res.data.checkout);
        }
    }).catch(err => console.error("Failed to load checkout settings", err));

    if (!loadingCart && cart.length === 0) {
      router.push("/shop");
    }
    if (user && !formData.email) {
        setFormData(prev => ({...prev, email: user.email, fullName: user.name}));
    }
  }, [cart, loadingCart, user, router, formData.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = (s) => {
    if (s === 1) {
        if (!formData.email || !formData.email.includes("@")) {
            showToast("Please enter a valid email", "info");
            return false;
        }
    }
    if (s === 2) {
        if (!formData.fullName || !formData.phone || !formData.street || !formData.city) {
            showToast("Please fill in all required shipping fields", "info");
            return false;
        }
    }
    return true;
  };

  const fetchStripeIntent = async () => {
    try {
        setLoading(true);
        const res = await apiFetch("/orders/stripe/intent", {
            method: "POST",
            body: { amount: total }
        });
        if (res.success) {
            setStripeConfig({ clientSecret: res.data.clientSecret, publishableKey: res.data.publishableKey });
        }
    } catch (error) {
        showToast("Payment system unavailable", "error");
    } finally {
        setLoading(false);
    }
  };

  const handlePlaceOrder = async (stripePaymentIntent = null) => {
    if (!validateStep(2)) return;

    try {
      setLoading(true);
      const payload = {
        items: cart.map(item => ({
          product: item.product?._id,
          name: item.product?.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unitPrice: item.price || item.product?.price,
          totalPrice: (item.price || item.product?.price) * item.quantity,
          imageUrl: item.product?.images?.[0]?.url
        })),

        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: "Pakistan"
        },
        paymentMethod: formData.paymentMethod,
        stripePaymentIntentId: stripePaymentIntent?.id,
        paymentStatus: stripePaymentIntent ? 'paid' : 'pending',
        subtotal,
        shippingFee,
        tax: salesTax,
        fbrFee: checkoutSettings.fbrFee,
        total,
      };

      const res = await placeOrder(payload);
      if (res.success) {
        clearCart();
        showToast("Success! Order placed.", "success");
        router.push(`/profile?orderId=${res.data.order._id}`);
      }
    } catch (err) {
      console.error("Order error", err);
      showToast(err.message || "Failed to place order", "error");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;


  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-10">


      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Checkout Steps */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* STEP 1: ENTER EMAIL */}
          <div className={`bg-white rounded-[2rem] p-8 shadow-sm transition-all duration-500 overflow-hidden ${step === 1 ? 'ring-2 ring-black' : 'opacity-80'}`}>
            <div 
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => setStep(1)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step > 1 ? 'bg-black border-black text-white' : 'border-gray-200'}`}>
                {step > 1 ? <Check size={18} /> : "1"}
              </div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">Enter Email</h2>
            </div>
            
            {step === 1 && (
              <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                {!user && (
                    <p className="text-xs text-gray-500 font-medium">
                        Already have an account? <Link href="/auth/login" className="text-black underline font-bold">SIGN IN</Link>
                    </p>
                )}
                <div className="relative group">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute -top-2 left-4 bg-white px-1">Email*</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-100 bg-gray-50/50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all font-medium"
                    placeholder="your@email.com"
                    disabled={!!user}
                  />
                </div>
                <button 
                  onClick={() => validateStep(1) && setStep(2)}
                  className="bg-black text-white px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-black/10"
                >
                  Proceed to Shipping
                </button>
              </div>
            )}
            {step > 1 && (
                <div className="mt-2 ml-14 text-xs font-semibold text-gray-400">{formData.email}</div>
            )}
          </div>

          {/* STEP 2: SHIPPING */}
          <div className={`bg-white rounded-[2rem] p-8 shadow-sm transition-all duration-500 overflow-hidden ${step === 2 ? 'ring-2 ring-black' : 'opacity-80'}`}>
            <div 
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => step >= 2 && setStep(2)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step > 2 ? 'bg-black border-black text-white' : 'border-gray-200'}`}>
                {step > 2 ? <Check size={18} /> : "2"}
              </div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">Shipping</h2>
              {step < 2 && <ChevronDown size={18} className="ml-auto text-gray-400" />}
            </div>

            {step === 2 && (
              <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute -top-2 left-4 bg-white px-1">Full Name*</label>
                    <input 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-100 bg-gray-50/50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all font-medium"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute -top-2 left-4 bg-white px-1">Phone Number*</label>
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-100 bg-gray-50/50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute -top-2 left-4 bg-white px-1">Street Address*</label>
                  <input 
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full border border-gray-100 bg-gray-50/50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all font-medium"
                    placeholder="House number, apartment, suite..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute -top-2 left-4 bg-white px-1">City*</label>
                    <input 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border border-gray-100 bg-gray-50/50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all font-medium"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute -top-2 left-4 bg-white px-1">State/Province</label>
                    <input 
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full border border-gray-100 bg-gray-50/50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all font-medium"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute -top-2 left-4 bg-white px-1">Postal Code</label>
                    <input 
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full border border-gray-100 bg-gray-50/50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => validateStep(2) && setStep(3)}
                  className="bg-black text-white px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-black/10"
                >
                  Confirm Address
                </button>
              </div>
            )}
            {step > 2 && (
                <div className="mt-2 ml-14 text-xs font-semibold text-gray-400">{formData.street}, {formData.city}</div>
            )}
          </div>

          {/* STEP 3: PAYMENT */}
          <div className={`bg-white rounded-[2rem] p-8 shadow-sm transition-all duration-500 overflow-hidden ${step === 3 ? 'ring-2 ring-black' : 'opacity-80'}`}>
            <div 
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => step >= 3 && setStep(3)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 border-gray-200`}>
                3
              </div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">Payment</h2>
              {step < 3 && <ChevronDown size={18} className="ml-auto text-gray-400" />}
            </div>

            {step === 3 && (
              <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="space-y-4">
                  <div 
                    onClick={() => setFormData(p => ({...p, paymentMethod: 'cod'}))}
                    className={`flex items-center justify-between p-6 border rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-black'}`}
                  >
                    <div className="flex items-center gap-4">
                      <Truck size={20} />
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide">Cash on Delivery</p>
                        <p className="text-[11px] text-gray-500">Pay when your order arrives at your doorstep.</p>
                      </div>
                    </div>
                    {formData.paymentMethod === 'cod' && <div className="w-4 h-4 rounded-full bg-black ring-4 ring-gray-100" />}
                  </div>

                  <div 
                    onClick={() => setFormData(p => ({...p, paymentMethod: 'card'}))}
                    className={`flex items-center justify-between p-6 border rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-black'}`}
                  >
                    <div className="flex items-center gap-4">
                      <CreditCard size={20} />
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide">Credit / Debit Card</p>
                        <p className="text-[11px] text-gray-500">Secure online payment via Stripe.</p>
                      </div>
                    </div>
                    {formData.paymentMethod === 'card' && <div className="w-4 h-4 rounded-full bg-black ring-4 ring-gray-100" />}
                  </div>
                </div>

                {/* Card Payment Form */}
                {formData.paymentMethod === 'card' && (
                    <div className="pt-4 border-t border-gray-50 animate-in fade-in duration-700">
                        {!stripeConfig.clientSecret ? (
                            <button 
                                onClick={fetchStripeIntent}
                                disabled={loading}
                                className="w-full bg-black text-white py-5 rounded-[1.5rem] font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-black/10 hover:bg-gray-900 transition-all flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
                                {loading ? "Initializing..." : "Proceed to Secure Payment"}
                            </button>
                        ) : (
                            <StripeWrapper clientSecret={stripeConfig.clientSecret}>
                                <PaymentForm 
                                    clientSecret={stripeConfig.clientSecret}
                                    onPaymentSuccess={(intent) => handlePlaceOrder(intent)} 
                                />
                            </StripeWrapper>
                        )}
                    </div>
                )}

                {formData.paymentMethod === 'cod' && (
                    <>
                        <div className="bg-gray-50 p-6 rounded-2xl text-[11px] text-gray-500 leading-relaxed font-medium">
                            By clicking "Complete Order", you agree to our Terms of Service and Refund Policy. We will send an order confirmation email to {formData.email}.
                        </div>

                        <button 
                            onClick={() => handlePlaceOrder()}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-5 rounded-[1.5rem] font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? "Processing Order..." : "Complete Order"}
                        </button>
                    </>
                )}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm sticky top-8 space-y-8">
            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">Your Bag ({cart.length})</h2>
                <span className="text-sm font-bold text-gray-900">PKR {total.toLocaleString()}</span>
            </div>

            {/* Item List */}
            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                        <div className="w-20 aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden shrink-0">
                            <img 
                                src={item.product?.images?.[0]?.url || item.product?.images?.[0]} 
                                alt={item.product?.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col justify-between py-1">
                            <div>
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tight">{item.product?.name}</h3>
                                <p className="text-xs font-medium text-gray-900 mt-1">PKR {item.product?.price?.toLocaleString()}</p>
                            </div>
                            <div className="text-[10px] space-y-0.5 font-bold uppercase text-gray-400 tracking-widest">
                                <p>Size: {item.size}</p>
                                <p>Qty: {item.quantity}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Voucher */}
            <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Redeem Your Voucher</h3>
                <div className="flex gap-2">
                    <input 
                        placeholder="Enter Code"
                        className="flex-1 border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                    <button className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">Apply</button>
                </div>
            </div>

            {/* Calculations */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Order Summary</h3>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                        <span>Price incl. tax</span>
                        <span>PKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                        <span>Shipping</span>
                        <span className="text-green-600 font-bold">{shippingFee === 0 ? "FREE" : `PKR ${shippingFee}`}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 font-medium tracking-tight">
                        <span>Sales Tax ({checkoutSettings.taxPercentage}%)</span>
                        <span>PKR {salesTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 font-medium tracking-tight">
                        <span>FBR service charges</span>
                        <span>PKR {checkoutSettings.fbrFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-900 pt-4 border-t border-gray-50">

                        <span className="uppercase tracking-[0.2em] text-[10px]">Total to Pay</span>
                        <span>PKR {total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <p className="text-[9px] text-gray-400 text-center leading-relaxed italic">
                Secure checkout powered by Chic Boutique. Your data is protected.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
