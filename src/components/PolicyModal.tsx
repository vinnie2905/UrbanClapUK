import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  Award, 
  Briefcase, 
  BookOpen, 
  HeartHandshake, 
  FileText, 
  Heart, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface PolicyModalProps {
  pageKey: string | null;
  onClose: () => void;
  onNavigateToService: () => void;
  onNavigateToRentals: () => void;
}

export default function PolicyModal({ pageKey, onClose, onNavigateToService, onNavigateToRentals }: PolicyModalProps) {
  if (!pageKey) return null;

  // Render content based on page key
  const renderContent = () => {
    switch (pageKey) {
      // COMPANY
      case 'about_us':
        return {
          title: 'Company -> About Us',
          icon: <Users className="h-6 w-6 text-indigo-600 animate-pulse" />,
          subtitle: 'The leading on-demand domestic services marketplace for the UK South Asian community.',
          body: (
            <div className="space-y-6 text-xs text-gray-600 leading-relaxed">
              <p>
                Founded on the pillars of **trust, convenience, and community heritage**, UrbanUK brings premium, verified household services directly to your doorstep. We specialize in catering to the unique cultural and practical needs of the South Asian diaspora and wider communities throughout the United Kingdom.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <span className="font-black text-indigo-900 block text-xs">Vetted & Licensed Professionals</span>
                  <p className="text-[11px] text-gray-500 mt-1">Every provider on our platform undergoes strict identity checks, DBS criminal record verification, and holds active public liability insurance.</p>
                </div>
                <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                  <span className="font-black text-orange-900 block text-xs">Cultural Familiarity</span>
                  <p className="text-[11px] text-gray-500 mt-1">From pure vegetarian home-style cooking and traditional South Asian beauty care to custom carpentry, we speak your language and respect your home.</p>
                </div>
              </div>
              <h4 className="font-black text-indigo-950 uppercase text-xs pt-2">Our Mission</h4>
              <p>
                To provide safe, secure, and hassle-free services with absolute pricing transparency. By bridging the gap between skilled freelance professionals and busy households, we enable seamless bookings while fostering economic empowerment and fair-wage welfare for independent tradespeople in the UK.
              </p>
              <div className="bg-yellow-50/40 p-4 rounded-xl border border-yellow-100 text-center space-y-2">
                <p className="font-bold text-yellow-900">Need a quick household solution today?</p>
                <button 
                  onClick={() => { onClose(); onNavigateToService(); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-1.5 rounded-lg text-[11px] cursor-pointer"
                >
                  Book a Service Now
                </button>
              </div>
            </div>
          )
        };

      case 'anti_discrimination':
        return {
          title: 'Company -> Anti Discrimination Policy',
          icon: <ShieldCheck className="h-6 w-6 text-red-600" />,
          subtitle: 'Zero Tolerance Policy for Discrimination in the Workplace & Home Services.',
          body: (
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <p>
                UrbanUK is committed to providing a safe, respectful, and inclusive environment. We maintain a strict, absolute **zero-tolerance policy** against discrimination of any form.
              </p>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-950">
                <strong className="block text-xs uppercase font-black tracking-wide">Protected Attributes Covered:</strong>
                <p className="text-[11px] text-red-800 mt-1">
                  Race, nationality, language, religious beliefs, sect, caste, age, physical/mental disability, gender, gender identity, marital status, or sexual orientation.
                </p>
              </div>
              <h4 className="font-black text-indigo-950 uppercase text-xs pt-2">For Service Professionals & Customers:</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Equal Respect:</strong> No service provider may refuse service or decline a job based on the customer's identity, background, or religious household attributes.
                </li>
                <li>
                  <strong>Safe Working Spaces:</strong> Customers must treat all visiting service professionals with dignity. Any verbal abuse, derogatory slurs, or discriminatory behavior will result in an immediate lifetime ban from the platform.
                </li>
                <li>
                  <strong>Fair Allocation:</strong> Our automated matchmaking and subscription queues are governed purely by geography, certification levels, and performance scores. No human bias interferes with lead allocation.
                </li>
              </ul>
              <p className="text-[11px] text-gray-400">
                If you experience or witness any behavior violating these terms, please contact our Compliance Officer immediately at <span className="text-indigo-600 underline font-semibold">compliance@urbanuk.co.uk</span>. All reports are handled with maximum confidentiality.
              </p>
            </div>
          )
        };

      case 'security_policy':
        return {
          title: 'Company -> Information Security Statement & Objectives',
          icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
          subtitle: 'ISO/IEC 27001 Aligned Security Standards Protecting Customer & Partner Data.',
          body: (
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <p>
                At UrbanUK, safeguarding your personal data, biometric configurations, transaction logs, and messaging channels is a core corporate priority. Our information security practices are built to align with the **UK GDPR** and **ISO/IEC 27001 framework**.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                <div className="border border-gray-100 p-3 rounded-lg text-center bg-gray-50">
                  <span className="font-black text-indigo-950 block text-xs">256-Bit SSL</span>
                  <span className="text-[10px] text-gray-400">All browser and app communication is encrypted.</span>
                </div>
                <div className="border border-gray-100 p-3 rounded-lg text-center bg-gray-50">
                  <span className="font-black text-indigo-950 block text-xs">Tokenized Payments</span>
                  <span className="text-[10px] text-gray-400">Card details are never saved locally. Stripe-level tokens.</span>
                </div>
                <div className="border border-gray-100 p-3 rounded-lg text-center bg-gray-50">
                  <span className="font-black text-indigo-950 block text-xs">Vetted Cloud</span>
                  <span className="text-[10px] text-gray-400">Secure European hosting centers with zero-trust firewalls.</span>
                </div>
              </div>
              <h4 className="font-black text-indigo-950 uppercase text-xs pt-2">Our Key Security Objectives:</h4>
              <ul className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Confidentiality:</strong> Ensure address lists and phone numbers are encrypted and only revealed to a service professional once a booking is confirmed and paid.
                </li>
                <li>
                  <strong>Integrity:</strong> Protect ratings and financial logs from unauthorized manipulation. Review algorithms are strictly auditable.
                </li>
                <li>
                  <strong>Availability:</strong> Achieve 99.9% uptime on our on-demand server cluster so customers can request emergency plumbing or childminding without delay.
                </li>
              </ul>
              <p>
                We conduct biannual independent vulnerability assessments. For reporting security vulnerabilities or inquiries regarding data subject access requests, contact <span className="text-indigo-600 underline font-semibold">security@urbanuk.co.uk</span>.
              </p>
            </div>
          )
        };

      case 'careers':
        return {
          title: 'Company -> Careers @ UrbanUK',
          icon: <Briefcase className="h-6 w-6 text-indigo-600" />,
          subtitle: 'Build the future of local services. Join our regional operations and technology teams.',
          body: (
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <p>
                UrbanUK is rapidly growing across the UK! We are looking for energetic, passionate individuals who want to redefine local services and support the South Asian independent trade community.
              </p>
              <h4 className="font-black text-indigo-950 uppercase text-xs">Open Positions in the UK (London, Leicester, Birmingham):</h4>
              <div className="space-y-2">
                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-black text-indigo-950 block">Regional Operations Manager (Midlands)</span>
                    <span className="text-[10px] text-gray-400">Leicester / Birmingham • Full-time • £38,000 - £45,000/yr</span>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded">Apply Now</span>
                </div>
                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-black text-indigo-950 block">Service Quality inspector & DBS Auditor</span>
                    <span className="text-[10px] text-gray-400">Greater London (Wembley Hub) • Full-time • £32,000 - £36,000/yr</span>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded">Apply Now</span>
                </div>
                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-black text-indigo-950 block">Senior Full Stack React Native Developer</span>
                    <span className="text-[10px] text-gray-400">Remote (UK-based) • Full-time • £65,000 - £80,000/yr</span>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded">Apply Now</span>
                </div>
              </div>
              <h4 className="font-black text-indigo-950 uppercase text-xs pt-2">Why work at UrbanUK?</h4>
              <p>
                We offer competitive wages, flexible working schedules, comprehensive healthcare cover, and a direct opportunity to work with an highly inclusive team that makes a genuine difference in the daily lives of thousands of families. Send your CV to <span className="text-indigo-600 font-semibold underline">careers@urbanuk.co.uk</span>!
              </p>
            </div>
          )
        };

      // FOR SERVICE PROFESSIONALS
      case 'privacy_policy':
        return {
          title: 'Service Professional -> Privacy Policy',
          icon: <FileText className="h-6 w-6 text-indigo-600" />,
          subtitle: 'How we collect, verify, and safeguard partner data and DBS records.',
          body: (
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <p>
                As a registered Service Professional on UrbanUK, your privacy is paramount. This policy documents how we collect and process your personal details, tax registrations, and criminal checks.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Verification Records:</strong> We securely transmit your DBS certificates and national IDs strictly to certified verification agencies. Once verified, absolute clearance tags are added, and document files are encrypted.
                </li>
                <li>
                  <strong>Geo-Location Tracking:</strong> To optimize service bookings, our app tracks geographic location only when you toggle your dashboard status to 'Online'. It is strictly deactivated otherwise.
                </li>
                <li>
                  <strong>No Marketing Exploitation:</strong> Your contact information (email, phone) is never sold to third-party marketing brokers. It is only shared with customers who have confirmed and pre-paid bookings with you.
                </li>
              </ul>
              <p>
                To request complete data extraction or exercise your right to erasure, please contact the Data Protection Officer at <span className="text-indigo-600 underline font-semibold">dpo@urbanuk.co.uk</span>.
              </p>
            </div>
          )
        };

      case 'welfare_policy':
        return {
          title: 'Service Professional -> Welfare Policy',
          icon: <HeartHandshake className="h-6 w-6 text-rose-600" />,
          subtitle: 'Supporting our independent partners with healthcare, insurance, and emergency grants.',
          body: (
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <p>
                At UrbanUK, we believe our service partners are the heartbeat of the company. Unlike standard gig platforms, we actively run a dedicated **Service Professionals Welfare Fund** to protect our tradesmen, cooking pros, and beauticians.
              </p>
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 my-3 text-rose-950">
                <span className="font-black block uppercase text-xs tracking-wider">Welfare Benefits Offered:</span>
                <ul className="list-disc pl-5 space-y-1 mt-1 text-[11px] text-rose-900">
                  <li><strong>Free Public Liability Cover:</strong> Included automatically on all bookings completed through the app.</li>
                  <li><strong>Accident & Injury Insurance:</strong> Up to £5,000 protection coverage for accidents occurring while on-site.</li>
                  <li><strong>Emergency Interest-Free Loan Support:</strong> Apply for up to £500 to cover tools replacement or urgent transit repair.</li>
                  <li><strong>Health & Eye Care:</strong> Annual free physical and eye health consultations in Wembley, Leicester and Birmingham hubs.</li>
                </ul>
              </div>
              <h4 className="font-black text-indigo-950 uppercase text-xs pt-2">Eligibility Guidelines:</h4>
              <p>
                All partners who maintain an active rating above **4.2 stars** and complete at least **15 service bookings per month** are enrolled automatically. We are committed to fostering a sustainable, healthy, and high-earning environment.
              </p>
            </div>
          )
        };

      case 'terms_conditions':
        return {
          title: 'Service Professional -> Terms & Conditions',
          icon: <FileText className="h-6 w-6 text-indigo-600" />,
          subtitle: 'The legal framework governing bookings, platform commissions, and cancellation terms.',
          body: (
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <p>
                These terms govern the relationship between independent service licensees and the UrbanUK marketplace platform.
              </p>
              <ul className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Independent Contractors:</strong> Service Professionals are self-employed independent contractors. They set their own availability but agree to charge prices matching platform standards for fairness.
                </li>
                <li>
                  <strong>Commission & Fees:</strong> UrbanUK charges a nominal commission on booking revenues to cover marketing, VAT compilation, billing, insurance, and system support.
                </li>
                <li>
                  <strong>Quality Commitments:</strong> Providers must complete tasks diligently. Failure to appear on scheduled bookings twice without robust medical reasoning will lead to dynamic account suspension.
                </li>
                <li>
                  <strong>Public Indemnity:</strong> In case of property damage, our liability insurance caps at £2,000,000, provided the provider logged the start and completion times in-app.
                </li>
              </ul>
              <p className="text-[11px] text-gray-400">
                Please review the full, un-abbreviated Partner Terms of Agreement on our corporate site before accepting booking matches.
              </p>
            </div>
          )
        };

      case 'community':
        return {
          title: 'Service Professional -> Partner Lounge & Community',
          icon: <Users className="h-6 w-6 text-indigo-600 animate-bounce" />,
          subtitle: 'Where South Asian tradesmen, beauticians, and home-cooks share tips and coordinate.',
          body: (
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <p>
                Welcome to the official **UrbanUK Partner Lounge**! Join discussions with other professional cooks, painters, plumbers, and beauty experts across London and the Midlands.
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100">
                  <span className="font-black text-indigo-950 block text-[11px]">📢 Wembley Indian Chef Meetup</span>
                  <p className="text-[10px] text-gray-500 mt-0.5">"Great discussion on sourcing bulk spices and complying with Brent Council health certificates. Thanks everyone for attending!"</p>
                  <span className="text-[9px] text-indigo-600 block font-bold mt-1">12 Comments • Active Thread</span>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-black text-gray-800 block text-[11px]">🛠️ Tip: How to clear BS7671 electrical audits</span>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-sans">"For any electrical fitters in Leicester, make sure to keep your calibration certificate handy on the app before booking jobs."</p>
                  <span className="text-[9px] text-gray-400 block mt-1">Posted by Harpreet Singh • 4 hours ago</span>
                </div>
              </div>

              <div className="bg-yellow-50/40 border border-yellow-200 p-4 rounded-xl text-center space-y-1">
                <p className="font-bold text-yellow-950">Looking for room shares or rentals close to Wembley or Southall?</p>
                <p className="text-[11px] text-gray-500">Service partners often publish houses and shared rooms for rent area-wise on our platform!</p>
                <button 
                  onClick={() => { onClose(); onNavigateToRentals(); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-1.5 rounded-lg text-[10px] mt-2 cursor-pointer"
                >
                  Go to Property Rentals
                </button>
              </div>
            </div>
          )
        };

      case 'blog':
        return {
          title: 'Service Professional -> The UrbanUK Blog',
          icon: <BookOpen className="h-6 w-6 text-indigo-600" />,
          subtitle: 'Expert tips on South Asian cooking techniques, British winter home care, and trends.',
          body: (
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <p>
                Stay ahead of the curve with expert home-keeping tips, Indian festive recipe planning, and home improvement trends curated by our high-rated professionals.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all">
                  <div className="h-28 bg-gray-200 relative">
                    <img src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=300&q=80" alt="Indian cooking spices" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[9px] font-bold text-orange-600 uppercase">Culinary Tips</span>
                    <strong className="text-xs text-gray-900 block font-black leading-tight">Authentic Homestyle Gujarati Meals in Bulk</strong>
                    <p className="text-[10px] text-gray-400">How our high-rated home cooks prepare traditional rotis and daals for big Leicester households.</p>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all">
                  <div className="h-28 bg-gray-200 relative">
                    <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80" alt="Beauty salon treatment" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase">Beauty & Spa</span>
                    <strong className="text-xs text-gray-900 block font-black leading-tight">Traditional Haldi & Herbal Facials Guide</strong>
                    <p className="text-[10px] text-gray-400">Discover pure Ayurvedic facial packs and wedding season grooming tips straight from professional beauticians.</p>
                  </div>
                </div>
              </div>
            </div>
          )
        };

      default:
        return {
          title: 'Information Desk',
          icon: <HelpCircle className="h-6 w-6 text-indigo-600" />,
          subtitle: 'Regulatory Compliance Information',
          body: <p className="text-xs text-gray-500">We are dedicated to maintaining professional compliance and community standards across the UK.</p>
        };
    }
  };

  const page = renderContent();

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs" id="policy-pages-modal">
      <div className="bg-white rounded-3xl border border-gray-100 max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative animate-scale-up">
        
        {/* Header (Sticky) */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl border border-gray-200/60 shadow-xs shrink-0 flex items-center justify-center">
              {page.icon}
            </div>
            <div>
              <h2 className="text-sm font-black text-indigo-950 uppercase tracking-tight">{page.title}</h2>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{page.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {page.body}
        </div>

        {/* Footer (Sticky) */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-2 rounded-xl cursor-pointer transition-all shadow-xs"
          >
            Close Page
          </button>
        </div>

      </div>
    </div>
  );
}
