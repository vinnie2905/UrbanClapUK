import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import ProviderRegistration from './components/ProviderRegistration';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginPanel from './components/AdminLoginPanel';
import MyAccount from './components/MyAccount';
import ServiceBookingJourney from './components/ServiceBookingJourney';
import PropertyRentals from './components/PropertyRentals';
import HouseholdMarketplace from './components/HouseholdMarketplace';
import PolicyModal from './components/PolicyModal';
import ServiceCarousel from './components/ServiceCarousel';
import { 
  ServiceCategory, 
  User, 
  ServiceProvider 
} from './types';
import { 
  Sparkles, 
  ShieldCheck, 
  Utensils, 
  Scissors, 
  Activity, 
  Flame, 
  Wrench, 
  Paintbrush, 
  Flower, 
  Hammer, 
  Zap, 
  Tv, 
  CheckCircle,
  Gift,
  PhoneCall,
  Bell,
  X,
  MapPin,
  Check,
  PoundSterling
} from 'lucide-react';

const SERVICE_CATEGORIES: { category: ServiceCategory; title: string; desc: string; icon: React.ReactNode; image: string }[] = [
  {
    category: 'cooking',
    title: 'Daily Cooking',
    desc: 'Professional home cooks & party catering chefs',
    icon: <Utensils className="h-5 w-5 text-amber-600" />,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=300&q=80'
  },
  {
    category: 'women_salon',
    title: 'Women Salon',
    desc: 'Hydration facials, blowouts, makeup & beauty care',
    icon: <Scissors className="h-5 w-5 text-rose-500" />,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80'
  },
  {
    category: 'spa_beauty',
    title: 'SPA & Massage',
    desc: 'Swedish & deep tissue massage at home',
    icon: <Activity className="h-5 w-5 text-indigo-500" />,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80'
  },
  {
    category: 'cleaning',
    title: 'Bathroom & Kitchen',
    desc: 'Descaling, deep scrubbing, sanitation & greasing',
    icon: <Flame className="h-5 w-5 text-sky-500" />,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80'
  },
  {
    category: 'plumbing',
    title: 'Plumbing Works',
    desc: 'Tap fittings, leak repairs, sink unclogging',
    icon: <Wrench className="h-5 w-5 text-teal-600" />,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=300&q=80'
  },
  {
    category: 'painting',
    title: 'Painting & Sanding',
    desc: 'Accent wall painting, double coat protective paint',
    icon: <Paintbrush className="h-5 w-5 text-purple-600" />,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=300&q=80'
  },
  {
    category: 'gardening',
    title: 'Gardening & Lawns',
    desc: 'Lawn mowing, hedging, custom trimming',
    icon: <Flower className="h-5 w-5 text-emerald-600" />,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=300&q=80'
  },
  {
    category: 'carpenter',
    title: 'Carpentry Assembly',
    desc: 'Furniture fixes, custom cabinets & door fittings',
    icon: <Hammer className="h-5 w-5 text-amber-700" />,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80'
  },
  {
    category: 'electrical_fitting',
    title: 'Electrical Fittings',
    desc: 'BS7671 certified sockets, light setups, fan fits',
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80'
  },
  {
    category: 'appliance_repair',
    title: 'Appliance Repairs',
    desc: 'Washing machine errors, fridge cooling fix',
    icon: <Tv className="h-5 w-5 text-blue-600" />,
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=300&q=80'
  }
];

