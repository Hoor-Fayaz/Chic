"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useToastStore } from "@/store/toastStore";

export default function PaymentForm({ onPaymentSuccess, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const { showToast } = useToastStore();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      showToast(error.message, "error");
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      showToast("Payment verified!", "success");
      onPaymentSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-6 border border-gray-100 rounded-[1.5rem] bg-gray-50/30">
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 block">Card Details</label>
        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <CardElement options={{
                hidePostalCode: true,
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#111827',
                        '::placeholder': { color: '#9CA3AF' },
                        fontFamily: 'Inter, system-ui, sans-serif',
                    },
                    invalid: { color: '#EF4444' },
                }
            }} />
        </div>
      </div>
      
      <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-tighter">
        Secure processing via Stripe. We do not store your card details.
      </p>

      <button
        type="submit"
        disabled={processing || !stripe}
        className="w-full bg-black text-white py-5 rounded-[1.5rem] font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-black/10 hover:bg-gray-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {processing ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Pay and Complete Order"}
      </button>
    </form>
  );
}
