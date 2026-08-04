import React from 'react';
import { Search, MapPin, Sparkles, LogIn, User as UserIcon, ShieldAlert, ShoppingBag, Briefcase, Settings, Home } from 'lucide-react';
import { User, ServiceProvider } from '../types';

interface HeaderProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUser: User | null;
  currentProvider: ServiceProvider | null;
  activeTab: 'customer' | 'provider' | 'admin' | 'my-account' | 'rentals' | 'marketplace';
  onTabChange: (tab: 'customer' | 'provider' | 'admin' | 'my-account' | 'rentals' | 'marketplace') => void;
  onOpenAuth: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onLogout: () => void;
}

const UK_CITY_GROUPS = [
  {
    city: 'London Indian Hubs',
    areas: [
      { value: 'London', label: 'All London (Indian Hubs)' },
      { value: 'Wembley', label: 'Wembley (Gujarati & Punjabi Central)' },
      { value: 'Harrow', label: 'Harrow (Gujarati & Professional Hub)' },
      { value: 'Southall', label: 'Southall (Little India / Punjabi Hub)' },
      { value: 'Kingsbury', label: 'Kingsbury & Brent (Temple Community)' },
      { value: 'Tooting', label: 'Tooting (South Indian & Sri Lankan Hub)' },
      { value: 'East Ham', label: 'East Ham (Tamil & Keralite Community)' },
      { value: 'Ilford', label: 'Ilford & Redbridge (Sikh & Hindu Community)' },
      { value: 'Croydon', label: 'Croydon (South London Indian Community)' }
    ]
  },
  {
    city: 'Leicestershire (East Midlands)',
    areas: [
      { value: 'Leicester', label: 'Leicester (Belgrave / Golden Mile - Gujarati Hub)' },
      { value: 'Oadby', label: 'Oadby & Wigston (South Asian Professionals)' },
      { value: 'Loughborough', label: 'Loughborough (Indian Student Hub)' },
      { value: 'Spinney Hills', label: 'Spinney Hills & Humberstone' }
    ]
  },
  {
    city: 'Northamptonshire',
    areas: [
      { value: 'Northampton', label: 'Northampton Town (Indian Association Hub)' },
      { value: 'Wellingborough', label: 'Wellingborough Indian Community' },
      { value: 'Kettering', label: 'Kettering South Asian Hub' },
      { value: 'Daventry', label: 'Daventry' }
    ]
  },
  {
    city: 'Buckinghamshire',
    areas: [
      { value: 'Milton Keynes', label: 'Milton Keynes (Sanskriti & Indian Association)' },
      { value: 'High Wycombe', label: 'High Wycombe South Asian Community' },
      { value: 'Aylesbury', label: 'Aylesbury Vale Indian Hub' },
      { value: 'Amersham', label: 'Amersham & Chalfont' }
    ]
  },
  {
    city: 'West Midlands',
    areas: [
      { value: 'Birmingham', label: 'Birmingham (Handsworth & Soho - Punjabi Hub)' },
      { value: 'Coventry', label: 'Coventry (Foleshill - Indian Community)' },
      { value: 'Wolverhampton', label: 'Wolverhampton South Asian Hub' },
      { value: 'Smethwick', label: 'Smethwick & Sandwell' }
    ]
  },
  {
    city: 'Other UK Regions',
    areas: [
      { value: 'Manchester', label: 'Manchester (Rusholme Curry Mile)' },
      { value: 'Leeds', label: 'Leeds Indian Association' },
      { value: 'Glasgow', label: 'Glasgow West End Hub' },
      { value: 'Edinburgh', label: 'Edinburgh Leith Hub' },
      { value: 'Bristol', label: 'Bristol City Hub' }
    ]
  }
];

const UK_CITIES = UK_CITY_GROUPS.flatMap(group => group.areas.map(a => a.value));

export default function Header({
  currentCity,
  onCityChange,
  searchQuery,
  onSearchChange,
  currentUser,
  currentProvider,
  activeTab,
  onTabChange,
  onOpenAuth,
  cartCount,
  onOpenCart,
  onLogout
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-xs" id="uc-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('customer')} id="logo-container">
            <div className="bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg flex items-center justify-center font-black tracking-tighter text-xl italic shadow-md shadow-indigo-200 animate-pulse">
              UC
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-xl text-indigo-900 tracking-tight block leading-none">UrbanClap UK</span>
              <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1">UK Network</span>
            </div>
          </div>

          {/* Search and Location - Only show when in customer view */}
          {activeTab === 'customer' && (
            <div className="hidden md:flex flex-1 max-w-3xl items-center bg-gray-50 border border-gray-200 rounded-full p-1.5 gap-2" id="search-bar-container">
              {/* Location Selector */}
              <div className="flex items-center gap-1.5 px-4 border-r border-gray-200 shrink-0">
                <MapPin className="h-4 w-4 text-indigo-600" />
                <select
                  value={currentCity}
                  onChange={(e) => onCityChange(e.target.value)}
                  className="bg-transparent text-sm font-bold text-gray-800 focus:outline-hidden cursor-pointer"
                  id="city-selector"
                >
                  {UK_CITY_GROUPS.map((group) => (
                    <optgroup key={group.city} label={group.city} className="font-bold text-indigo-900 bg-white">
                      {group.areas.map((area) => (
                        <option key={area.value} value={area.value} className="font-normal text-gray-700">
                          {area.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Keyword Search */}
              <div className="flex items-center flex-1 gap-2 pl-2">
                <Search className="h-4 w-4 text-indigo-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search for cooking, women salon, plumbing, painting, gardening..."
                  className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden"
                  id="keyword-search-input"
                />
              </div>
            </div>
          )}

          {/* Quick Access Switchers */}
          <div className="flex items-center gap-2 sm:gap-4" id="nav-actions">
            <button
              onClick={() => onTabChange('customer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'customer'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
              id="switch-customer"
            >
              Book Services
            </button>

            <button
              onClick={() => onTabChange('rentals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'rentals'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
              id="switch-rentals"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Property Rentals</span>
            </button>

            <button
              onClick={() => onTabChange('marketplace')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
              id="switch-marketplace"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Buy & Sell Items</span>
            </button>
            
            <button
              onClick={() => {
                if (currentProvider) {
                  onTabChange('provider');
                } else {
                  onTabChange('provider'); // Form handles self-onboarding state
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'provider'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
              id="switch-provider"
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Provider Portal</span>
            </button>



            {/* Shopping Cart button - Customer Tab */}
            {activeTab === 'customer' && (
              <button
                onClick={onOpenCart}
                className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                id="shopping-cart-button"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-indigo-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Auth / Profile Area */}
            {currentUser || currentProvider ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTabChange('my-account')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'my-account'
                      ? 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                      : 'text-gray-700 hover:bg-indigo-50 border border-transparent'
                  }`}
                  id="header-my-account-button"
                >
                  <UserIcon className="h-3.5 w-3.5 text-indigo-600" />
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {currentUser ? currentUser.name : currentProvider?.name}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg"
                  id="logout-button"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-100"
                id="login-register-button"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Login / Register</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