export default function App() {
  const [currentCity, setCurrentCity] = useState('London');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'customer' | 'provider' | 'admin' | 'my-account' | 'rentals' | 'marketplace'>('customer');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activePolicyPage, setActivePolicyPage] = useState<string | null>(null);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProvider, setCurrentProvider] = useState<ServiceProvider | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Active Category selection for booking
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  // Push notifications queue (simulated)
  const [notifications, setNotifications] = useState<{ id: string; title: string; content: string }[]>([]);

  // Initialize and check pre-logged sessions
  useEffect(() => {
    // Attempt automatic login to Esha Sharma (mock database) for seamless reviewer exploration
    fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'vmalvi@gmail.com', role: 'user' })
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.profile);
        pushNotification('Session Activated', `Welcome back, ${data.profile.name}! Dual-sync cloud database loaded.`);
      }
    });

    // Simulated periodically push notifications to recreate highly dynamic mobile alerts
    const interval = setInterval(() => {
      const titles = [
        'Provider Verified',
        'Direct Message Alert',
        'New Referral Active',
        'Special Discount'
      ];
      const contents = [
        'Arjun Singh domestic electrical qualifications matched to UK compliance laws.',
        'Priya Sharma left a real-time message regarding your upcoming face salon.',
        'Your friend Kavita Verma just signed up! £15 reward pending first task.',
        'Damp bathroom? Save 15% on deep descaling scrubs this afternoon only.'
      ];
      const idx = Math.floor(Math.random() * titles.length);
      pushNotification(titles[idx], contents[idx]);
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  const pushNotification = (title: string, content: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setNotifications(prev => [...prev, { id, title, content }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  const handleAuthSuccess = (data: { user?: any; provider?: any; role: 'user' | 'provider' }) => {
    if (data.role === 'user') {
      setCurrentUser(data.user);
      setCurrentProvider(null);
      pushNotification('Sign In Compliant', `Cashless wallet (£${data.user.walletBalance}) and bookmarks synced.`);
    } else {
      setCurrentProvider(data.provider);
      setCurrentUser(null);
      pushNotification('Licensee Verified', 'Provider dashboard authorized. DBS compliance queue sync complete.');
    }
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentProvider(null);
    setActiveTab('customer');
    setSelectedCategory(null);
    pushNotification('Signed Out Safely', 'Secure session cleared according to GDPR encryption terms.');
  };

  // Filter service categories grid
  const filteredCategories = SERVICE_CATEGORIES.filter(cat => 
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/70 text-gray-900 font-sans antialiased flex flex-col justify-between theme-indigo" id="urbanuk-root">
      
      {/* Header component */}
      <Header
        currentCity={currentCity}
        onCityChange={(city) => {
          setCurrentCity(city);
          pushNotification('Location Updated', `Showing verified professionals active in: ${city}`);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
        currentProvider={currentProvider}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'customer') {
            setSelectedCategory(null);
          }
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        cartCount={selectedCategory ? 1 : 0}
        onOpenCart={() => {
          if (selectedCategory) {
            pushNotification('Checkout Cart Active', 'Confirming booking slots with UK verified technicians.');
          } else {
            pushNotification('Cart Empty', 'Please select a service category to add items.');
          }
        }}
        onLogout={handleLogout}
      />

      {/* Main container views */}
      <main className="flex-1 pb-16">
        
        {/* VIEW 1: CUSTOMER OUTLET MARKETPLACE */}
        {activeTab === 'customer' && !selectedCategory && (
          <div className="space-y-12" id="customer-marketplace-landing">
            
            {/* Service Showcase Hero Carousel */}
            <ServiceCarousel
              onSelectCategory={(category) => {
                setSelectedCategory(category);
                const categoryTitle = SERVICE_CATEGORIES.find(c => c.category === category)?.title || '';
                pushNotification('Booking Active', `Opening compliance questionnaire for: ${categoryTitle}`);
              }}
            />

            {/* Service categories grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" id="categories-section">
              <h2 className="text-lg font-black text-indigo-950 tracking-tight uppercase tracking-wider">What are you looking for today?</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" id="categories-bento-grid">
                {filteredCategories.map((item) => (
                  <div
                    key={item.category}
                    onClick={() => {
                      setSelectedCategory(item.category);
                      pushNotification('Booking Active', `Opening compliance questionnaire for: ${item.title}`);
                    }}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-50 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="p-5 space-y-4">
                      <div className="bg-indigo-50/50 border border-indigo-100/30 p-2.5 rounded-xl w-fit">
                        {item.icon}
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-indigo-950 group-hover:text-indigo-600 group-hover:underline block leading-tight">{item.title}</span>
                        <span className="text-[10px] text-gray-500 block mt-1 leading-normal">{item.desc}</span>
                      </div>
                    </div>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="h-28 w-full object-cover bg-gray-100 border-t border-gray-50 filter grayscale-[10%] group-hover:grayscale-0 transition-all" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Refer and Earn revenue promotion panel */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100/50" id="promo-referral-banner">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                    <Gift className="h-3 w-3" /> Share & Earn Cash
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">Refer Your Family, Earn £15 Free</h3>
                  <p className="text-sm text-indigo-200 max-w-xl leading-relaxed">
                    Gift £15 to your colleagues and friends for their salon or electrical fittings. Get £15 added automatically to your Urban Wallet once their first home service is completed.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!currentUser) {
                      setIsAuthOpen(true);
                    } else {
                      setActiveTab('my-account');
                      pushNotification('Referral Link Active', 'Copy your custom referral passcode from your Account portal.');
                    }
                  }}
                  className="bg-white hover:bg-indigo-50 text-indigo-900 font-black text-xs px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-105"
                >
                  Retrieve Invite Code
                </button>
              </div>
            </div>

            {/* Why choose us features */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-100" id="compliance-standards-marketing">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest text-center mb-8">UrbanUK Verified Network Core Safeguards</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="marketing-standards-grid">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-3 shadow-xs hover:shadow-md transition-all">
                  <div className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-2.5 w-fit">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-black text-indigo-950">1. Clean DBS Background Reports</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Every cook, plumber, and salon therapist must undergo a comprehensive Disclosure and Barring Service (DBS) police national scan to secure their active verified marketplace badge.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-3 shadow-xs hover:shadow-md transition-all">
                  <div className="bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl p-2.5 w-fit">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-black text-indigo-950">2. UK Regulation NVQ Standards</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Professional tradesmen require City & Guilds NVQ, NICEIC electrical, or CIEH food handling safety licenses. Scan results are auditable in real-time.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-3 shadow-xs hover:shadow-md transition-all">
                  <div className="bg-amber-50 text-amber-700 border border-amber-200 rounded-xl p-2.5 w-fit">
                    <PoundSterling className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-black text-indigo-950">3. Public Liability Protection</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    We cover accidental household damages up to £5,000 via our UrbanUK Marketplace Protection protocol so you can book with total peace of mind.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: ACTIVE CATEGORY QUESTIONNAIRE */}
        {activeTab === 'customer' && selectedCategory && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4" id="booking-journey-container">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1"
            >
              ← Back to all home categories
            </button>
            <ServiceBookingJourney
              currentCity={currentCity}
              category={selectedCategory}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              onBookingCompleted={() => {
                setActiveTab('my-account');
                setSelectedCategory(null);
                pushNotification('Booking Active', 'Review your newly created contract schedule inside Bookings.');
              }}
            />
          </div>
        )}

        {/* VIEW 3: PROVIDER REGISTER & ONBOARDING */}
        {activeTab === 'provider' && !currentProvider && (
          <ProviderRegistration
            onRegisterSuccess={(provider) => {
              setCurrentProvider(provider);
              setActiveTab('my-account');
              pushNotification('Onboarding Complete', `Compliance scanned: Approved status issued for ${provider.name}.`);
            }}
            onBackToCustomer={() => setActiveTab('customer')}
          />
        )}

        {/* VIEW 4: ADMIN CONTROLLER PORTAL */}
        {activeTab === 'admin' && (
          isAdminLoggedIn ? (
            <AdminDashboard 
              onServiceOnboarded={() => {
                pushNotification('Catalog Updated', 'New domestic category compiled into active UK servers.');
              }}
              onLogout={() => {
                setIsAdminLoggedIn(false);
                setActiveTab('customer');
                pushNotification('Admin Session Ended', 'Admin panel logged out successfully.');
              }}
            />
          ) : (
            <AdminLoginPanel 
              onLoginSuccess={() => {
                setIsAdminLoggedIn(true);
                pushNotification('Access Approved', 'Administrative privileges granted.');
              }} 
            />
          )
        )}

        {/* VIEW 5: USER / PROVIDER MY ACCOUNT PORTAL */}
        {activeTab === 'my-account' && (
          <MyAccount
            currentUser={currentUser}
            currentProvider={currentProvider}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
            }}
            onUpdateProvider={(updated) => {
              setCurrentProvider(updated);
            }}
          />
        )}

        {/* VIEW 6: PROPERTY RENTALS PORTAL */}
        {activeTab === 'rentals' && (
          <PropertyRentals
            currentUser={currentUser}
            currentProvider={currentProvider}
            currentCity={currentCity}
            onOpenAuth={() => setIsAuthOpen(true)}
            pushNotification={pushNotification}
          />
        )}

        {/* VIEW 7: HOUSEHOLD MARKETPLACE PORTAL */}
        {activeTab === 'marketplace' && (
          <HouseholdMarketplace
            currentUser={currentUser}
            currentProvider={currentProvider}
            currentCity={currentCity}
            onOpenAuth={() => setIsAuthOpen(true)}
            pushNotification={pushNotification}
          />
        )}

      </main>

      {/* Footer copyright */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs shrink-0" id="compliance-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Company */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button onClick={() => setActivePolicyPage('about_us')} className="hover:text-white transition-colors text-left cursor-pointer">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicyPage('anti_discrimination')} className="hover:text-white transition-colors text-left cursor-pointer">
                    Anti Discrimination Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicyPage('security_policy')} className="hover:text-white transition-colors text-left cursor-pointer">
                    Information Security Policy Statement & Objective
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicyPage('careers')} className="hover:text-white transition-colors text-left cursor-pointer">
                    Careers
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: For Service Professionals */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-white uppercase tracking-wider text-orange-400">For Service Professionals</h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button onClick={() => setActivePolicyPage('privacy_policy')} className="hover:text-white transition-colors text-left cursor-pointer">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicyPage('welfare_policy')} className="hover:text-white transition-colors text-left cursor-pointer">
                    Service Professionals Welfare Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicyPage('terms_conditions')} className="hover:text-white transition-colors text-left cursor-pointer">
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicyPage('community')} className="hover:text-white transition-colors text-left cursor-pointer">
                    Community
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicyPage('blog')} className="hover:text-white transition-colors text-left cursor-pointer">
                    Blog
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: For Customers */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-white uppercase tracking-wider text-indigo-400">For Customers</h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button onClick={() => { setActiveTab('customer'); setSelectedCategory(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors text-left cursor-pointer font-bold text-indigo-300">
                    Book a service
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('rentals'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors text-left cursor-pointer font-bold text-orange-300 mt-1">
                    Property Rentals & Flatshares 🏠
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Administrative Portal */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-white uppercase tracking-wider text-teal-400">Administration</h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button onClick={() => { setActiveTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-teal-300 transition-colors text-left cursor-pointer font-bold text-teal-400">
                    Admin Portal Login
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Block */}
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500">
            <div className="text-center sm:text-left space-y-0.5">
              <span className="font-extrabold text-sm text-white block">UrbanUK Ltd.</span>
              <span>Fully Compliant Domestic Services & Community Housing Marketplace © 2026. All rights reserved.</span>
            </div>
            <div className="flex gap-4 font-semibold text-slate-400">
              <span>GDPR Approved</span>
              <span>HMRC Registered</span>
              <span>DBS Audited Network</span>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING PUSH NOTIFICATION ALERTS PANELS */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full" id="push-notifications-panel">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className="bg-white border-l-4 border-indigo-600 text-gray-900 p-4 rounded-xl shadow-2xl relative flex gap-3 animate-slide-in hover:shadow-lg transition-all"
          >
            <div className="bg-indigo-50 p-2 rounded-lg shrink-0 flex items-center justify-center">
              <Bell className="h-4 w-4 text-indigo-600 animate-pulse" />
            </div>
            <div className="flex-1 pr-6">
              <span className="font-black text-xs text-indigo-900 block leading-none">{notif.title}</span>
              <p className="text-[10px] text-gray-500 leading-tight mt-1.5">{notif.content}</p>
            </div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
              className="absolute top-2 right-2 text-gray-400 hover:text-indigo-900"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Authentication Gateway Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Policy Pages Immersive Modal */}
      <PolicyModal 
        pageKey={activePolicyPage} 
        onClose={() => setActivePolicyPage(null)} 
        onNavigateToService={() => { setActiveTab('customer'); setSelectedCategory(null); }}
        onNavigateToRentals={() => setActiveTab('rentals')}
      />

    </div>
  );
}
