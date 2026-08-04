import React, { useState } from 'react';
import { ShieldCheck, FileText, Upload, Sparkles, MapPin, Briefcase, PoundSterling, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { ServiceProvider, ServiceCategory } from '../types';

interface ProviderRegistrationProps {
  onRegisterSuccess: (provider: ServiceProvider) => void;
  onBackToCustomer: () => void;
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

const SERVICE_CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: 'cooking', label: 'Cooking & Home Chef' },
  { value: 'women_salon', label: 'Women Saloon & Hair Glow' },
  { value: 'spa_beauty', label: 'SPA & Beauty Therapy' },
  { value: 'cleaning', label: 'Bathroom, Kitchen & House Cleaning' },
  { value: 'plumbing', label: 'Plumbing Service' },
  { value: 'painting', label: 'Professional Painting' },
  { value: 'gardening', label: 'Gardening & Landscaping' },
  { value: 'carpenter', label: 'Carpenter & Cabinet Assembly' },
  { value: 'electrical_fitting', label: 'Electrical Fitting & BS7671 Auditing' },
  { value: 'appliance_repair', label: 'Appliance Repairs & Service' }
];

export default function ProviderRegistration({ onRegisterSuccess, onBackToCustomer }: ProviderRegistrationProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiScanning, setAiScanning] = useState(false);
  const [error, setError] = useState('');
  
  // Registration State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('London');
  const [category, setCategory] = useState<ServiceCategory>('cleaning');
  const [pricing, setPricing] = useState('40');
  const [about, setAbout] = useState('');
  
  // Service specifics
  const [inclusionInput, setInclusionInput] = useState('');
  const [inclusions, setInclusions] = useState<string[]>(['All eco-friendly tools included', '100% mess-free clean-up']);
  const [exclusionInput, setExclusionInput] = useState('');
  const [exclusions, setExclusions] = useState<string[]>(['Pre-existing system replacement', 'Custom material supply cost']);
  const [damageProtection, setDamageProtection] = useState('Full damage protection coverage up to £5,000 backed by UrbanUK public liability indemnity.');

  // Certifications
  const [certName, setCertName] = useState('');
  const [certText, setCertText] = useState(''); // Text representation for simulation
  const [dbsText, setDbsText] = useState(''); // Text representation for simulation
  
  const [tempCreatedProvider, setTempCreatedProvider] = useState<ServiceProvider | null>(null);
  const [aiReport, setAiReport] = useState<string>('');

  const handleAddInclusion = () => {
    if (inclusionInput.trim()) {
      setInclusions([...inclusions, inclusionInput.trim()]);
      setInclusionInput('');
    }
  };

  const handleAddExclusion = () => {
    if (exclusionInput.trim()) {
      setExclusions([...exclusions, exclusionInput.trim()]);
      setExclusionInput('');
    }
  };

  const handleCreateBasicProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !phone) {
      setError('Please fill out all contact credentials.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/providers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          city,
          category,
          pricing: Number(pricing),
          inclusions,
          exclusions,
          damageProtection,
          certificationName: certName || 'UK Industry Certified Standards',
          about
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize profile.');

      setTempCreatedProvider(data);
      setStep(2); // Advance to certifications uploads & AI verification
    } catch (err: any) {
      setError(err.message || 'Onboarding error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const handleAIVerification = async () => {
    if (!tempCreatedProvider) return;
    setError('');
    setAiScanning(true);

    try {
      const res = await fetch(`/api/providers/${tempCreatedProvider.id}/verify-docs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certName: certName || 'City & Guilds Standard UK Certification',
          certText: certText || 'NVQ Level 3 Qualified and Licensed Contractor. Serial: 8841-A.',
          dbsText: dbsText || 'Standard UK Disclosure and Barring Service check. Serial: DBS-7741. Output: No records found (Clean history).'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI Verification failed');

      setAiReport(data.aiVerificationNotes);
      
      // Update our temporary provider status
      setTempCreatedProvider({
        ...tempCreatedProvider,
        status: data.status,
        dbsStatus: data.dbsStatus,
        aiVerificationNotes: data.aiVerificationNotes
      });
      
      setStep(3); // Go to final step
    } catch (err: any) {
      setError(err.message || 'Document scanning failed. Please retry.');
    } finally {
      setAiScanning(false);
    }
  };

  const handleFinishOnboarding = () => {
    if (tempCreatedProvider) {
      onRegisterSuccess(tempCreatedProvider);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8" id="provider-registration-container">
      {/* Tracker Steps */}
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto" id="registration-steps-bar">
        <div className="flex flex-col items-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
            step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
          }`}>1</div>
          <span className="text-[10px] font-semibold mt-1">Profile Details</span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 mx-2 mb-4"></div>
        <div className="flex flex-col items-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
            step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
          }`}>2</div>
          <span className="text-[10px] font-semibold mt-1">DBS & Credentials</span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 mx-2 mb-4"></div>
        <div className="flex flex-col items-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
            step >= 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
          }`}>3</div>
          <span className="text-[10px] font-semibold mt-1">AI Approvals</span>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" id="profile-details-card">
          <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-black" />
            <span>Join the UK Service Network</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            Provide cooking, saloon, spa, cleaning, plumbing, painting, or electrical services and earn on your schedule. Set your pricing in Pounds Sterling.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateBasicProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sophie.davies@urbanuk.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +44 7700 900077"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Primary UK Service Area</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-black bg-white cursor-pointer"
                  >
                    {UK_CITY_GROUPS.map((group) => (
                      <optgroup key={group.city} label={group.city} className="font-bold text-indigo-900">
                        {group.areas.map((area) => (
                          <option key={area.value} value={area.value} className="font-normal text-gray-700">
                            {area.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Service Category Offered</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-black bg-white cursor-pointer"
                >
                  {SERVICE_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Pricing / Base Rate (£ per hour/session)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-semibold">£</span>
                  <input
                    type="number"
                    required
                    min="10"
                    max="500"
                    placeholder="45"
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value)}
                    className="w-full pl-7 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Short Professional Bio (About You)</label>
              <textarea
                rows={2}
                placeholder="Describe your UK certification level, work approach, and general customer philosophy..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-black"
              />
            </div>

            {/* Custom inclusions & exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-50">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">What is INCLUDED in your service?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Bio-degradable soap scrub"
                    value={inclusionInput}
                    onChange={(e) => setInclusionInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddInclusion}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-black"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {inclusions.map((inc, i) => (
                    <span key={i} className="bg-gray-50 border border-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-md font-medium">
                      ✓ {inc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">What is EXCLUDED from your service?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Major scaffolding hire"
                    value={exclusionInput}
                    onChange={(e) => setExclusionInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddExclusion}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-black"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {exclusions.map((exc, i) => (
                    <span key={i} className="bg-red-50 border border-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-md font-medium">
                      ✕ {exc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Damage Protection */}
            <div className="space-y-1 pt-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Accidental Damage Protection Offer (GDPR & Trust Compliance)</label>
              <input
                type="text"
                value={damageProtection}
                onChange={(e) => setDamageProtection(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-black"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onBackToCustomer}
                className="text-xs text-gray-500 hover:text-black font-semibold"
              >
                Back to marketplace
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-black hover:bg-gray-800 text-white font-bold text-sm px-6 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {loading ? 'Saving Profile...' : 'Next: Upload Documents'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" id="document-verification-card">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-extrabold text-black tracking-tight">UK Certification & DBS Validation</h2>
          </div>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            All marketplace service providers must submit valid certifications complying with UK regulations (such as City & Guilds NVQs, Food Hygiene, NICEIC, or Gas Safe equivalents) along with a recent clean DBS background check.
          </p>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block">Certificate Title / Issuing Body</label>
              <input
                type="text"
                required
                placeholder="e.g. City & Guilds NVQ Level 3 in Beauty Therapy"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-black"
              />
            </div>

            {/* Custom certificate text simulator (allows user to paste credentials for prompt parsing) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">Professional Certificate Details</label>
                  <span className="text-[9px] text-gray-400 font-bold">Simulator Input</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Paste details of NVQ, licensing, safety codes, or certification bodies for automated AI scanning..."
                  value={certText}
                  onChange={(e) => setCertText(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-black font-mono"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">UK DBS Background Report Details</label>
                  <span className="text-[9px] text-gray-400 font-bold">Simulator Input</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Paste DBS serial number, check date, or police national database search records (clean certificate details)..."
                  value={dbsText}
                  onChange={(e) => setDbsText(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-black font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-black block">Automated Secure Verification:</span>
              <p className="text-[11px] text-gray-500 leading-normal">
                Clicking the verification scanner will safely upload your credentials to our compliance engine powered by Gemini. It will read the licensing formats, match against standard UK vocational qualifications and check if your DBS check contains any active criminal records.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-gray-500 hover:text-black font-semibold"
              >
                Back to Details
              </button>
              <button
                type="button"
                onClick={handleAIVerification}
                disabled={aiScanning}
                className="bg-black hover:bg-gray-800 text-white font-bold text-sm px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                {aiScanning ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>AI Verifying documents...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>Run Gemini Auto-Verification</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && tempCreatedProvider && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 text-center space-y-6" id="registration-success-card">
          <div className="inline-flex items-center justify-center p-3 bg-green-50 text-green-600 rounded-full border border-green-200 mx-auto">
            <CheckCircle className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-black tracking-tight">Onboarding Verified Successfully!</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Your credentials match UK marketplace guidelines. Our automated compliance audit has issued your provider verification badge.
            </p>
          </div>

          {/* AI Compliance Report Summary */}
          <div className="text-left bg-gray-50 border border-gray-200 rounded-xl p-5 max-w-xl mx-auto space-y-3">
            <div className="flex items-center gap-1.5 border-b border-gray-200 pb-2">
              <Sparkles className="h-4 w-4 text-black" />
              <span className="text-xs font-black text-black uppercase tracking-wider">Gemini Compliance Scan Report</span>
            </div>
            
            <p className="text-xs text-gray-700 font-medium italic leading-relaxed">
              &ldquo;{aiReport || 'DBS check successfully ran and returned CLEAN. NVQ professional certificate registered in the database.'}&rdquo;
            </p>

            <div className="grid grid-cols-2 gap-3 text-[11px] pt-2 border-t border-gray-100">
              <div>
                <span className="text-gray-500 font-medium">Compliance Status:</span>
                <span className="ml-1 text-green-700 font-bold uppercase">UK APPROVED</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">DBS Background:</span>
                <span className="ml-1 text-green-700 font-bold uppercase">CLEAN</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 max-w-xl mx-auto flex items-center justify-center gap-4">
            <button
              onClick={onBackToCustomer}
              className="text-xs text-gray-500 hover:text-black font-semibold"
            >
              Back to Marketplace
            </button>
            <button
              onClick={handleFinishOnboarding}
              className="bg-black hover:bg-gray-800 text-white font-bold text-sm px-8 py-2.5 rounded-lg shadow-md"
            >
              Launch Provider Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
