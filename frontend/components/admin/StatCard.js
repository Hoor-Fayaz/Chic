import { LucideIcon } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, trend, color = "black" }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 bg-gray-50 text-gray-400 group-hover:bg-black group-hover:text-white`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}
      </div>
      
      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-1">{title}</p>
      <h3 className="text-3xl font-display tracking-tight text-gray-900">
        {value}
      </h3>
    </div>
  );
}
