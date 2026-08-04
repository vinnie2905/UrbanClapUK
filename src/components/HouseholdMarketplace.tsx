import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  MapPin, 
  Tag, 
  Phone, 
  Mail, 
  User as UserIcon, 
  CheckCircle, 
  Trash2, 
  X, 
  Info, 
  Sparkles, 
  Eye, 
  DollarSign, 
  Package, 
  ThumbsUp, 
  Send,
  MessageSquare,
  Bookmark,
  Share2
} from 'lucide-react';
import { User, ServiceProvider, MarketplaceItem, MarketplaceInterest, MarketplaceCategory } from '../types';

interface HouseholdMarketplaceProps {
  currentUser: User | null;
  currentProvider: ServiceProvider | null;
  currentCity: string;
  onOpenAuth: () => void;
  pushNotification: (title: string, desc: string) => void;
  activeTheme?: string;
}

// Preset South Asian and General UK community hubs matching property search
const MARKET_AREAS = [
  { value: 'Wembley', label: 'Wembley (Brent Council)' },
  { value: 'Harrow', label: 'Harrow (North West London)' },
  { value: 'Southall', label: 'Southall (Ealing)' },
  { value: 'Kingsbury', label: 'Kingsbury & Brent' },
  { value: 'Tooting', label: 'Tooting (Wandsworth)' },
  { value: 'East Ham', label: 'East Ham (Newham)' },
  { value: 'Ilford', label: 'Ilford & Redbridge' },
  { value: 'Leicester', label: 'Leicester (Belgrave / Golden Mile)' },
  { value: 'Birmingham', label: 'Birmingham (Handsworth / Soho)' },
  { value: 'Coventry', label: 'Coventry (Foleshill)' },
  { value: 'Northampton', label: 'Northampton Town' },
  { value: 'Milton Keynes', label: 'Milton Keynes' },
  { value: 'Manchester', label: 'Manchester (Rusholme)' },
  { value: 'Leeds', label: 'Leeds Hub' },
  { value: 'Glasgow', label: 'Glasgow West End' }
];

