import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  PoundSterling, 
  User as UserIcon, 
  Phone, 
  Mail, 
  ArrowRight, 
  Tag, 
  Info, 
  CheckCircle, 
  Sparkles, 
  Trash2, 
  Heart,
  Building,
  Check,
  X,
  FileText
} from 'lucide-react';
import { User, ServiceProvider, PropertyListing, ViewingBooking } from '../types';

interface PropertyRentalsProps {
  currentUser: User | null;
  currentProvider: ServiceProvider | null;
  currentCity: string;
  onOpenAuth: () => void;
  pushNotification: (title: string, desc: string) => void;
}

// Preset Indian-community area options for the UK
const RENTAL_AREAS = [
  { value: 'Wembley', label: 'Wembley (Gujarati & Punjabi Central)' },
  { value: 'Harrow', label: 'Harrow (Gujarati & Professional Hub)' },
  { value: 'Southall', label: 'Southall (Little India / Punjabi Hub)' },
  { value: 'Kingsbury', label: 'Kingsbury & Brent (Temple Community)' },
  { value: 'Tooting', label: 'Tooting (South Indian & Sri Lankan Hub)' },
  { value: 'East Ham', label: 'East Ham (Tamil & Keralite Community)' },
  { value: 'Ilford', label: 'Ilford & Redbridge (Sikh & Hindu Community)' },
  { value: 'Croydon', label: 'Croydon (South London Indian)' },
  { value: 'Leicester', label: 'Leicester (Belgrave / Golden Mile - Gujarati Hub)' },
  { value: 'Oadby', label: 'Oadby & Wigston (South Asian Professionals)' },
  { value: 'Loughborough', label: 'Loughborough (Indian Student Hub)' },
  { value: 'Northampton', label: 'Northampton Town (Indian Association Hub)' },
  { value: 'Wellingborough', label: 'Wellingborough Indian Community' },
  { value: 'Kettering', label: 'Kettering South Asian Hub' },
  { value: 'Milton Keynes', label: 'Milton Keynes (Sanskriti & Indian Association)' },
  { value: 'High Wycombe', label: 'High Wycombe South Asian Community' },
  { value: 'Aylesbury', label: 'Aylesbury Vale Indian Hub' },
  { value: 'Birmingham', label: 'Birmingham (Handsworth & Soho - Punjabi Hub)' },
  { value: 'Coventry', label: 'Coventry (Foleshill - Indian Community)' },
  { value: 'Wolverhampton', label: 'Wolverhampton South Asian Hub' },
  { value: 'Manchester', label: 'Manchester (Rusholme Curry Mile)' },
  { value: 'Leeds', label: 'Leeds Indian Association' },
  { value: 'Glasgow', label: 'Glasgow West End Hub' },
  { value: 'Edinburgh', label: 'Edinburgh Leith Hub' },
  { value: 'Bristol', label: 'Bristol City Hub' }
];

