import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  PoundSterling, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  TrendingUp, 
  Calendar, 
  ShoppingBag,
  Sparkles,
  MapPin,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { ServiceDefinition, User, ServiceProvider, ServiceCategory } from '../types';

interface AdminDashboardProps {
  onServiceOnboarded: () => void;
  onLogout?: () => void;
}

export default function AdminDashboard({ onServiceOnboarded, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'services' | 'providers' | 'users'>('stats');
  
  // Data State
  const [stats, setStats] = useState<any>(null);
  const [services, setServices] = useState<ServiceDefinition[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Loading & Action state
  const [loading, setLoading] = useState(true);
  const [onboardingService, setOnboardingService] = useState(false);
  const [editingService, setEditingService] = useState<ServiceDefinition | null>(null);

  // New Service Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('cleaning');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('40');
  const [image, setImage] = useState('');
  const [inclusions, setInclusions] = useState<string[]>(['UK Standard Certified tools included']);
  const [exclusions, setExclusions] = useState<string[]>(['Pre-existing system replacement']);
  const [estimatedTime, setEstimatedTime] = useState('1.5 hours');
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Parallel fetch to accelerate
      const [resStats, resServices, resProviders, resUsers] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/services'),
        fetch('/api/providers'),
        fetch('/api/users')
      ]);

      setStats(await resStats.json());
      setServices(await resServices.json());
      setProviders(await resProviders.json());
      setUsers(await resUsers.json());
    } catch (e) {
      console.error('Error fetching admin backend stats:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, category, description, basePrice, image, inclusions, exclusions, estimatedTime
        })
      });
      if (res.ok) {
        setOnboardingService(false);
        // Clear forms
        setName('');
        setDescription('');
        setInclusions(['UK Standard Certified tools included']);
        setExclusions(['Pre-existing system replacement']);
        fetchAdminData();
        onServiceOnboarded();
      }
    } catch (err) {
      console.error('Error onboarding service:', err);
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      const res = await fetch(`/api/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService)
      });
      if (res.ok) {
        setEditingService(null);
        fetchAdminData();
        onServiceOnboarded();
      }
    } catch (err) {
      console.error('Error editing service:', err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      fetchAdminData();
      onServiceOnboarded();
    }
  };

  const handleToggleServiceStatus = async (service: ServiceDefinition) => {
    await fetch(`/api/services/${service.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !service.isActive })
    });
    fetchAdminData();
  };

  const handleProviderStatusChange = async (providerId: string, status: 'approved' | 'rejected', dbsStatus?: string) => {
    await fetch(`/api/providers/${providerId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, dbsStatus })
    });
    fetchAdminData();
  };

  const handleDeleteProvider = async (id: string) => {
    if (confirm('Remove this service provider from the UK Network?')) {
      await fetch(`/api/providers/${id}`, { method: 'DELETE' });
      fetchAdminData();
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Delete this user account?')) {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      fetchAdminData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" id="admin-dashboard-container">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
          <div>
            <h1 className="text-3xl font-black text-black tracking-tight flex items-center gap-2">
              <Settings className="h-7 w-7" />
              <span>Marketplace Admin Panel</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage services catalog, review provider compliance NVQs/DBS, and audit payments and referrals.
            </p>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-all border border-red-100 shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              Sign Out Admin Panel
            </button>
          )}
        </div>

        {/* Tab triggers */}
        <div className="flex bg-gray-100 p-1 rounded-xl" id="admin-tabs">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'stats' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
            }`}
          >
            Usage Analytics
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'services' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
            }`}
          >
            Services Catalog
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'providers' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
            }`}
          >
            Providers Audit ({providers.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'users' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
            }`}
          >
            Registered Users ({users.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent" />
          <p className="text-sm text-gray-500 mt-2">Loading Admin metrics database...</p>
        </div>
      ) : (
        <>
          {activeTab === 'stats' && stats && (
            <div className="space-y-8" id="admin-analytics-view">
              {/* Counters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Booking Value</span>
                    <PoundSterling className="h-5 w-5 text-black" />
                  </div>
                  <div className="text-2xl font-black text-black mt-2">£{stats.paymentsReceived}</div>
                  <div className="text-[10px] text-gray-500 font-bold mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-green-600">VAT (20%) included</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Services Consumed</span>
                    <ShoppingBag className="h-5 w-5 text-black" />
                  </div>
                  <div className="text-2xl font-black text-black mt-2">{stats.servicesConsumed}</div>
                  <div className="text-[10px] text-gray-500 font-bold mt-1">
                    {stats.totalBookings} Total bookings processed
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Services Cataloged</span>
                    <Briefcase className="h-5 w-5 text-black" />
                  </div>
                  <div className="text-2xl font-black text-black mt-2">{stats.servicesOffered}</div>
                  <div className="text-[10px] text-gray-500 font-bold mt-1">Active categories in UK</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Pending Approvals</span>
                    <ShieldCheck className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-amber-600 mt-2">{stats.pendingApprovals}</div>
                  <div className="text-[10px] text-gray-500 font-bold mt-1">Provider compliance dbs queues</div>
                </div>
              </div>

              {/* Graphical Trend of daily registrations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Users Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                  <h3 className="text-sm font-black text-black tracking-tight uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-black" />
                    <span>Customer Registration Trend (Last 7 Days)</span>
                  </h3>
                  <div className="h-48 flex items-end justify-between gap-2 pt-6">
                    {stats.dailyRegisteredUsers.map((day: any, i: number) => {
                      const heightPct = (day.count / 10) * 100; // Cap at 10 for visualization
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div className="text-[10px] font-bold text-gray-400">{day.count}</div>
                          <div 
                            style={{ height: `${Math.max(10, heightPct)}%` }} 
                            className="w-full bg-black/85 rounded-t-lg transition-all hover:bg-black"
                          />
                          <div className="text-[10px] font-bold text-gray-500 truncate w-full text-center">{day.date}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Providers Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                  <h3 className="text-sm font-black text-black tracking-tight uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-black" />
                    <span>Service Provider Onboardings Trend</span>
                  </h3>
                  <div className="h-48 flex items-end justify-between gap-2 pt-6">
                    {stats.dailyRegisteredProviders.map((day: any, i: number) => {
                      const heightPct = (day.count / 10) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div className="text-[10px] font-bold text-gray-400">{day.count}</div>
                          <div 
                            style={{ height: `${Math.max(10, heightPct)}%` }} 
                            className="w-full bg-slate-400 rounded-t-lg transition-all hover:bg-black"
                          />
                          <div className="text-[10px] font-bold text-gray-500 truncate w-full text-center">{day.date}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Extra Revenue Channels Recommendation Card */}
              <div className="bg-gray-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm">Revenue Booster Tip</span>
                  <h4 className="text-lg font-black tracking-tight">Active Platform Subscription Restriction</h4>
                  <p className="text-xs text-gray-400 max-w-xl">
                    Both users and providers enjoy 10 free service bookings. After 10 services, direct customer-provider contacts are hidden. A subscription tier (£19.99/mo) unlocks the secure messaging, in-app scheduling, and automatic VAT invoicing portal.
                  </p>
                </div>
                <div className="bg-white/10 border border-white/20 p-4 rounded-xl text-center shrink-0">
                  <span className="text-xs font-semibold text-gray-300 block">Active Subscriptions</span>
                  <span className="text-2xl font-black text-amber-400">{stats.activeSubscriptions} Members</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6" id="admin-services-catalog">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-extrabold text-black tracking-tight">Onboard & Manage Service Catalog</h3>
                <button
                  onClick={() => setOnboardingService(!onboardingService)}
                  className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Onboard New Service</span>
                </button>
              </div>

              {/* Onboard Service Form */}
              {onboardingService && (
                <form onSubmit={handleCreateService} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 max-w-2xl">
                  <h4 className="text-sm font-black text-black uppercase tracking-wider">New Service Blueprint</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Service Name</label>
                      <input
                        type="text" required placeholder="e.g. Sofa Cleaning" value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Category</label>
                      <select
                        value={category} onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                        className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                      >
                        <option value="cooking">Cooking</option>
                        <option value="women_salon">Women Salon</option>
                        <option value="spa_beauty">SPA & Beauty</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="painting">Painting</option>
                        <option value="gardening">Gardening</option>
                        <option value="carpenter">Carpenter</option>
                        <option value="electrical_fitting">Electrical</option>
                        <option value="appliance_repair">Appliance Repair</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Service Description</label>
                    <textarea
                      rows={2} required placeholder="What does this service entail?" value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Base Price (£)</label>
                      <input
                        type="number" required value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Estimated Duration</label>
                      <input
                        type="text" required value={estimatedTime}
                        onChange={(e) => setEstimatedTime(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Image URL (Unsplash/Web)</label>
                    <input
                      type="text" placeholder="https://..." value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-black hover:bg-gray-800 text-white font-bold text-xs px-4 py-2 rounded-lg"
                    >
                      Publish to UK Catalog
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnboardingService(false)}
                      className="text-xs text-gray-500 hover:text-black font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Editing Service Form */}
              {editingService && (
                <form onSubmit={handleEditService} className="bg-white p-6 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs space-y-4 max-w-2xl">
                  <h4 className="text-sm font-black text-black uppercase tracking-wider flex items-center gap-1">
                    <Edit className="h-4 w-4 text-amber-600" />
                    <span>Edit Service: {editingService.name}</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Service Name</label>
                      <input
                        type="text" required value={editingService.name}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Base Price (£)</label>
                      <input
                        type="number" required value={editingService.basePrice}
                        onChange={(e) => setEditingService({ ...editingService, basePrice: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Description</label>
                    <textarea
                      rows={2} required value={editingService.description}
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-lg"
                    >
                      Update Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="text-xs text-gray-500 hover:text-black font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Services List Table */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Service Image & Title</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">UK Category</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Base Cost</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Duration</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Status</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((srv) => (
                      <tr key={srv.id} className="border-b border-gray-100 text-xs hover:bg-gray-50/50">
                        <td className="p-4 flex items-center gap-3">
                          <img src={srv.image} alt={srv.name} className="h-10 w-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                          <div>
                            <span className="font-extrabold text-black block leading-tight">{srv.name}</span>
                            <span className="text-[10px] text-gray-400 truncate max-w-xs block">{srv.description}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 font-semibold uppercase text-[10px]">{srv.category.replace('_', ' ')}</td>
                        <td className="p-4 font-bold text-black">£{srv.basePrice}</td>
                        <td className="p-4 text-gray-500">{srv.estimatedTime}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleServiceStatus(srv)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              srv.isActive ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-600'
                            }`}
                          >
                            {srv.isActive ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2 shrink-0">
                          <button
                            onClick={() => setEditingService(srv)}
                            className="p-1 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(srv.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'providers' && (
            <div className="space-y-6" id="admin-providers-audit">
              <h3 className="text-lg font-extrabold text-black tracking-tight">Compliance & DBS Background Checks</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Service providers in the UK must comply with local vocational licensing and background check norms. Below are registered providers and their DBS status. You can view their uploaded AI credentials scanners or manually toggle approvals.
              </p>

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Name & Contact</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">City / Category</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Rate</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Registered Qualifications</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">DBS Status</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider text-right">Marketplace Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((prov) => (
                      <tr key={prov.id} className="border-b border-gray-100 text-xs hover:bg-gray-50/50">
                        <td className="p-4">
                          <span className="font-extrabold text-black block leading-none">{prov.name}</span>
                          <span className="text-[10px] text-gray-500 block mt-1">{prov.email}</span>
                          <span className="text-[10px] text-gray-400 block">{prov.phone}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-900 font-bold block">{prov.city}</span>
                          <span className="text-[10px] text-gray-500 uppercase">{prov.category.replace('_', ' ')}</span>
                        </td>
                        <td className="p-4 font-bold text-black">£{prov.pricing}/session</td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-700 block leading-tight">{prov.certificationName}</span>
                          {prov.aiVerificationNotes && (
                            <span className="text-[9px] text-amber-700 font-bold block mt-1 bg-amber-50 p-1.5 border border-amber-100 rounded-md">
                              AI Scanner: {prov.aiVerificationNotes}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            prov.dbsStatus === 'verified' ? 'bg-green-50 text-green-700 border border-green-200' :
                            prov.dbsStatus === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' :
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {prov.dbsStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right space-y-1.5">
                          <div className="flex justify-end gap-1">
                            {prov.status !== 'approved' ? (
                              <button
                                onClick={() => handleProviderStatusChange(prov.id, 'approved', 'verified')}
                                className="bg-green-600 hover:bg-green-700 text-white p-1 rounded-md text-xs font-bold flex items-center gap-0.5 px-2 py-1 cursor-pointer"
                              >
                                <Check className="h-3.5 w-3.5" /> Approve
                              </button>
                            ) : (
                              <span className="text-green-700 font-bold flex items-center gap-0.5 text-[11px] bg-green-50 border border-green-100 px-2 py-1 rounded-md">
                                <Check className="h-3.5 w-3.5" /> Approved Network
                              </span>
                            )}
                            <button
                              onClick={() => handleDeleteProvider(prov.id)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6" id="admin-users-list">
              <h3 className="text-lg font-extrabold text-black tracking-tight">Registered Customers Database</h3>
              
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Client ID / Name</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Contact Credentials</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Wallet Balance</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Bookings Placed</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Referral Code / Count</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100 text-xs hover:bg-gray-50/50">
                        <td className="p-4">
                          <span className="font-bold text-gray-500 text-[10px] block leading-none">{u.id}</span>
                          <span className="font-extrabold text-black block mt-1 leading-none">{u.name}</span>
                          <span className="text-[9px] text-gray-400 block mt-1">Joined: {new Date(u.registeredAt).toLocaleDateString()}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-900 font-semibold block">{u.email}</span>
                          <span className="text-[10px] text-gray-500">{u.phone}</span>
                        </td>
                        <td className="p-4 font-bold text-black">£{u.walletBalance.toFixed(2)}</td>
                        <td className="p-4 text-center font-bold text-gray-600">{u.bookingsCount}</td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-black px-2 py-0.5 rounded-sm font-mono font-bold text-[10px]">{u.referralCode}</span>
                          <span className="text-[10px] text-gray-500 block mt-1">{u.referralsCount} successful referrals</span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
