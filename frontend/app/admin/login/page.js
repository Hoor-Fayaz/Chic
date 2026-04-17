import AdminLoginForm from "@/components/forms/AdminLoginForm";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Atelier Access | Jannah Chic Admin",
  description: "Secure administrative portal for Jannah Chic boutique management.",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.02]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-black blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-black blur-[120px]" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center gap-12">
        {/* Boutique Branding */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shadow-xl shadow-black/10">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-gray-900 tracking-tight">JANNAH CHIC</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mt-2">Boutique Management System</p>
          </div>
        </div>

        {/* Specialized Admin Form */}
        <AdminLoginForm />

        {/* Footer Link (Return to Site) */}
        <div className="animate-in fade-in duration-1000 delay-500">
          <a 
            href="/" 
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            &larr; Return to Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