const PRESET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600', label: 'Elegant Double Bedroom (Warm Lit)' },
  { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600', label: 'Modern Furnished Studio' },
  { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600', label: 'Spacious Shared Double Room' },
  { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=600', label: 'Bright Cozy Family Room' },
  { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600', label: 'Comfortable Modern Kitchen & Flat' }
];

const SEED_PROPERTIES: PropertyListing[] = [
  {
    id: 'prop-1',
    providerId: 'prov-cooking-1',
    providerName: 'Kirti Patel (Spicetree Cooking)',
    providerEmail: 'kirti.patel@urbanuk.co.uk',
    providerPhone: '+44 7700 900331',
    title: 'Vegetarian Shared Double Room near Wembley Temple',
    type: 'shared_room',
    price: 620,
    area: 'Wembley',
    description: 'Lovely spacious double room in a quiet family home. Just 6 minutes walk from the Shree Sanatan Hindu Mandir and Wembley Park tube station. Strictly pure vegetarian/Jain friendly kitchen. High-speed fiber broadband and all utility bills are fully included.',
    imageUrl: PRESET_IMAGES[0].url,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prop-2',
    providerId: 'prov-beauty-2',
    providerName: 'Priya Sharma (Ayurveda Wellness)',
    providerEmail: 'priya.sharma@urbanuk.co.uk',
    providerPhone: '+44 7700 900445',
    title: 'Modern 2-Bed Luxury Flat off Belgrave Golden Mile',
    type: 'long_term',
    price: 1150,
    area: 'Leicester',
    description: 'Beautiful, fully-furnished 2 bedroom luxury apartment. Situated just seconds away from Belgrave Road (famed Golden Mile), close to all major Indian supermarkets, temples, and transport links. South Asian professional friendly.',
    imageUrl: PRESET_IMAGES[1].url,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prop-3',
    providerId: 'prov-cleaning-3',
    providerName: 'Gurbaksh Singh (Sikh Quality Cleaners)',
    providerEmail: 'gurbaksh.singh@urbanuk.co.uk',
    providerPhone: '+44 7700 900552',
    title: 'Cozy Short-Term Studio in the Heart of Southall',
    type: 'short_term',
    price: 890,
    area: 'Southall',
    description: 'Excellent short-term studio flat available. Situated directly off Southall High Street (Little India). Perfect for parents visiting from India or temporary professional stays. Fully serviced weekly. Walking distance to Southall station.',
    imageUrl: PRESET_IMAGES[2].url,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prop-4',
    providerId: 'prov-cooking-2',
    providerName: 'Amit Shah (Pure Jain Caterers)',
    providerEmail: 'amit.shah@urbanuk.co.uk',
    providerPhone: '+44 7700 900889',
    title: 'Spacious Shared Flat Room - Professional South Asian IT Hub',
    type: 'shared_room',
    price: 680,
    area: 'Harrow',
    description: 'Spacious single room available in a highly clean 3-bedroom flat shared with two peaceful South Asian IT professionals. Friendly atmosphere, vegetarian-preferred. Close to Harrow-on-the-Hill tube. Secure bicycle parking.',
    imageUrl: PRESET_IMAGES[3].url,
    isAvailable: true,
    createdAt: new Date().toISOString()
  }
];

export default function PropertyRentals({
  currentUser,
  currentProvider,
  currentCity,
  onOpenAuth,
  pushNotification
}: PropertyRentalsProps) {
  // Property Listings State
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [viewings, setViewings] = useState<ViewingBooking[]>([]);

  // Filtering states
  const [filterArea, setFilterArea] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active view: 'browse' | 'add-listing' | 'my-dashboard'
  const [activeRentTab, setActiveRentTab] = useState<'browse' | 'add-listing' | 'my-dashboard'>('browse');

  // New Listing Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'shared_room' | 'short_term' | 'long_term'>('shared_room');
  const [newPrice, setNewPrice] = useState('');
  const [newArea, setNewArea] = useState('Wembley');
  const [newDesc, setNewDesc] = useState('');
  const [newImgUrl, setNewImgUrl] = useState(PRESET_IMAGES[0].url);

  // Viewing Booker modal/state
  const [selectedPropForViewing, setSelectedPropForViewing] = useState<PropertyListing | null>(null);
  const [viewingDate, setViewingDate] = useState('');
  const [viewingTime, setViewingTime] = useState('14:00');
  const [viewingInterest, setViewingInterest] = useState(false);

  // Load properties and viewings on mount
  useEffect(() => {
    const localProps = localStorage.getItem('urbanuk_properties');
    const localViewings = localStorage.getItem('urbanuk_viewings');

    if (localProps) {
      setProperties(JSON.parse(localProps));
    } else {
      setProperties(SEED_PROPERTIES);
      localStorage.setItem('urbanuk_properties', JSON.stringify(SEED_PROPERTIES));
    }

    if (localViewings) {
      setViewings(JSON.parse(localViewings));
    } else {
      setViewings([]);
    }
  }, []);

  // Save states helper
  const saveProperties = (updatedProps: PropertyListing[]) => {
    setProperties(updatedProps);
    localStorage.setItem('urbanuk_properties', JSON.stringify(updatedProps));
  };

  const saveViewings = (updatedViewings: ViewingBooking[]) => {
    setViewings(updatedViewings);
    localStorage.setItem('urbanuk_viewings', JSON.stringify(updatedViewings));
  };

  // Submit new property
  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProvider) {
      pushNotification('Authentication Required', 'Please register or sign in as a service professional to publish properties.');
      return;
    }

    if (!newTitle.trim() || !newPrice || !newDesc.trim()) {
      pushNotification('Incomplete Form', 'Please fill out all property details.');
      return;
    }

    const priceNum = parseInt(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      pushNotification('Invalid Price', 'Please enter a valid monthly rent amount.');
      return;
    }

    const newListing: PropertyListing = {
      id: `prop-${Date.now()}`,
      providerId: currentProvider.id,
      providerName: currentProvider.name,
      providerEmail: currentProvider.email,
      providerPhone: currentProvider.phone,
      title: newTitle.trim(),
      type: newType,
      price: priceNum,
      area: newArea,
      description: newDesc.trim(),
      imageUrl: newImgUrl,
      isAvailable: true,
      createdAt: new Date().toISOString()
    };

    const updated = [newListing, ...properties];
    saveProperties(updated);

    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewDesc('');
    setActiveRentTab('browse');

    pushNotification(
      'Property Published Successfully 🏠', 
      `Your listing "${newListing.title}" is now live for Wembley, Southall, and UK Indian community seekers.`
    );
  };

  // Handle Book viewing
  const handleConfirmViewing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropForViewing) return;

    if (!currentUser && !currentProvider) {
      pushNotification('Please Sign In', 'Sign in to book a viewing or express interest in rentals.');
      onOpenAuth();
      return;
    }

    if (!viewingDate) {
      pushNotification('Date Required', 'Please select a preferred viewing date.');
      return;
    }

    const userEmail = currentUser?.email || currentProvider?.email || 'guest@urbanuk.co.uk';
    const userName = currentUser?.name || currentProvider?.name || 'Vetted Community Member';
    const userPhone = currentUser?.phone || currentProvider?.phone || '+44 7700 900000';
    const userId = currentUser?.id || currentProvider?.id || 'guest-user';

    const newViewing: ViewingBooking = {
      id: `viewing-${Date.now()}`,
      propertyId: selectedPropForViewing.id,
      propertyTitle: selectedPropForViewing.title,
      userId,
      userName,
      userEmail,
      userPhone,
      providerId: selectedPropForViewing.providerId,
      date: viewingDate,
      time: viewingTime,
      isInterested: viewingInterest,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updated = [newViewing, ...viewings];
    saveViewings(updated);

    pushNotification(
      viewingInterest ? 'Interest Logged & Viewing Booked' : 'Viewing Booked Successfully',
      `Confirmed request for ${selectedPropForViewing.title} on ${viewingDate} at ${viewingTime}.`
    );

    setSelectedPropForViewing(null);
    setViewingDate('');
    setViewingInterest(false);
  };

  // Quick Interest expression (without full custom date calendar)
  const handleQuickExpressInterest = (prop: PropertyListing) => {
    if (!currentUser && !currentProvider) {
      pushNotification('Sign In Required', 'Please sign in to show interest in this property.');
      onOpenAuth();
      return;
    }

    const userEmail = currentUser?.email || currentProvider?.email || '';
    const userName = currentUser?.name || currentProvider?.name || '';
    const userPhone = currentUser?.phone || currentProvider?.phone || '';
    const userId = currentUser?.id || currentProvider?.id || '';

    // Check if interest already exists
    const alreadyLogged = viewings.some(v => v.propertyId === prop.id && v.userId === userId && v.isInterested);
    if (alreadyLogged) {
      pushNotification('Already Expressed', 'You have already logged interest for this property. The provider has your contact details.');
      return;
    }

    const quickViewing: ViewingBooking = {
      id: `viewing-${Date.now()}`,
      propertyId: prop.id,
      propertyTitle: prop.title,
      userId,
      userName,
      userEmail,
      userPhone,
      providerId: prop.providerId,
      date: 'Flexible Viewing',
      time: 'Flexible Time',
      isInterested: true,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updated = [quickViewing, ...viewings];
    saveViewings(updated);

    pushNotification(
      'Interest Registered! 🌟',
      `We have sent your verified details (${userName}, ${userPhone}) to ${prop.providerName}. They will call you shortly.`
    );
  };

  // Delete/Cancel listing
  const handleDeleteProperty = (id: string) => {
    const updated = properties.filter(p => p.id !== id);
    saveProperties(updated);
    pushNotification('Listing Removed', 'The property rental listing has been taken off the market.');
  };

  // Delete/Cancel viewing
  const handleCancelViewing = (id: string) => {
    const updated = viewings.filter(v => v.id !== id);
    saveViewings(updated);
    pushNotification('Viewing Cancelled', 'Viewing scheduled request has been removed.');
  };

  // Filter properties
  const filteredProperties = properties.filter(p => {
    const matchArea = filterArea === 'all' || p.area.toLowerCase() === filterArea.toLowerCase();
    const matchType = filterType === 'all' || p.type === filterType;
    const matchSearch = !searchQuery.trim() || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchArea && matchType && matchSearch;
  });

  const getTypeName = (type: string) => {
    if (type === 'shared_room') return 'Shared Room';
    if (type === 'short_term') return 'House/Flat Short-Term';
    return 'House/Flat Long-Term';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="rentals-module-root">
      
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl" id="rentals-top-banner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-yellow-300/20 via-transparent to-transparent opacity-40"></div>
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-indigo-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-yellow-300">
            <Building className="h-3.5 w-3.5" /> Indian Community Housing & Rentals UK
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-none uppercase">
            Shared Rooms, Serviced Flats & Long-Term Rentals
          </h2>
          <p className="text-xs sm:text-sm text-orange-50 max-w-xl leading-relaxed">
            A trusted portal where verified service professionals and homeowners publish rooms and properties area-wise. Browse rooms with pure-vegetarian kitchens, temple accessibility, and direct landlord connections.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-4 gap-4" id="rentals-tab-bar">
        <div className="flex gap-2.5">
          <button
            onClick={() => setActiveRentTab('browse')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeRentTab === 'browse'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            Browse Available Properties
          </button>

          {currentProvider && (
            <button
              onClick={() => setActiveRentTab('add-listing')}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeRentTab === 'add-listing'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <Plus className="h-4 w-4" /> Publish Property to Rent
            </button>
          )}

          {(currentUser || currentProvider) && (
            <button
              onClick={() => setActiveRentTab('my-dashboard')}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeRentTab === 'my-dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4" /> My Rental Dashboard
              {viewings.length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {viewings.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Info label */}
        <div className="text-[11px] text-gray-500 flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-lg max-w-xs">
          <Info className="h-3.5 w-3.5 text-yellow-600 shrink-0" />
          <span>Only DBS-cleared partners and verified users can publish or schedule viewings.</span>
        </div>
      </div>

      {/* Main Tab Render: BROWSE */}
      {activeRentTab === 'browse' && (
        <div className="space-y-6" id="browse-rentals-subview">
          
          {/* Filtering Layout */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-4 items-end" id="rental-filters-panel">
            <div className="flex-1 space-y-1.5 w-full">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Search Properties</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search title, description, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="w-full md:w-64 space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Filter by UK Indian Hub Area</label>
              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50 focus:outline-hidden focus:border-indigo-600 cursor-pointer"
              >
                <option value="all">All UK Areas</option>
                <optgroup label="London Hubs">
                  <option value="Wembley">Wembley</option>
                  <option value="Harrow">Harrow</option>
                  <option value="Southall">Southall</option>
                  <option value="Kingsbury">Kingsbury</option>
                  <option value="Tooting">Tooting</option>
                  <option value="East Ham">East Ham</option>
                  <option value="Ilford">Ilford</option>
                  <option value="Croydon">Croydon</option>
                </optgroup>
                <optgroup label="Leicestershire">
                  <option value="Leicester">Leicester (Belgrave)</option>
                  <option value="Oadby">Oadby</option>
                  <option value="Loughborough">Loughborough</option>
                </optgroup>
                <optgroup label="Other Core Hubs">
                  <option value="Northampton">Northampton</option>
                  <option value="Milton Keynes">Milton Keynes</option>
                  <option value="High Wycombe">High Wycombe</option>
                  <option value="Birmingham">Birmingham</option>
                  <option value="Coventry">Coventry</option>
                  <option value="Manchester">Manchester</option>
                  <option value="Leeds">Leeds</option>
                  <option value="Glasgow">Glasgow</option>
                  <option value="Edinburgh">Edinburgh</option>
                  <option value="Bristol">Bristol</option>
                </optgroup>
              </select>
            </div>

            <div className="w-full md:w-56 space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Rental Category Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50 focus:outline-hidden focus:border-indigo-600 cursor-pointer"
              >
                <option value="all">All Category Types</option>
                <option value="shared_room">Shared Rooms</option>
                <option value="short_term">House/Flat Short-Term</option>
                <option value="long_term">House/Flat Long-Term</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl border border-gray-100 text-center space-y-4">
              <Home className="h-12 w-12 text-gray-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-gray-900">No properties fit current search</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Try adjusting your filter options, checking other Indian community regions, or publishing a new room!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="rentals-grid">
              {filteredProperties.map((prop) => (
                <div key={prop.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group">
                  <div>
                    {/* Picture area */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden shrink-0">
                      <img 
                        src={prop.imageUrl} 
                        alt={prop.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-black/85 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-xs">
                          {getTypeName(prop.type)}
                        </span>
                        <span className="bg-yellow-400 text-indigo-950 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                          £{prop.price}/mo
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center gap-1 bg-white/95 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          <MapPin className="h-3 w-3 text-red-500" /> {prop.area}
                        </span>
                      </div>
                    </div>

                    {/* Description Area */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-base font-black text-indigo-950 leading-tight group-hover:text-indigo-600 transition-colors uppercase">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                        {prop.description}
                      </p>

                      {/* Contact metadata */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <UserIcon className="h-3 w-3 text-indigo-500" />
                          <span>Listed by: <strong className="text-gray-700">{prop.providerName}</strong></span>
                        </div>
                        <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">
                          ✓ Verified DBS landlord
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking actions */}
                  <div className="px-5 pb-5 pt-2 flex gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedPropForViewing(prop)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-all"
                    >
                      <Calendar className="h-3.5 w-3.5" /> Book Viewing
                    </button>

                    <button
                      onClick={() => handleQuickExpressInterest(prop)}
                      className="bg-orange-50 border border-orange-200 hover:border-orange-300 text-orange-700 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                      title="Instantly send your verified contact card to the landlord"
                    >
                      <Heart className="h-3.5 w-3.5 fill-orange-100" /> Express Interest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Tab Render: ADD LISTING (PROVIDER PORTAL) */}
      {activeRentTab === 'add-listing' && currentProvider && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 max-w-2xl mx-auto space-y-6" id="add-listing-form-container">
          <div className="space-y-1.5 text-center">
            <h3 className="text-xl font-black text-indigo-950 uppercase">Publish Your Property to Rent</h3>
            <p className="text-xs text-gray-500">
              Your listing will be visible to students, families, and community members active in the UK.
            </p>
          </div>

          <form onSubmit={handleCreateProperty} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-indigo-950 uppercase tracking-wider block">Property Listing Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Spacious Double Room for Rent in Harrow - Vegetarian Preferred"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-950 uppercase tracking-wider block">Rental Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600 bg-white cursor-pointer"
                >
                  <option value="shared_room">Shared Room</option>
                  <option value="short_term">House/Flat Short-Term</option>
                  <option value="long_term">House/Flat Long-Term</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-950 uppercase tracking-wider block">Monthly Rent Price (£)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 650"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-950 uppercase tracking-wider block">Indian Community UK Hub Area</label>
                <select
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600 bg-white cursor-pointer"
                >
                  {RENTAL_AREAS.map(area => (
                    <option key={area.value} value={area.value}>{area.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-950 uppercase tracking-wider block">Select Preset Room / Flat Photo</label>
                <select
                  value={newImgUrl}
                  onChange={(e) => setNewImgUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600 bg-white cursor-pointer"
                >
                  {PRESET_IMAGES.map((img, idx) => (
                    <option key={idx} value={img.url}>{img.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Photo preview */}
            <div className="border border-gray-100 rounded-xl overflow-hidden h-32 relative bg-gray-50">
              <img src={newImgUrl} alt="Preset Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded">Selected Photo Preview</div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-indigo-950 uppercase tracking-wider block">Detailed Property Description</label>
              <textarea
                required
                rows={4}
                placeholder="Describe rooms, kitchen policies (veg/non-veg), proximity to grocery shops, underground tube stations, temples, shared housemates, and utility bills details..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveRentTab('browse')}
                className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-black rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-lg cursor-pointer"
              >
                Publish Listing Live
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Tab Render: RENTAL DASHBOARD */}
      {activeRentTab === 'my-dashboard' && (currentUser || currentProvider) && (
        <div className="space-y-6" id="rental-dashboard-subview">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Viewings Scheduled by User (as a Customer) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-indigo-950 uppercase tracking-tight flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-600" /> Booked Viewings & Expressions of Interest
                </h3>
                <p className="text-xs text-gray-400">Viewings you have scheduled or homes you have expressed strong interest to rent.</p>
              </div>

              {viewings.filter(v => v.userId === (currentUser?.id || currentProvider?.id)).length === 0 ? (
                <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center text-xs text-gray-400">
                  You have not scheduled any viewings or expressed rental interests yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {viewings.filter(v => v.userId === (currentUser?.id || currentProvider?.id)).map((v) => (
                    <div key={v.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex justify-between items-center gap-4">
                      <div className="space-y-1.5">
                        <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded block w-fit">
                          {v.isInterested ? '★ Strong Interest & Viewing' : 'Viewing Requested'}
                        </span>
                        <h4 className="text-xs font-black text-gray-800 uppercase leading-snug">{v.propertyTitle}</h4>
                        <div className="text-[10px] text-gray-500 space-y-0.5">
                          <p>📅 <strong>Date:</strong> {v.date} @ {v.time}</p>
                          <p>🤝 <strong>Landlord Contact:</strong> Active Partner</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancelViewing(v.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all cursor-pointer"
                        title="Cancel Request"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Properties Listed & Customer Leads (as a Landlord/Provider) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-indigo-950 uppercase tracking-tight flex items-center gap-2">
                  <Building className="h-4 w-4 text-indigo-600" /> My Published Properties & Inbound Leads
                </h3>
                <p className="text-xs text-gray-400">View customer requests, viewing slots, and contact cards for properties you published.</p>
              </div>

              {currentProvider ? (
                <div className="space-y-4">
                  
                  {/* Active listings published by this provider */}
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">My Live Listings</span>
                    {properties.filter(p => p.providerId === currentProvider.id).length === 0 ? (
                      <div className="border border-dashed border-gray-100 rounded-xl p-4 text-center text-xs text-gray-400">
                        You have not published any properties yet under this professional account.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {properties.filter(p => p.providerId === currentProvider.id).map(p => (
                          <div key={p.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex justify-between items-center">
                            <div className="truncate">
                              <span className="text-[9px] font-bold text-gray-400 uppercase">{getTypeName(p.type)}</span>
                              <span className="text-xs font-bold text-gray-800 block truncate">{p.title}</span>
                              <span className="text-[9px] text-indigo-600 font-extrabold">£{p.price}/mo in {p.area}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteProperty(p.id)}
                              className="text-red-500 hover:text-red-600 p-1.5"
                              title="Delete Listing"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Customer viewings/interest log for this provider's listings */}
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Customer Renting Leads & Bookings</span>
                    {viewings.filter(v => v.providerId === currentProvider.id).length === 0 ? (
                      <div className="border border-dashed border-gray-100 rounded-xl p-4 text-center text-xs text-gray-400">
                        No prospective tenants have scheduled viewings or logged interest yet.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {viewings.filter(v => v.providerId === currentProvider.id).map(v => (
                          <div key={v.id} className="bg-yellow-50/50 border border-yellow-200 rounded-xl p-3 space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9px] font-bold text-orange-700 bg-orange-100/50 px-1.5 py-0.5 rounded">
                                  {v.isInterested ? '★ Strong Rental Interest' : 'Viewing Appt'}
                                </span>
                                <h4 className="text-xs font-bold text-gray-800 mt-1">{v.propertyTitle}</h4>
                              </div>
                              <span className="text-[9px] font-semibold text-gray-400">{v.date}</span>
                            </div>
                            
                            <div className="text-[10px] text-gray-600 space-y-1 pt-1.5 border-t border-yellow-100">
                              <p>👤 <strong>Seeker Name:</strong> {v.userName}</p>
                              <p>📞 <strong>Phone:</strong> <span className="text-blue-600 font-bold">{v.userPhone}</span></p>
                              <p>✉️ <strong>Email:</strong> {v.userEmail}</p>
                              <p>🕒 <strong>Proposed Slot:</strong> {v.date} @ {v.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center text-xs text-gray-400">
                  Please sign in as a service professional to view your publishing capabilities and customer viewing logs.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* VIEWING APPOINTMENT MODAL */}
      {selectedPropForViewing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs" id="viewing-booker-modal">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 sm:p-8 space-y-6 relative animate-scale-up shadow-2xl">
            <button
              onClick={() => setSelectedPropForViewing(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2">
              <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block">
                📅 Schedule Community Viewing
              </span>
              <h3 className="text-base font-black text-indigo-950 uppercase leading-snug">
                {selectedPropForViewing.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Choose a preferred date and time. We will instantly schedule the viewing appointment and connect you directly with <strong>{selectedPropForViewing.providerName}</strong>.
              </p>
            </div>

            <form onSubmit={handleConfirmViewing} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={viewingDate}
                    onChange={(e) => setViewingDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Preferred Time</label>
                  <select
                    value={viewingTime}
                    onChange={(e) => setViewingTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600 bg-white cursor-pointer"
                  >
                    <option value="09:00">09:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:30">03:30 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="18:30">06:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Checkbox to express strong interest */}
              <label className="flex items-start gap-2.5 border border-orange-100 bg-orange-50/40 p-3 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewingInterest}
                  onChange={(e) => setViewingInterest(e.target.checked)}
                  className="mt-1 h-3.5 w-3.5 rounded-sm border-orange-300 text-orange-600 focus:ring-orange-500"
                />
                <div className="leading-tight">
                  <span className="text-[11px] font-bold text-orange-950 block">Express Direct Strong Interest to Rent</span>
                  <span className="text-[9px] text-gray-500 block mt-0.5">Check this to indicate you are highly interested. We will prioritize your request.</span>
                </div>
              </label>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md shadow-indigo-100"
              >
                Confirm Viewing Slots
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
