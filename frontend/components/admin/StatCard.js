import { LucideIcon } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, trend, color = "black" }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-9 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/40 transition-all duration-700 group relative overflow-hidden">
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 bg-gray-50 text-gray-400 group-hover:bg-black group-hover:text-white group-hover:rotate-12`}>
          <Icon size={28} />
        </div>
        {trend && (
          <div className="text-right">
             <span className={`text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
            <p className="text-[8px] text-gray-300 uppercase tracking-widest mt-2 font-bold italic">vs last month</p>
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-300 mb-2 group-hover:text-gray-400 transition-colors">{title}</p>
        <h3 className="text-4xl font-display tracking-tight text-gray-900 group-hover:scale-[1.02] transition-transform origin-left duration-500">
            {value}
        </h3>
      </div>

      {/* Decorative background element */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000 grayscale">
         <Icon size={120} />
      </div>
    </div>
  );
}