const PRESET_ITEM_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=600', label: 'Premium Solid Oak Dining Set' },
  { url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=600', label: 'Dyson Cordless Vacuum Cleaner' },
  { url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600', label: 'Professional Cookware & Spice Thali Set' },
  { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600', label: 'Traditional Banarasi Silk Saree / Sherwani Set' },
  { url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600', label: 'Delonghi Espresso Coffee Maker' },
  { url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=600', label: 'Minimalist Study Desk & Ergonomic Chair' }
];

const SEED_MARKET_ITEMS: MarketplaceItem[] = [
  {
    id: 'item-1',
    sellerId: 'user-seed-1',
    sellerName: 'Karan Malhotra',
    sellerEmail: 'karan.malhotra@urbanuk.co.uk',
    sellerPhone: '+44 7700 901234',
    title: 'Solid Oak 6-Seater Dining Table',
    category: 'furniture',
    condition: 'good',
    price: 240,
    area: 'Wembley',
    description: 'Beautiful, heavy solid oak dining table. Perfect for large family dinners or festive hosting. Has a few extremely minor scratches on the corners but otherwise in gorgeous condition. Chairs are included. Must be collected from ground floor flat in Wembley near the temple.',
    imageUrl: PRESET_ITEM_IMAGES[0].url,
    isAvailable: true,
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString()
  },
  {
    id: 'item-2',
    sellerId: 'user-seed-2',
    sellerName: 'Jaspreet Kaur',
    sellerEmail: 'jas.kaur@urbanuk.co.uk',
    sellerPhone: '+44 7700 901567',
    title: 'Dyson V11 Absolute Cordless Vacuum',
    category: 'electrical',
    condition: 'like_new',
    price: 185,
    area: 'Southall',
    description: 'Selling our Dyson V11 cordless cleaner as we are upgrading to the newer model. It is fully cleaned, filters washed, and comes with all original wall mount fittings and 4 accessory heads. Battery life is pristine, lasting up to 55 minutes on Eco mode.',
    imageUrl: PRESET_ITEM_IMAGES[1].url,
    isAvailable: true,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: 'item-3',
    sellerId: 'user-seed-3',
    sellerName: 'Meera Patel',
    sellerEmail: 'meera.patel@urbanuk.co.uk',
    sellerPhone: '+44 7700 901890',
    title: 'Prestige Stainless Steel Cookware & Thali Set',
    category: 'household',
    condition: 'new',
    price: 65,
    area: 'Leicester',
    description: 'Unopened, brand new premium Prestige cookware bundle. Includes 3 heavy-bottomed stainless steel pots with glass lids, 1 frying pan, and 4 traditional matching dining thalis. Induction friendly. Recieved as a wedding housewarming gift but we already have ample kitchenware.',
    imageUrl: PRESET_ITEM_IMAGES[2].url,
    isAvailable: true,
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
  },
  {
    id: 'item-4',
    sellerId: 'user-seed-4',
    sellerName: 'Simran Sheikh',
    sellerEmail: 'simran.sheikh@urbanuk.co.uk',
    sellerPhone: '+44 7700 902233',
    title: 'Traditional Designer Silk Banarasi Saree',
    category: 'clothes',
    condition: 'like_new',
    price: 120,
    area: 'Harrow',
    description: 'Stunning emerald green and gold designer silk Banarasi saree. Worn exactly once for 3 hours at a family wedding. Excellent condition with zero snags or stains. Comes in original protective canvas storage bag. Blouse piece unstitched/fits sizes 8-12.',
    imageUrl: PRESET_ITEM_IMAGES[3].url,
    isAvailable: true,
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString()
  },
  {
    id: 'item-5',
    sellerId: 'user-seed-5',
    sellerName: 'Rajesh Shah',
    sellerEmail: 'rajesh.shah@urbanuk.co.uk',
    sellerPhone: '+44 7700 903344',
    title: 'DeLonghi Dedica Pump Espresso Machine',
    category: 'appliances',
    condition: 'good',
    price: 85,
    area: 'Kingsbury',
    description: 'Compact matte black DeLonghi espresso maker. 15-bar professional pressure, adjustable manual milk frother wand. Makes superb lattes and flat whites. Fully descaled last week. Selling because we are shifting to a bean-to-cup machine.',
    imageUrl: PRESET_ITEM_IMAGES[4].url,
    isAvailable: true,
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString()
  }
];

export default function HouseholdMarketplace({
  currentUser,
  currentProvider,
  currentCity,
  onOpenAuth,
  pushNotification,
  activeTheme = 'indigo'
}: HouseholdMarketplaceProps) {
  // Items & Interests State loaded from LocalStorage
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [interests, setInterests] = useState<MarketplaceInterest[]>([]);

  // Page level tabs: 'browse' | 'sell-item' | 'my-dashboard'
  const [activeSubTab, setActiveSubTab] = useState<'browse' | 'sell-item' | 'my-dashboard'>('browse');

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | 'all'>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');

  // New Listing Form State
  const [itemTitle, setItemTitle] = useState('');
  const [itemCategory, setItemCategory] = useState<MarketplaceCategory>('furniture');
  const [itemCondition, setItemCondition] = useState<'new' | 'like_new' | 'good' | 'fair'>('good');
  const [itemPrice, setItemPrice] = useState('');
  const [itemArea, setItemArea] = useState('Wembley');
  const [itemDesc, setItemDesc] = useState('');
  const [itemImgUrl, setItemImgUrl] = useState(PRESET_ITEM_IMAGES[0].url);

  // Manual image upload input helper
  const [customImgUrl, setCustomImgUrl] = useState('');
  const [isCustomImgActive, setIsCustomImgActive] = useState(false);

  // Direct seller communication contact detail modal
  const [selectedInterestItem, setSelectedInterestItem] = useState<MarketplaceItem | null>(null);
  const [interestMessage, setInterestMessage] = useState('Hi! I am very interested in purchasing your listed item. Please let me know when is a convenient time to view/collect it.');
  
  // Custom contact details for non-logged in or overriding details
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');

  // Hydrate states from localStorage or use premium seed data
  useEffect(() => {
    const storedItems = localStorage.getItem('urban_uk_marketplace_items');
    const storedInterests = localStorage.getItem('urban_uk_marketplace_interests');

    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
      setItems(SEED_MARKET_ITEMS);
      localStorage.setItem('urban_uk_marketplace_items', JSON.stringify(SEED_MARKET_ITEMS));
    }

    if (storedInterests) {
      setInterests(JSON.parse(storedInterests));
    }
  }, []);

  // Update localStorage when items change
  const saveItems = (updatedItems: MarketplaceItem[]) => {
    setItems(updatedItems);
    localStorage.setItem('urban_uk_marketplace_items', JSON.stringify(updatedItems));
  };

  // Update localStorage when interests change
  const saveInterests = (updatedInterests: MarketplaceInterest[]) => {
    setInterests(updatedInterests);
    localStorage.setItem('urban_uk_marketplace_interests', JSON.stringify(updatedInterests));
  };

  // Pre-fill buyer details when user changes
  useEffect(() => {
    if (currentUser) {
      setBuyerName(currentUser.name);
      setBuyerPhone(currentUser.phone);
      setBuyerEmail(currentUser.email);
    } else if (currentProvider) {
      setBuyerName(currentProvider.name);
      setBuyerPhone(currentProvider.phone);
      setBuyerEmail(currentProvider.email);
    } else {
      setBuyerName('');
      setBuyerPhone('');
      setBuyerEmail('');
    }
  }, [currentUser, currentProvider]);

  // Submit Listing
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();

    // Check auth or let user provide seller details (we will bind to logged in or require manual input)
    const activeSellerName = currentUser ? currentUser.name : (currentProvider ? currentProvider.name : buyerName);
    const activeSellerPhone = currentUser ? currentUser.phone : (currentProvider ? currentProvider.phone : buyerPhone);
    const activeSellerEmail = currentUser ? currentUser.email : (currentProvider ? currentProvider.email : buyerEmail);
    const activeSellerId = currentUser ? currentUser.id : (currentProvider ? currentProvider.id : 'anonymous-seller-' + Date.now());

    if (!activeSellerName || !activeSellerPhone || !activeSellerEmail) {
      pushNotification('Seller Details Missing', 'Please log in or fill out the Seller Contact details below to list your item.');
      return;
    }

    if (!itemTitle.trim() || !itemPrice || !itemDesc.trim()) {
      pushNotification('Missing Fields', 'Please complete all required fields before listing.');
      return;
    }

    const priceNum = parseFloat(itemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      pushNotification('Invalid Price', 'Please specify a valid selling price greater than £0.');
      return;
    }

    const finalImage = isCustomImgActive && customImgUrl.trim() ? customImgUrl.trim() : itemImgUrl;

    const newItem: MarketplaceItem = {
      id: 'item-' + Date.now(),
      sellerId: activeSellerId,
      sellerName: activeSellerName,
      sellerEmail: activeSellerEmail,
      sellerPhone: activeSellerPhone,
      title: itemTitle.trim(),
      category: itemCategory,
      condition: itemCondition,
      price: priceNum,
      area: itemArea,
      description: itemDesc.trim(),
      imageUrl: finalImage,
      isAvailable: true,
      createdAt: new Date().toISOString()
    };

    const updated = [newItem, ...items];
    saveItems(updated);

    pushNotification('Listing Successful', `Your "${itemTitle}" listing has been compiled and is now active across the UK diaspora!`);
    
    // Reset fields
    setItemTitle('');
    setItemPrice('');
    setItemDesc('');
    setCustomImgUrl('');
    setIsCustomImgActive(false);
    
    // Navigate to browse
    setActiveSubTab('browse');
  };

  // Submit Interest
  const handleExpressInterest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInterestItem) return;

    if (!buyerName.trim() || !buyerPhone.trim() || !buyerEmail.trim()) {
      pushNotification('Contact Info Required', 'Please provide your name, phone and email so the seller can contact you.');
      return;
    }

    const newInterest: MarketplaceInterest = {
      id: 'interest-' + Date.now(),
      itemId: selectedInterestItem.id,
      itemTitle: selectedInterestItem.title,
      sellerId: selectedInterestItem.sellerId,
      buyerId: currentUser ? currentUser.id : (currentProvider ? currentProvider.id : 'anon-buyer-' + Date.now()),
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim(),
      buyerPhone: buyerPhone.trim(),
      message: interestMessage.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [newInterest, ...interests];
    saveInterests(updated);

    pushNotification(
      'Interest Registered', 
      `Sent contact request for "${selectedInterestItem.title}". Direct seller details are now unlocked below.`
    );

    // Keep the model open so they can read the phone/email
    // But update the interest lists
  };

  // Delete Listing
  const handleDeleteListing = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    saveItems(updated);
    pushNotification('Listing Removed', 'Your classified item listing has been successfully deleted.');
  };

  // Mark Sold
  const handleToggleSold = (id: string, currentStatus: boolean) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, isAvailable: !currentStatus };
      }
      return item;
    });
    saveItems(updated);
    pushNotification(
      currentStatus ? 'Marked as Sold' : 'Marked as Available', 
      `Item status has been successfully updated.`
    );
  };

  // Filters application
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesArea = selectedArea === 'all' || item.area === selectedArea;
    const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;

    return matchesSearch && matchesCategory && matchesArea && matchesCondition;
  });

  const getConditionLabel = (condition: string) => {
    switch(condition) {
      case 'new': return 'Brand New';
      case 'like_new': return 'Like New / Mint';
      case 'good': return 'Good / Normal Wear';
      case 'fair': return 'Fair / Functional';
      default: return condition;
    }
  };

  const getConditionColor = (condition: string) => {
    switch(condition) {
      case 'new': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'like_new': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'good': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'fair': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Theme support
  const getThemeColorClass = () => {
    switch (activeTheme) {
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-700 text-white';
      case 'crimson': return 'bg-pink-600 hover:bg-pink-700 text-white';
      case 'lavender': return 'bg-teal-600 hover:bg-teal-700 text-white';
      case 'terracotta': return 'bg-orange-500 hover:bg-orange-600 text-white';
      default: return 'bg-indigo-600 hover:bg-indigo-700 text-white';
    }
  };

  const getThemeTextClass = () => {
    switch (activeTheme) {
      case 'emerald': return 'text-emerald-600';
      case 'crimson': return 'text-pink-600';
      case 'lavender': return 'text-teal-600';
      case 'terracotta': return 'text-orange-500';
      default: return 'text-indigo-600';
    }
  };

  const getThemeBorderClass = () => {
    switch (activeTheme) {
      case 'emerald': return 'border-emerald-600';
      case 'crimson': return 'border-pink-600';
      case 'lavender': return 'border-teal-600';
      case 'terracotta': return 'border-orange-500';
      default: return 'border-indigo-600';
    }
  };

  const getThemeBgLightClass = () => {
    switch (activeTheme) {
      case 'emerald': return 'bg-emerald-50';
      case 'crimson': return 'bg-pink-50';
      case 'lavender': return 'bg-teal-50';
      case 'terracotta': return 'bg-orange-50';
      default: return 'bg-indigo-50';
    }
  };

  const currentUserId = currentUser ? currentUser.id : (currentProvider ? currentProvider.id : '');

  // Calculate stats for Dashboard
  const myListedItems = items.filter(i => i.sellerId === currentUserId && currentUserId !== '');
  const myExpressedInterests = interests.filter(i => i.buyerId === currentUserId && currentUserId !== '');
  const interestsOnMyItems = interests.filter(i => i.sellerId === currentUserId && currentUserId !== '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="household-marketplace-portal">
      
      {/* Title & Banner Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-100/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
        <div className="space-y-3 relative z-10 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
            <Sparkles className="h-3 w-3 text-slate-950 animate-bounce" /> Buy & Sell Community Classifieds
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-white">
            Household Marketplace
          </h1>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Direct peer-to-peer bazaar for buying and selling quality used and new furniture, electrical goods, kitchen appliances, traditional clothes, and other household essentials with trust.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
          <button
            onClick={() => setActiveSubTab('browse')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'browse'
                ? 'bg-white text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Browse Items</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('sell-item')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'sell-item'
                ? 'bg-white text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Sell Something</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser && !currentProvider) {
                onOpenAuth();
                pushNotification('Authentication Required', 'Please sign in to view your Marketplace Dashboard.');
              } else {
                setActiveSubTab('my-dashboard');
              }
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'my-dashboard'
                ? 'bg-white text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserIcon className="h-4 w-4" />
            <span>My Classifieds Dashboard</span>
            {(myListedItems.length > 0 || myExpressedInterests.length > 0 || interestsOnMyItems.length > 0) && (
              <span className="bg-red-500 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-black animate-pulse">
                {myListedItems.length + myExpressedInterests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: BROWSE ITEMS & FILTER SECTION */}
      {activeSubTab === 'browse' && (
        <div className="space-y-6" id="browse-marketplace-view">
          
          {/* Advanced Filtering Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-4">
            
            {/* Search and Quick Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Live search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3.5 top-3 text-gray-400 h-4.5 w-4.5" />
                <input
                  type="text"
                  placeholder="Search furniture, appliances, electronics, ethnic clothes, keys, cookware..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200/80 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                />
              </div>

              {/* Area selector */}
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 text-gray-400 h-4.5 w-4.5" />
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200/80 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 appearance-none bg-white font-medium"
                >
                  <option value="all">📍 All UK Hubs</option>
                  {MARKET_AREAS.map(a => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>

              {/* Condition Selector */}
              <div className="relative">
                <Tag className="absolute left-3.5 top-3 text-gray-400 h-4.5 w-4.5" />
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200/80 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 appearance-none bg-white font-medium"
                >
                  <option value="all">🏷️ All Conditions</option>
                  <option value="new">Brand New</option>
                  <option value="like_new">Like New / Mint</option>
                  <option value="good">Good / Used</option>
                  <option value="fair">Fair / Functional</option>
                </select>
              </div>
            </div>

            {/* Horizontal Categories Filter List */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              <span className="text-[10px] font-black uppercase text-gray-400 mr-2 shrink-0 tracking-wider">Categories:</span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                }`}
              >
                All Classifieds
              </button>
              
              <button
                onClick={() => setSelectedCategory('furniture')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  selectedCategory === 'furniture'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                }`}
              >
                🪑 Furniture
              </button>

              <button
                onClick={() => setSelectedCategory('electrical')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  selectedCategory === 'electrical'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                }`}
              >
                ⚡ Electricals
              </button>

              <button
                onClick={() => setSelectedCategory('appliances')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  selectedCategory === 'appliances'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                }`}
              >
                📺 Appliances
              </button>

              <button
                onClick={() => setSelectedCategory('clothes')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  selectedCategory === 'clothes'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                }`}
              >
                👗 Clothes & Sarees
              </button>

              <button
                onClick={() => setSelectedCategory('household')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  selectedCategory === 'household'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                }`}
              >
                🍳 Kitchen & Household
              </button>

              <button
                onClick={() => setSelectedCategory('other')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  selectedCategory === 'other'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                }`}
              >
                📦 Others
              </button>
            </div>
          </div>

          {/* Items Display Grid */}
          {filteredItems.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-4 shadow-xs">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">No Listings Match Your Filters</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                Try widening your search keyword, selecting "All UK Hubs" or clearing out condition and category overrides.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedArea('all');
                  setSelectedCondition('all');
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group relative ${
                    !item.isAvailable ? 'opacity-65' : ''
                  }`}
                  id={`market-card-${item.id}`}
                >
                  {/* Item Image */}
                  <div className="h-48 sm:h-52 bg-gray-50 relative overflow-hidden shrink-0">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Dark gradient mask */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                    {/* Left overlay badge for category */}
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10">
                      {item.category.replace('_', ' ')}
                    </span>

                    {/* Right overlay badge for condition */}
                    <span className={`absolute top-3 right-3 border text-[9px] font-bold px-2.5 py-1 rounded-md ${getConditionColor(item.condition)}`}>
                      {getConditionLabel(item.condition)}
                    </span>

                    {/* Bottom visual overlay price tag */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-yellow-400 text-slate-950 font-black px-3 py-1.5 rounded-xl shadow-md text-xs border border-yellow-300">
                      <span>£{item.price}</span>
                    </div>

                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center backdrop-blur-xs">
                        <span className="bg-red-500 text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl border border-red-400 shadow-md">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" /> {item.area}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>

                      <h3 className="font-black text-xs text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-1">
                        {item.title}
                      </h3>

                      <p className="text-[11px] text-gray-500 leading-relaxed font-medium line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Seller details & contact trigger */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 border border-gray-200/50 flex items-center justify-center text-slate-600 text-xs font-bold">
                          {item.sellerName[0]}
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-900 block leading-tight">{item.sellerName}</span>
                          <span className="text-[9px] text-gray-400 block leading-none">Seller</span>
                        </div>
                      </div>

                      {item.isAvailable && (
                        <button
                          onClick={() => {
                            setSelectedInterestItem(item);
                            // Pre-fill with user message or generic
                            setInterestMessage(`Hi ${item.sellerName}! I am very interested in purchasing your listed item: "${item.title}" for £${item.price}. Please let me know when/where I can view or collect it.`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center gap-1 ${getThemeColorClass()}`}
                        >
                          <Phone className="h-3 w-3" />
                          <span>Show Interest</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: POST NEW LISTING */}
      {activeSubTab === 'sell-item' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm max-w-4xl mx-auto overflow-hidden" id="sell-marketplace-view">
          
          <div className="p-6 bg-slate-50 border-b border-gray-100 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl text-white ${getThemeBgLightClass()}`}>
              <Tag className={`h-5 w-5 ${getThemeTextClass()}`} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-950 uppercase tracking-tight">Post Classified Item For Sale</h2>
              <p className="text-[11px] text-gray-400">Fill in the details below to publish your item on the active community marketplace.</p>
            </div>
          </div>

          <form onSubmit={handleCreateListing} className="p-6 sm:p-8 space-y-6">
            
            {/* Seller Information Sync Alert */}
            {!currentUser && !currentProvider && (
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
                <Info className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-black text-orange-950 block text-[11px] uppercase">Anonymous Posting Enabled</span>
                  <p className="text-[10px] text-orange-900 leading-relaxed">
                    You are not logged in. To ensure buyers can reach you, please fill in your authentic contact details below, or <button type="button" onClick={onOpenAuth} className="font-extrabold text-orange-950 underline hover:text-orange-700 cursor-pointer">Login/Register First</button> to auto-fill.
                  </p>
                </div>
              </div>
            )}

            {currentUser && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-black text-emerald-950 block text-[11px] uppercase">Synced with Registered User Account</span>
                  <p className="text-[10px] text-emerald-800 leading-relaxed">
                    Listing will be tied to your verified phone (<strong>{currentUser.phone}</strong>) and email (<strong>{currentUser.email}</strong>). Buyers will be able to request these to coordinate collection.
                  </p>
                </div>
              </div>
            )}

            {currentProvider && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-black text-emerald-950 block text-[11px] uppercase">Synced with Registered Service Provider Profile</span>
                  <p className="text-[10px] text-emerald-800 leading-relaxed">
                    Listing will be tied to your professional contact card (<strong>{currentProvider.phone}</strong> / <strong>{currentProvider.email}</strong>).
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Item Title */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase text-slate-800">Item Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Dyson Vacuum Cleaner V11, Solid Oak Dining Table..."
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200/85 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase text-slate-800">Selling Price (£ GBP) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 font-bold text-xs">£</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 150"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-200/85 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium font-mono"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase text-slate-800">Category *</label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value as MarketplaceCategory)}
                  className="w-full px-4 py-2 border border-gray-200/85 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white font-medium"
                >
                  <option value="furniture">🪑 Furniture</option>
                  <option value="electrical">⚡ Electrical Goods</option>
                  <option value="appliances">📺 Household Appliances</option>
                  <option value="clothes">👗 Clothes & Sarees</option>
                  <option value="household">🍳 Kitchenware & General Household</option>
                  <option value="other">📦 Other Items</option>
                </select>
              </div>

              {/* Condition */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase text-slate-800">Item Condition *</label>
                <select
                  value={itemCondition}
                  onChange={(e) => setItemCondition(e.target.value as 'new' | 'like_new' | 'good' | 'fair')}
                  className="w-full px-4 py-2 border border-gray-200/85 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white font-medium"
                >
                  <option value="new">Brand New (Unopened, in original packaging)</option>
                  <option value="like_new">Like New (Mint condition, lightly used)</option>
                  <option value="good">Good / Used (Normal signs of wear, fully working)</option>
                  <option value="fair">Fair (Functional but has notable blemishes)</option>
                </select>
              </div>

              {/* Area location */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase text-slate-800">UK Collection Area *</label>
                <select
                  value={itemArea}
                  onChange={(e) => setItemArea(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200/85 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white font-medium"
                >
                  {MARKET_AREAS.map(area => (
                    <option key={area.value} value={area.value}>{area.label}</option>
                  ))}
                </select>
              </div>

              {/* Seller Contact override details (shown if anonymous) */}
              {!currentUser && !currentProvider && (
                <div className="sm:col-span-2 border border-orange-100 p-4 rounded-2xl bg-orange-50/20 space-y-4">
                  <span className="block text-[11px] font-black uppercase text-orange-950 tracking-wider">Seller Identity & Contact Details</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-gray-500">Your Full Name *</label>
                      <input 
                        type="text" 
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Rajesh Kumar" 
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                        required={!currentUser && !currentProvider}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-gray-500">Your Mobile Number *</label>
                      <input 
                        type="tel" 
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="+44 7700 900XXX" 
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-mono"
                        required={!currentUser && !currentProvider}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-gray-500">Your Email Address *</label>
                      <input 
                        type="email" 
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        placeholder="john.doe@email.co.uk" 
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                        required={!currentUser && !currentProvider}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-slate-800">Description & Collection Policy *</label>
              <textarea
                rows={4}
                placeholder="Describe your item details, dimensions, blemishes, age, any warranty, and collection constraints (e.g. must pick up on weekends, ground floor, etc.)"
                value={itemDesc}
                onChange={(e) => setItemDesc(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200/85 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                required
              />
            </div>

            {/* Photo Selection */}
            <div className="space-y-3">
              <label className="block text-[11px] font-black uppercase text-slate-800">Choose Item Photo *</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {PRESET_ITEM_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setItemImgUrl(img.url);
                      setIsCustomImgActive(false);
                    }}
                    className={`h-20 rounded-xl overflow-hidden border-2 relative transition-all cursor-pointer ${
                      itemImgUrl === img.url && !isCustomImgActive
                        ? 'border-indigo-600 scale-95 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] px-1 rounded">Preset {idx + 1}</span>
                  </button>
                ))}
              </div>

              {/* Custom Image Option */}
              <div className="border border-gray-100 p-4 rounded-xl bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="custom-img-toggle"
                    checked={isCustomImgActive}
                    onChange={(e) => setIsCustomImgActive(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="custom-img-toggle" className="text-[11px] font-extrabold text-slate-800 cursor-pointer">
                    I want to supply a custom web image URL
                  </label>
                </div>

                {isCustomImgActive && (
                  <input
                    type="url"
                    placeholder="Enter absolute image URL (e.g. https://images.unsplash.com/...)"
                    value={customImgUrl}
                    onChange={(e) => setCustomImgUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs"
                    required={isCustomImgActive}
                  />
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('browse')}
                className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-slate-700 text-xs font-bold cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all shadow-md ${getThemeColorClass()}`}
              >
                Publish Classified Item
              </button>
            </div>

          </form>

        </div>
      )}

      {/* VIEW 3: SELLER/BUYER PERSONAL CLASSIFIEDS DASHBOARD */}
      {activeSubTab === 'my-dashboard' && (
        <div className="space-y-8" id="dashboard-marketplace-view">
          
          {/* Top summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">My Active Listings</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900">{myListedItems.length}</span>
                <span className="text-xs text-gray-400">items posted</span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Offers & Inquiries Received</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900">{interestsOnMyItems.length}</span>
                <span className="text-xs text-emerald-600 font-bold">leads</span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">My Expressed Interests</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900">{myExpressedInterests.length}</span>
                <span className="text-xs text-indigo-600 font-bold">saved inquiries</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Section A: My Listings */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight pb-3 border-b border-gray-100">
                My Listed Items for Sale
              </h3>

              {myListedItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Package className="h-8 w-8 mx-auto" />
                  <p className="text-xs">You have not listed any marketplace items yet.</p>
                  <button
                    onClick={() => setActiveSubTab('sell-item')}
                    className={`text-[10px] font-bold underline ${getThemeTextClass()} cursor-pointer`}
                  >
                    List your first item now
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
                  {myListedItems.map(item => (
                    <div key={item.id} className="p-3 border border-gray-100 rounded-2xl flex items-center gap-3 bg-gray-50/40 hover:bg-gray-50 transition-all">
                      <img src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer" className="h-12 w-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black uppercase text-gray-400">{item.category}</span>
                        <strong className="block text-xs text-slate-900 truncate leading-snug">{item.title}</strong>
                        <span className="text-[10px] font-black text-indigo-600">£{item.price} • {item.area}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleSold(item.id, !item.isAvailable)}
                          className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black cursor-pointer border ${
                            item.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                              : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                          }`}
                        >
                          {item.isAvailable ? 'Mark Sold' : 'Make Available'}
                        </button>
                        <button
                          onClick={() => handleDeleteListing(item.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section B: Inquiries on My Items */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight pb-3 border-b border-gray-100">
                Inquiries Received from Potential Buyers
              </h3>

              {interestsOnMyItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-1">
                  <MessageSquare className="h-8 w-8 mx-auto" />
                  <p className="text-xs">No buyers have shown interest in your listings yet.</p>
                  <p className="text-[10px] text-gray-400">As soon as registered buyers show interest, their coordinates will display here.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                  {interestsOnMyItems.map(interest => (
                    <div key={interest.id} className="p-4 border border-gray-100 rounded-2xl bg-indigo-50/20 space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">Item: {interest.itemTitle}</span>
                          <span className="block font-black text-xs text-slate-900">{interest.buyerName}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-mono">
                          {new Date(interest.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100 font-medium leading-relaxed">
                        "{interest.message}"
                      </p>

                      <div className="flex flex-wrap gap-2.5 pt-1.5 border-t border-gray-100 text-[10px]">
                        <span className="flex items-center gap-1 text-slate-600 font-bold">
                          <Phone className="h-3 w-3 text-indigo-500" /> {interest.buyerPhone}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 font-bold">
                          <Mail className="h-3 w-3 text-indigo-500" /> {interest.buyerEmail}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section C: My Sent Inquiries */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4 lg:col-span-2">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight pb-3 border-b border-gray-100">
                My Inquiries on Other Listings (Express of Interests)
              </h3>

              {myExpressedInterests.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-1">
                  <Bookmark className="h-8 w-8 mx-auto" />
                  <p className="text-xs">You have not expressed interest in any listed products yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myExpressedInterests.map(interest => {
                    const matchedItem = items.find(i => i.id === interest.itemId);
                    return (
                      <div key={interest.id} className="p-4 border border-gray-100 rounded-2xl space-y-3 bg-gray-50/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="block text-xs text-slate-900">{interest.itemTitle}</strong>
                            <span className="text-[9px] text-gray-400">Inquiry Sent: {new Date(interest.createdAt).toLocaleDateString()}</span>
                          </div>
                          {matchedItem && (
                            <span className="bg-indigo-50 text-indigo-700 font-black text-[10px] px-2 py-0.5 rounded">
                              £{matchedItem.price}
                            </span>
                          )}
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-gray-100 text-[11px] text-slate-600 italic">
                          "{interest.message}"
                        </div>

                        {matchedItem ? (
                          <div className="pt-2 border-t border-gray-100 space-y-1 bg-slate-100/50 p-2 rounded-xl">
                            <span className="block text-[10px] font-black text-slate-800">Seller Contact (Unlocked):</span>
                            <div className="flex flex-col gap-1 text-[10px] text-slate-600">
                              <span className="flex items-center gap-1">
                                <UserIcon className="h-3 w-3 text-slate-400" /> {matchedItem.sellerName}
                              </span>
                              <span className="flex items-center gap-1 font-mono">
                                <Phone className="h-3 w-3 text-slate-400" /> {matchedItem.sellerPhone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-slate-400" /> {matchedItem.sellerEmail}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-red-500 italic font-medium">This item listing has been deleted by the seller.</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* MODAL / BOTTOM SHEET: BUYER INTEREST EXPRESSION */}
      {selectedInterestItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs" id="interest-modal">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl text-white ${getThemeBgLightClass()}`}>
                  <ShoppingBag className={`h-4.5 w-4.5 ${getThemeTextClass()}`} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-950 uppercase tracking-tight">Express Interest in Item</h3>
                  <p className="text-[10px] text-gray-400 truncate max-w-sm">Item: {selectedInterestItem.title} (£{selectedInterestItem.price})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInterestItem(null)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              
              {/* Product Brief card */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex gap-3">
                <img src={selectedInterestItem.imageUrl} alt={selectedInterestItem.title} className="h-14 w-14 rounded-lg object-cover shrink-0" />
                <div>
                  <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded uppercase">
                    {selectedInterestItem.category}
                  </span>
                  <span className="block font-black text-xs text-slate-900 mt-0.5">{selectedInterestItem.title}</span>
                  <span className="text-[10px] font-bold text-indigo-600">Listed price: £{selectedInterestItem.price} ({selectedInterestItem.area})</span>
                </div>
              </div>

              {/* Check if buyer has interest sent already */}
              {interests.some(int => int.itemId === selectedInterestItem.id && int.buyerId === currentUserId && currentUserId !== '') ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-950">
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="font-black text-[11px] uppercase tracking-wide">You have expressed interest!</span>
                  </div>
                  <p className="text-[10px] text-emerald-800 leading-relaxed">
                    Your contact request has been compiled. You can contact the seller directly using the unlocked coordinates below:
                  </p>
                  
                  <div className="p-3 bg-white border border-emerald-100 rounded-xl space-y-1.5 text-[11px] text-slate-700">
                    <span className="block font-black text-slate-900">Seller Contact Coordinates:</span>
                    <div className="flex items-center gap-1.5 font-bold">
                      <UserIcon className="h-3.5 w-3.5 text-gray-400" /> {selectedInterestItem.sellerName}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <Phone className="h-3.5 w-3.5 text-gray-400" /> {selectedInterestItem.sellerPhone}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-gray-400" /> {selectedInterestItem.sellerEmail}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleExpressInterest} className="space-y-4">
                  
                  {/* Buyer details input if not logged in */}
                  {!currentUser && !currentProvider && (
                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl space-y-3">
                      <span className="block text-[10px] font-black uppercase text-yellow-950 tracking-wider">Your Contact Details *</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-gray-500">Your Full Name</label>
                          <input
                            type="text"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                            placeholder="Rajesh Kumar"
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-gray-500">Your Phone</label>
                          <input
                            type="tel"
                            value={buyerPhone}
                            onChange={(e) => setBuyerPhone(e.target.value)}
                            placeholder="+44 7..."
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-mono"
                            required
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="block text-[9px] font-bold text-gray-500">Your Email</label>
                          <input
                            type="email"
                            value={buyerEmail}
                            onChange={(e) => setBuyerEmail(e.target.value)}
                            placeholder="john@email.com"
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black uppercase text-slate-800">Your Message to {selectedInterestItem.sellerName}</label>
                    <textarea
                      rows={3}
                      value={interestMessage}
                      onChange={(e) => setInterestMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200/80 rounded-xl text-xs"
                      required
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2.5 pt-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedInterestItem(null)}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-slate-600 hover:bg-gray-50 text-xs font-bold cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className={`px-5 py-2 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 ${getThemeColorClass()}`}
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Express Interest</span>
                    </button>
                  </div>

                </form>
              )}

              {/* Unlock Disclaimer */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-400 leading-relaxed flex gap-2">
                <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  Expressing interest registers your name, email and phone to the seller's classifieds panel. Direct contact coordinates are unlocked on both sides for safe community transactions.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedInterestItem(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[11px] px-4 py-1.5 rounded-lg cursor-pointer"
              >
                Close Panel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
