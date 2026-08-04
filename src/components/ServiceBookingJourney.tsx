import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  PoundSterling, 
  Briefcase, 
  Info, 
  Star, 
  Check, 
  AlertCircle, 
  ShoppingCart, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { ServiceDefinition, ServiceProvider, User, ServiceCategory } from '../types';

const AVAILABLE_CUISINES = ['Punjabi', 'South-Indian', 'Gujarati', 'Indo-Chinese', 'Marathi', 'Rajasthani', 'Mexican', 'Italian'];

const getParentCity = (location: string): string => {
  const locLower = location.toLowerCase();
  
  // London areas
  if (
    locLower.includes('london') ||
    ['wembley', 'harrow', 'southall', 'kingsbury', 'tooting', 'east ham', 'ilford', 'croydon'].includes(locLower)
  ) {
    return 'london';
  }
  
  // Leicestershire areas
  if (
    locLower.includes('leicester') ||
    ['oadby', 'loughborough', 'wigston', 'spinney hills'].includes(locLower)
  ) {
    return 'leicester';
  }
  
  // Northamptonshire areas
  if (
    locLower.includes('northampton') ||
    ['wellingborough', 'kettering', 'daventry'].includes(locLower)
  ) {
    return 'northamptonshire';
  }
  
  // Buckinghamshire areas
  if (
    locLower.includes('buckingham') ||
    ['milton keys', 'high wycombe', 'aylesbury', 'amersham'].includes(locLower)
  ) {
    return 'buckinghamshire';
  }
  
  // West Midlands areas
  if (
    locLower.includes('birmingham') ||
    ['coventry', 'wolverhampton', 'smethwick'].includes(locLower)
  ) {
    return 'birmingham';
  }
  
  return locLower;
};

interface ServiceBookingJourneyProps {
  currentCity: string;
  category: ServiceCategory;
  currentUser: User | null;
  onOpenAuth: () => void;
  onBookingCompleted: () => void;
}

