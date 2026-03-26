"use client";

import { useState, useEffect } from "react";
import { fetchUsers, updateUserStatus } from "@/lib/api";
import { 
    Users, 
    Shield, 
    ShieldAlert, 
    UserCheck, 
    UserX, 
    Search,
    Mail,
    MoreVertical,
    Loader2
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers({ limit: 100 });
      setUsers(data.data?.items || []);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      const newStatus = status === "active" ? "blocked" : "active";
      await updateUserStatus(id, newStatus);
      setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error("Failed to update user status", error);
      alert("Failed to update user status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4" />
        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Authenticating Directory...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-display tracking-tight text-gray-900">Customer Circle</h1>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mt-2">Manage your boutique community</p>
        </div>
        <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
                placeholder="Search by Name or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
            />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 border-b border-gray-50">
                        <th className="py-6 px-8">Member Profile</th>
                        <th className="py-6 px-4">Privileges</th>
                        <th className="py-6 px-4">Status</th>
                        <th className="py-6 px-8 text-right">Moderation</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredUsers.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="py-24 text-center">
                                <Users size={48} className="mx-auto text-gray-100 mb-4" />
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest font-display italic">No members found</p>
                            </td>
                        </tr>
                    ) : (
                        filteredUsers.map((user) => (
                            <tr key={user._id} className="group hover:bg-gray-50/50 transition-all duration-500">
                                <td className="py-8 px-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold uppercase text-sm group-hover:bg-black group-hover:text-white transition-colors duration-500">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{user.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Mail size={12} className="text-gray-300" />
                                                <span className="text-[10px] text-gray-400 font-medium">{user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-8 px-4">
                                    <div className="flex items-center gap-2">
                                        {user.role === 'admin' ? (
                                            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
                                                <Shield size={12} />
                                                <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Administrator</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 bg-gray-50 text-gray-400 px-3 py-1 rounded-full">
                                                <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Member</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="py-8 px-4">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                                        user.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        {user.status}
                                    </div>
                                </td>
                                <td className="py-8 px-8 text-right">
                                    {user.role !== 'admin' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(user._id, user.status)}
                                            disabled={updatingId === user._id}
                                            className={`p-3 rounded-xl transition-all ${
                                                user.status === 'active' 
                                                    ? 'text-gray-300 hover:text-red-500 hover:bg-red-50' 
                                                    : 'text-gray-300 hover:text-green-600 hover:bg-green-50'
                                            }`}
                                            title={user.status === 'active' ? 'Restrict Access' : 'Restore Access'}
                                        >
                                            {updatingId === user._id ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : user.status === 'active' ? (
                                                <UserX size={18} />
                                            ) : (
                                                <UserCheck size={18} />
                                            )}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <p className="mt-12 text-[9px] text-gray-400 text-center leading-relaxed italic max-w-lg mx-auto uppercase tracking-tighter opacity-60">
        Boutique membership directory. Moderation actions are logged for security oversight. 
        Restricted members will be unable to finalize checkout or access community perks.
      </p>
    </div>
  );
}