export default function ServiceBookingJourney({
  currentCity,
  category,
  currentUser,
  onOpenAuth,
  onBookingCompleted
}: ServiceBookingJourneyProps) {
  // Service definition states
  const [services, setServices] = useState<ServiceDefinition[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceDefinition | null>(null);

  // Providers active in this city & category
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  // Form selections
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [requirements, setRequirements] = useState('');
  
  // Cooking options state
  const [cookingMethod, setCookingMethod] = useState<'veg' | 'non-veg' | 'jain'>('veg');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  
  // Cart summary
  const [advancePaymentOption, setAdvancePaymentOption] = useState<'full' | '30percent'>('full');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServicesAndProviders();
  }, [currentCity, category]);

  const fetchServicesAndProviders = async () => {
    try {
      const [resSrv, resProv] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/providers')
      ]);
      const srvs: ServiceDefinition[] = await resSrv.json();
      const provs: ServiceProvider[] = await resProv.json();

      const catServices = srvs.filter(s => s.category === category && s.isActive);
      setServices(catServices);
      if (catServices.length > 0) {
        setSelectedService(catServices[0]);
      }

      // Filter approved providers in this city & category
      const cityProvs = provs.filter(p => {
        const providerParentCity = getParentCity(p.city);
        const selectedParentCity = getParentCity(currentCity);
        return (
          (p.city.toLowerCase() === currentCity.toLowerCase() || providerParentCity === selectedParentCity) &&
          p.category === category &&
          p.status === 'approved'
        );
      });
      setProviders(cityProvs);
      if (cityProvs.length > 0) {
        setSelectedProvider(cityProvs[0]);
      } else {
        setSelectedProvider(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Pre-checkout login check
    if (!currentUser) {
      alert('You must be logged in to proceed with your booking. Opening registration form now.');
      onOpenAuth();
      return;
    }

    if (!selectedService || !selectedProvider) {
      setError('Please select a service option and an active UK service provider.');
      return;
    }

    if (!bookingDate) {
      setError('Please select a preferred service booking date.');
      return;
    }

    setLoading(true);

    // Billed amount calculation
    const basePrice = selectedProvider.pricing;
    const vat = basePrice * 0.20; // 20% Standard UK VAT
    const surcharge = 1.50; // Booking surcharge / trust cover
    const total = basePrice + vat + surcharge;
    const advancePaid = advancePaymentOption === '30percent' ? total * 0.30 : total;

    // Format requirements for cooking category
    let finalRequirements = requirements;
    if (category === 'cooking') {
      const cuisineText = selectedCuisines.length > 0 ? selectedCuisines.join(', ') : 'None selected';
      const cookingDetails = `[Dietary Preference: ${cookingMethod.toUpperCase()}] [Cuisines: ${cuisineText}]`;
      finalRequirements = finalRequirements 
        ? `${cookingDetails} | Instructions: ${finalRequirements}`
        : cookingDetails;
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          providerId: selectedProvider.id,
          serviceId: selectedService.id,
          date: bookingDate,
          time: bookingTime,
          requirements: finalRequirements,
          address: currentUser.addresses[0] || 'UK Area Address',
          advancePaid: advancePaid,
          paymentMethod: currentUser.walletBalance >= total ? 'Wallet Balance' : 'Card ending 4312'
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to file service booking.');
      }

      // Trigger notification & account view callback
      alert(`Booking created successfully! Your UK-compliant VAT invoice has been filed under ID ${selectedProvider.name.slice(0, 3).toUpperCase()}-BK.`);
      onBookingCompleted();
    } catch (err: any) {
      setError(err.message || 'Payment processing error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-8" id="booking-journey-component">
      
      {/* City Check */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-indigo-50/30 p-3 rounded-xl border border-indigo-100">
        <MapPin className="h-4 w-4 text-indigo-600 shrink-0" />
        <span>Booking for: <strong className="text-indigo-950 uppercase">{currentCity}, United Kingdom</strong></span>
      </div>

      {services.length === 0 ? (
        <div className="py-10 text-center">
          <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No specific service options active in {category.replace('_', ' ')} yet.</p>
        </div>
      ) : (
        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="checkout-form">
          
          {/* Service options, Questionnaire & inclusions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step A: Select service subtype */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wider">A. Choose Specific Service Option</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="service-options-list">
                {services.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={`border rounded-xl p-4 cursor-pointer hover:bg-indigo-50/20 transition-all relative ${
                      selectedService?.id === s.id ? 'border-indigo-600 bg-indigo-50/40 shadow-sm shadow-indigo-100' : 'border-gray-200 bg-white'
                    }`}
                  >
                    {selectedService?.id === s.id && (
                      <span className="absolute top-3 right-3 bg-indigo-600 text-white p-0.5 rounded-full">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <span className="font-extrabold text-indigo-950 text-xs block leading-tight">{s.name}</span>
                    <span className="text-[10px] text-gray-400 block mt-1 leading-normal">{s.description}</span>
                    <span className="text-xs font-bold text-gray-900 block mt-2">Est. Duration: {s.estimatedTime}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step B: Dynamic Questionnaire */}
            {selectedService && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wider">B. Complete Requirements Questionnaire</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Preferred Date</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      id="booking-date-input"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Preferred Arrival Time Slot</span>
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      id="booking-time-input"
                    >
                      <option value="09:00">Morning (09:00 - 11:00 AM)</option>
                      <option value="11:30">Midday (11:30 AM - 01:30 PM)</option>
                      <option value="14:00">Afternoon (02:00 - 04:00 PM)</option>
                      <option value="16:30">Evening (04:30 - 06:30 PM)</option>
                    </select>
                  </div>
                </div>

                {category === 'cooking' && (
                  <div className="space-y-4 pt-3 border-t border-gray-100/80">
                    {/* Cooking Method selection */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-950 block">
                        Dietary Preference (Cooking Method)
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['veg', 'non-veg', 'jain'] as const).map((method) => (
                          <button
                            type="button"
                            key={method}
                            onClick={() => setCookingMethod(method)}
                            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all uppercase tracking-wider cursor-pointer ${
                              cookingMethod === method
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Regional Cuisines selection */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-950 block">
                        Regional Cuisine Styles (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {AVAILABLE_CUISINES.map((cuisine) => {
                          const isSelected = selectedCuisines.includes(cuisine);
                          return (
                            <button
                              type="button"
                              key={cuisine}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
                                } else {
                                  setSelectedCuisines([...selectedCuisines, cuisine]);
                                }
                              }}
                              className={`py-2 px-2.5 rounded-lg text-[11px] font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold shadow-xs'
                                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              <span>{cuisine}</span>
                              {isSelected ? (
                                <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0 ml-1" />
                              ) : (
                                <div className="h-3 w-3 rounded-full border border-gray-300 shrink-0 ml-1" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-950">Special Instructions / Allergies / Access Codes</label>
                  <textarea
                    rows={2}
                    placeholder="Provide any specific notes (e.g. key safebox details, pet warnings, specific allergies or task specifications)..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                    id="booking-requirements"
                  />
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions Summary */}
            {selectedService && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-gray-50 border border-gray-200 rounded-2xl">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 block mb-2 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> What is INCLUDED
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-gray-600 font-medium">
                    {selectedService.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-green-600">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 block mb-2 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5 text-red-600" /> What is EXCLUDED
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-gray-600 font-medium">
                    {selectedService.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-red-500">✕</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Service Provider selection, Invoicing Cart & Payment Checkout */}
          <div className="space-y-6">
            
            {/* Step C: Select Active Provider */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wider">C. Choose Verified Professional</h3>
              {providers.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>No verified professionals currently online in <strong>{currentCity}</strong> for this task. Admin can approve pending providers under Admin panel.</p>
                </div>
              ) : (
                <div className="space-y-2" id="available-providers-list">
                  {providers.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProvider(p)}
                      className={`border rounded-xl p-3.5 cursor-pointer hover:bg-indigo-50/20 transition-all flex items-center gap-3 relative ${
                        selectedProvider?.id === p.id ? 'border-indigo-600 bg-indigo-50/40 shadow-sm shadow-indigo-100' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="h-10 w-10 bg-indigo-600 text-white font-extrabold flex items-center justify-center rounded-full uppercase shrink-0 text-xs">
                        {p.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-extrabold text-xs text-indigo-950 block truncate leading-none">{p.name}</span>
                          <span className="bg-green-50 text-green-700 text-[8px] font-black uppercase px-1 py-0.5 rounded-sm shrink-0 border border-green-200">
                            DBS CLEAN
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-1">Specialist price: <strong>£{p.pricing}</strong></span>
                        
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="flex items-center gap-0.5 bg-yellow-50 text-yellow-700 text-[9px] font-black px-1.5 py-0.5 rounded-sm border border-yellow-200">
                            <Star className="h-3 w-3 fill-yellow-700 text-yellow-700" />
                            <span>{p.rating}</span>
                          </div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase">{p.reviewsCount} reviews</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step D: Invoicing & Checkout cart */}
            {selectedService && selectedProvider && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4" id="pricing-cart">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block border-b border-gray-200 pb-2">UK Compliance Bill Summary</span>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-500">Service Base Cost:</span>
                    <span className="font-bold text-indigo-950">£{selectedProvider.pricing.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-gray-400">UK Standard VAT (20%):</span>
                    <span className="font-bold text-indigo-950">£{(selectedProvider.pricing * 0.20).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-gray-400">Trust cover surcharge:</span>
                    <span className="font-bold text-indigo-950">£1.50</span>
                  </div>

                  {/* Wallet Discount Indicator if applicable */}
                  {currentUser && currentUser.walletBalance > 0 && (
                    <div className="flex justify-between text-[11px] font-bold text-green-700">
                      <span>Applied Wallet Bonus discount:</span>
                      <span>-£{Math.min(currentUser.walletBalance, selectedProvider.pricing * 1.2 + 1.5).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-sm">
                    <span className="font-black text-indigo-950">Estimated Total:</span>
                    <span className="font-black text-indigo-950">
                      £{Math.max(0, (selectedProvider.pricing * 1.20 + 1.50) - (currentUser ? currentUser.walletBalance : 0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Advance payment option */}
                <div className="pt-2 border-t border-gray-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Choose Payment Mode</span>
                  <div className="flex gap-2" id="payment-mode-toggles">
                    <button
                      type="button"
                      onClick={() => setAdvancePaymentOption('full')}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                        advancePaymentOption === 'full' 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100' 
                          : 'bg-white text-gray-500 border-gray-200 hover:text-indigo-600'
                      }`}
                    >
                      Pay Full Amount
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdvancePaymentOption('30percent')}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                        advancePaymentOption === '30percent' 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100' 
                          : 'bg-white text-gray-500 border-gray-200 hover:text-indigo-600'
                      }`}
                    >
                      Pay 30% Deposit
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg">
                    {error}
                  </div>
                )}

                {/* Confirm & checkout button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                  id="checkout-confirm-button"
                >
                  {loading ? (
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : !currentUser ? (
                    <>
                      <UserCheck className="h-4 w-4 text-amber-300" />
                      <span>Sign In & Book Now</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      <span>Confirm Home Booking</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
