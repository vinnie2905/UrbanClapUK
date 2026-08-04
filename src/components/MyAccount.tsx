import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  CreditCard, 
  Gift, 
  HelpCircle, 
  PoundSterling, 
  MessageSquare, 
  FileText, 
  Sparkles, 
  DollarSign, 
  Euro, 
  Check, 
  ShieldAlert, 
  ArrowRight,
  Send,
  User as UserIcon
} from 'lucide-react';
import { User, ServiceProvider, Booking, Message, Invoice, Review } from '../types';

interface MyAccountProps {
  currentUser: User | null;
  currentProvider: ServiceProvider | null;
  onUpdateUser: (user: User) => void;
  onUpdateProvider: (provider: ServiceProvider) => void;
}

export default function MyAccount({ 
  currentUser, 
  currentProvider, 
  onUpdateUser, 
  onUpdateProvider 
}: MyAccountProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'wallet' | 'referrals' | 'invoices' | 'help' | 'settings'>('bookings');
  
  // Selected objects for modal views
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  // Ratings
  const [ratingInput, setRatingInput] = useState('5');
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Subscription Checkout
  const [checkoutCurrency, setCheckoutCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP');
  const [subscriptionProcessing, setSubscriptionProcessing] = useState(false);

  // Help Bot
  const [helpMessages, setHelpMessages] = useState<{ sender: 'bot' | 'user'; content: string }[]>([
    { sender: 'bot', content: 'Hi! I am the UrbanUK support assistant. How can I help you today? Ask me about booking policies, VAT invoices, or DBS checks.' }
  ]);
  const [helpInput, setHelpInput] = useState('');
  const [helpLoading, setHelpLoading] = useState(false);

  // Address & Cards management
  const [newAddress, setNewAddress] = useState('');
  const [walletAmount, setWalletAmount] = useState('25');

  // Referral Management States
  const [referralsList, setReferralsList] = useState<any[]>([]);
  const [refFriendName, setRefFriendName] = useState('');
  const [refFriendEmail, setRefFriendEmail] = useState('');
  const [refFriendPhone, setRefFriendPhone] = useState('');

  useEffect(() => {
    const storedReferrals = localStorage.getItem('urbanuk_referrals');
    if (storedReferrals) {
      setReferralsList(JSON.parse(storedReferrals));
    } else {
      const defaultRefs = [
        {
          id: 'ref-1',
          userId: currentUser?.id || 'guest',
          friendName: 'Rohan Mehta',
          friendEmail: 'rohan.mehta@gmail.com',
          friendPhone: '+44 7700 900501',
          status: 'completed',
          rewardEarned: 15,
          createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: 'ref-2',
          userId: currentUser?.id || 'guest',
          friendName: 'Anjali Deshmukh',
          friendEmail: 'anjali.d@outlook.com',
          friendPhone: '+44 7700 900502',
          status: 'registered',
          rewardEarned: 0,
          createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: 'ref-3',
          userId: currentUser?.id || 'guest',
          friendName: 'Gaurav Gill',
          friendEmail: 'gaurav.gill99@gmail.com',
          friendPhone: '+44 7700 900503',
          status: 'invited',
          rewardEarned: 0,
          createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
        }
      ];
      setReferralsList(defaultRefs);
      localStorage.setItem('urbanuk_referrals', JSON.stringify(defaultRefs));
    }
  }, [currentUser?.id]);

  const isProviderRole = currentProvider !== null;
  const targetId = isProviderRole ? currentProvider?.id : currentUser?.id;
  const isDirectContactLocked = isProviderRole 
    ? ((currentProvider?.bookingsCount || 0) >= 10 && !currentProvider?.subscriptionPaid)
    : ((currentUser?.bookingsCount || 0) >= 10 && !currentUser?.subscriptionPaid);

  useEffect(() => {
    fetchBookings();
  }, [targetId]);

  const fetchBookings = async () => {
    if (!targetId) return;
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (isProviderRole) {
        setBookings(data.filter((b: Booking) => b.providerId === targetId));
      } else {
        setBookings(data.filter((b: Booking) => b.userId === targetId));
      }
    } catch (e) {
      console.error('Error fetching bookings:', e);
    }
  };

  const loadChatMessages = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`);
      const data = await res.json();
      setChatMessages(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedBooking || !chatInput.trim()) return;
    const senderRole = isProviderRole ? 'provider' : 'user';
    const senderName = isProviderRole ? currentProvider?.name : currentUser?.name;

    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: senderRole,
          senderName,
          content: chatInput.trim()
        })
      });
      if (res.ok) {
        setChatInput('');
        loadChatMessages(selectedBooking.id);

        // Simulate automatic provider/user response for real-time interaction
        setTimeout(async () => {
          await fetch(`/api/bookings/${selectedBooking.id}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              senderId: senderRole === 'user' ? 'provider' : 'user',
              senderName: senderRole === 'user' ? selectedBooking.providerName : selectedBooking.userName,
              content: `Hello! Thanks for your message. I am currently reviewing your request regarding: "${chatInput.trim()}". I will get back to you shortly.`
            })
          });
          loadChatMessages(selectedBooking.id);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchBookings();
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: status as any });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleInviteFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refFriendName.trim() || !refFriendEmail.trim()) return;

    const newInvite = {
      id: `ref-${Date.now()}`,
      userId: currentUser?.id || currentProvider?.id || 'guest',
      friendName: refFriendName.trim(),
      friendEmail: refFriendEmail.trim(),
      friendPhone: refFriendPhone.trim() || 'N/A',
      status: 'invited' as const,
      rewardEarned: 0,
      createdAt: new Date().toISOString()
    };

    const updated = [newInvite, ...referralsList];
    setReferralsList(updated);
    localStorage.setItem('urbanuk_referrals', JSON.stringify(updated));

    // Reset Form
    setRefFriendName('');
    setRefFriendEmail('');
    setRefFriendPhone('');

    // Progressive status simulator: After 15 seconds, mock friend registering
    setTimeout(() => {
      const currentList = JSON.parse(localStorage.getItem('urbanuk_referrals') || '[]');
      const index = currentList.findIndex((r: any) => r.id === newInvite.id);
      if (index !== -1) {
        currentList[index].status = 'registered';
        setReferralsList(currentList);
        localStorage.setItem('urbanuk_referrals', JSON.stringify(currentList));
      }
    }, 15000);
  };

  const handleRedeemReferral = async (refId: string) => {
    if (!currentUser) return;
    const updated = referralsList.map(r => {
      if (r.id === refId) {
        return { ...r, status: 'claimed' };
      }
      return r;
    });
    setReferralsList(updated);
    localStorage.setItem('urbanuk_referrals', JSON.stringify(updated));

    try {
      const res = await fetch(`/api/users/${currentUser.id}/wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 15 })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        onUpdateUser(updatedUser);
      } else {
        onUpdateUser({
          ...currentUser,
          walletBalance: (currentUser.walletBalance || 0) + 15
        });
      }
    } catch (e) {
      onUpdateUser({
        ...currentUser,
        walletBalance: (currentUser.walletBalance || 0) + 15
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !currentUser) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: ratingInput,
          comment: commentInput,
          userId: currentUser.id,
          userName: currentUser.name
        })
      });
      if (res.ok) {
        setCommentInput('');
        setSelectedBooking(null);
        fetchBookings();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLoadInvoice = async (invoiceId: string) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`);
      if (res.ok) {
        const data = await res.json();
        setViewingInvoice(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleHelpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpInput.trim()) return;

    const userText = helpInput.trim();
    setHelpMessages([...helpMessages, { sender: 'user', content: userText }]);
    setHelpInput('');
    setHelpLoading(true);

    try {
      // Simulate Gemini Support interaction or custom responsive helper matching UK norms
      setTimeout(() => {
        let answer = `Regarding your query "${userText}": Under UK HMRC norms, a 20% Standard VAT is applied to all on-demand home bookings. Referrals earn £15 once your code is redeemed. Our platform maintains clean DBS checks for absolute protection.`;
        if (userText.toLowerCase().includes('dbs') || userText.toLowerCase().includes('background')) {
          answer = 'All service providers on UrbanUK must hold a clean Disclosure and Barring Service (DBS) check which complies to UK certification and police registry norms. You can view their verification badges on their service profile.';
        } else if (userText.toLowerCase().includes('invoice') || userText.toLowerCase().includes('payment')) {
          answer = 'All completed service bookings automatically generate a UK-compliant VAT invoice available in your Account under the "Invoices" tab. VAT is charged at standard 20%.';
        } else if (userText.toLowerCase().includes('subscription') || userText.toLowerCase().includes('free')) {
          answer = 'To guarantee accountability, first 10 bookings are completely free. Once either side reaches 10 bookings, a monthly platform subscription (£19.99, EUR 23.99, or USD 25.99) is required to unlock direct communication channels.';
        }
        setHelpMessages(prev => [...prev, { sender: 'bot', content: answer }]);
        setHelpLoading(false);
      }, 1000);
    } catch (e) {
      setHelpLoading(false);
    }
  };

  const handleTopUpWallet = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${currentUser.id}/wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(walletAmount) })
      });
      const data = await res.json();
      if (res.ok) {
        onUpdateUser(data);
        alert(`£${walletAmount} added to your UrbanUK Wallet securely.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAddress = async () => {
    if (!currentUser || !newAddress.trim()) return;
    const updatedAddresses = [...currentUser.addresses, newAddress.trim()];
    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      const data = await res.json();
      if (res.ok) {
        onUpdateUser(data);
        setNewAddress('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubscriptionPayment = async () => {
    setSubscriptionProcessing(true);
    const amount = checkoutCurrency === 'GBP' ? 19.99 : checkoutCurrency === 'EUR' ? 23.99 : 25.99;
    
    try {
      const res = await fetch('/api/subscriptions/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: isProviderRole ? 'provider' : 'user',
          id: targetId,
          currency: checkoutCurrency,
          amount
        })
      });
      const data = await res.json();
      if (res.ok) {
        if (isProviderRole && currentProvider) {
          onUpdateProvider({ ...currentProvider, subscriptionPaid: true });
        } else if (currentUser) {
          onUpdateUser({ ...currentUser, subscriptionPaid: true });
        }
        alert(data.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubscriptionProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" id="my-account-page">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Account Sidebar Navigator */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6" id="account-sidebar">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-black text-lg">
              {isProviderRole ? (currentProvider?.name[0] || 'P') : (currentUser?.name[0] || 'U')}
            </div>
            <div>
              <h2 className="text-sm font-black text-black tracking-tight">{isProviderRole ? currentProvider?.name : currentUser?.name}</h2>
              <span className="text-[10px] text-gray-400 block">{isProviderRole ? 'UK Provider Licensee' : 'Customer Member'}</span>
              <span className="text-[9px] text-green-700 font-bold bg-green-50 px-1.5 py-0.5 rounded-sm inline-block mt-1">
                Bookings Count: {isProviderRole ? currentProvider?.bookingsCount : currentUser?.bookingsCount}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1" id="subtab-navigation-grid">
            <button
              onClick={() => setActiveSubTab('bookings')}
              className={`text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
                activeSubTab === 'bookings' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Bookings Log</span>
            </button>
            {!isProviderRole && (
              <button
                onClick={() => setActiveSubTab('wallet')}
                className={`text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
                  activeSubTab === 'wallet' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <PoundSterling className="h-4 w-4" />
                <span>Urban Wallet</span>
              </button>
            )}
            <button
              onClick={() => setActiveSubTab('referrals')}
              className={`text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
                activeSubTab === 'referrals' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Gift className="h-4 w-4" />
              <span>Refer & Earn £15</span>
            </button>
            <button
              onClick={() => setActiveSubTab('help')}
              className={`text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
                activeSubTab === 'help' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Support Assistant</span>
            </button>
            <button
              onClick={() => setActiveSubTab('settings')}
              className={`text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
                activeSubTab === 'settings' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              <span>Address & Settings</span>
            </button>
          </div>
        </div>

        {/* Account Subview Display area */}
        <div className="lg:col-span-3 space-y-6" id="account-content-area">
          
          {/* Active Direct-Contact Subscription Barrier warning */}
          {isDirectContactLocked && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs" id="direct-contact-barrier">
              <div className="space-y-1 text-center md:text-left">
                <span className="bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm">10 Services Reached</span>
                <h3 className="text-sm font-black text-black">Direct Contacts and Messages Locked</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-lg">
                  To keep the UK service marketplace sustainable and safe, once a user or provider passes 10 total bookings, they require a subscription plan to access direct contact details, telephone numbers, and real-time client messaging chats.
                </p>
              </div>

              {/* Multi-currency Checkout selection */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shrink-0 shadow-xs w-full md:w-auto text-center space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Choose Subscription Currency</span>
                
                <div className="flex justify-center gap-1.5 p-1 bg-gray-100 rounded-lg">
                  <button 
                    onClick={() => setCheckoutCurrency('GBP')}
                    className={`px-2 py-1 text-[10px] font-black rounded-md ${checkoutCurrency === 'GBP' ? 'bg-white text-black shadow-xs' : 'text-gray-500'}`}
                  >
                    GBP (£)
                  </button>
                  <button 
                    onClick={() => setCheckoutCurrency('EUR')}
                    className={`px-2 py-1 text-[10px] font-black rounded-md ${checkoutCurrency === 'EUR' ? 'bg-white text-black shadow-xs' : 'text-gray-500'}`}
                  >
                    EUR (€)
                  </button>
                  <button 
                    onClick={() => setCheckoutCurrency('USD')}
                    className={`px-2 py-1 text-[10px] font-black rounded-md ${checkoutCurrency === 'USD' ? 'bg-white text-black shadow-xs' : 'text-gray-500'}`}
                  >
                    USD ($)
                  </button>
                </div>

                <div className="text-xl font-black text-black">
                  {checkoutCurrency === 'GBP' ? '£19.99' : checkoutCurrency === 'EUR' ? '€23.99' : '$25.99'}
                  <span className="text-[10px] font-semibold text-gray-400">/mo</span>
                </div>

                <button
                  onClick={handleSubscriptionPayment}
                  disabled={subscriptionProcessing}
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  {subscriptionProcessing ? 'Activating Plan...' : 'Pay & Unlock'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'bookings' && (
            <div className="space-y-4" id="bookings-log-subview">
              <h3 className="text-lg font-extrabold text-black tracking-tight">Active Bookings & Contracts History</h3>
              {bookings.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                  <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No home service bookings logged yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="bookings-grid-list">
                  {bookings.map((bk) => (
                    <div key={bk.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xs transition-all flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-bold text-gray-400 block uppercase">Booking ID: {bk.id}</span>
                            <span className="text-sm font-black text-black leading-tight block mt-1">{bk.serviceName}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            bk.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                            bk.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {bk.status}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-[11px] text-gray-600">
                          <div>
                            <span className="font-semibold text-black">Date & Time:</span> {bk.date} @ {bk.time}
                          </div>
                          <div>
                            <span className="font-semibold text-black">Service Pro:</span> {bk.providerName}
                          </div>
                          <div>
                            <span className="font-semibold text-black">Client:</span> {bk.userName}
                          </div>
                          <div>
                            <span className="font-semibold text-black">Address:</span> {bk.address}
                          </div>
                          <div>
                            <span className="font-semibold text-black">Amount Billed:</span> £{bk.totalAmount.toFixed(2)} (VAT Inc.)
                          </div>
                        </div>
                      </div>

                      {/* Interactive Actions for active booking */}
                      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between gap-2 shrink-0">
                        {bk.invoiceId && (
                          <button
                            onClick={() => handleLoadInvoice(bk.invoiceId!)}
                            className="text-[11px] font-bold text-gray-500 hover:text-black flex items-center gap-1"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Invoice</span>
                          </button>
                        )}

                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              if (isDirectContactLocked) {
                                alert('Please purchase platform subscription to open real-time customer/provider messages.');
                              } else {
                                setSelectedBooking(bk);
                                loadChatMessages(bk.id);
                              }
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-black font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Secure Chat</span>
                          </button>

                          {/* Status transition action */}
                          {isProviderRole && bk.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(bk.id, 'confirmed')}
                              className="bg-black hover:bg-gray-800 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg"
                            >
                              Confirm
                            </button>
                          )}
                          {isProviderRole && bk.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(bk.id, 'in-progress')}
                              className="bg-black hover:bg-gray-800 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg"
                            >
                              Start Job
                            </button>
                          )}
                          {isProviderRole && bk.status === 'in-progress' && (
                            <button
                              onClick={() => handleUpdateStatus(bk.id, 'completed')}
                              className="bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg"
                            >
                              Complete Job
                            </button>
                          )}

                          {/* Customer rating trigger */}
                          {!isProviderRole && bk.status === 'completed' && (
                            <button
                              onClick={() => setSelectedBooking(bk)}
                              className="bg-black hover:bg-gray-800 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-0.5"
                            >
                              <Sparkles className="h-3 w-3 text-amber-300 animate-bounce" /> Leave Review
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

          {activeSubTab === 'wallet' && !isProviderRole && currentUser && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6" id="wallet-subview">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-extrabold text-black tracking-tight">My Urban Wallet Balance</h3>
                  <p className="text-xs text-gray-500">Quick, cashless, secure checkouts on your bookings with automatic VAT invoicing.</p>
                </div>
                <div className="text-3xl font-black text-black">£{currentUser.walletBalance.toFixed(2)}</div>
              </div>

              {/* Top up action */}
              <div className="p-4 bg-gray-50 rounded-xl max-w-md">
                <span className="text-xs font-bold text-gray-700 block mb-2">Add Money to Wallet</span>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2 text-gray-400 text-xs font-bold">£</span>
                    <input
                      type="number"
                      placeholder="50"
                      value={walletAmount}
                      onChange={(e) => setWalletAmount(e.target.value)}
                      className="w-full pl-6 pr-4 py-1.5 text-xs border border-gray-200 bg-white rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleTopUpWallet}
                    className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-1.5 rounded-lg"
                  >
                    Top-Up Securely
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'referrals' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-8 animate-fade-in" id="referrals-subview">
              
              {/* Header and description */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    <Gift className="h-3.5 w-3.5 animate-bounce" /> Community Referral Program
                  </span>
                  <h3 className="text-lg font-black text-indigo-950 uppercase">Refer Friends, Earn £15 Wallet Cash</h3>
                  <p className="text-xs text-gray-500 max-w-xl">
                    Invite family & friends within the UK South Asian community. When they register using your code, they get an immediate <strong className="text-indigo-600">£15 welcome gift</strong>, and you earn <strong className="text-indigo-600">£15</strong> once they book their first cooking, beauty, or trade service!
                  </p>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center shrink-0 w-full md:w-52">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Your Referral Code</span>
                  <div className="text-xl font-black text-indigo-950 tracking-widest border-2 border-dashed border-indigo-300 px-4 py-1 bg-white rounded-xl mt-1.5 uppercase font-mono select-all">
                    {currentUser?.referralCode || currentProvider?.email.slice(0, 4).toUpperCase() + '15'}
                  </div>
                  <span className="text-[9px] text-indigo-500 mt-1">Click code to copy & share</span>
                </div>
              </div>

              {/* Main Content: 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Stats & Invite Form */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Performance stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 text-center space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Invites Sent</span>
                      <span className="text-2xl font-black text-indigo-950 block">{referralsList.length}</span>
                    </div>
                    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 text-center space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Earned Bonus</span>
                      <span className="text-2xl font-black text-green-600 block">
                        £{referralsList.filter(r => r.status === 'completed' || r.status === 'claimed').length * 15}
                      </span>
                    </div>
                  </div>

                  {/* Send invite form */}
                  <div className="border border-gray-100 rounded-2xl p-5 bg-white space-y-4 shadow-xs">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-indigo-950 uppercase">Invite a Friend Instantly</h4>
                      <p className="text-[11px] text-gray-400">Enter your friend's contact details to dispatch a customized email invitation with your referral code.</p>
                    </div>

                    <form onSubmit={handleInviteFriend} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase block">Friend's Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Patil"
                          value={refFriendName}
                          onChange={(e) => setRefFriendName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase block">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="rahul@gmail.com"
                            value={refFriendEmail}
                            onChange={(e) => setRefFriendEmail(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase block">Phone (Optional)</label>
                          <input
                            type="tel"
                            placeholder="+44 7700..."
                            value={refFriendPhone}
                            onChange={(e) => setRefFriendPhone(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
                      >
                        <span>Send Invitation Link</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>

                </div>

                {/* Right Column: Referral Ledger */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-indigo-950 uppercase">Referral Invite Ledger & Claims</h4>
                    <p className="text-[11px] text-gray-400">Track registration and service completion status for each contact referred.</p>
                  </div>

                  {referralsList.length === 0 ? (
                    <div className="border border-dashed border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-400">
                      You have not invited anyone yet. Get started by entering a friend's details!
                    </div>
                  ) : (
                    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-bold">
                              <th className="p-3">Friend</th>
                              <th className="p-3">Status</th>
                              <th className="p-3">Reward</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {referralsList.map((ref) => (
                              <tr key={ref.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-3">
                                  <div className="font-bold text-gray-800 leading-tight">{ref.friendName}</div>
                                  <div className="text-[10px] text-gray-400">{ref.friendEmail}</div>
                                </td>
                                <td className="p-3">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                    ref.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                    ref.status === 'claimed' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                    ref.status === 'registered' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    'bg-gray-50 text-gray-500 border-gray-200'
                                  }`}>
                                    {ref.status === 'claimed' ? 'Claimed ✓' : ref.status}
                                  </span>
                                </td>
                                <td className="p-3 font-mono font-bold text-gray-700">
                                  {ref.status === 'completed' || ref.status === 'claimed' ? '£15' : '£0'}
                                </td>
                                <td className="p-3 text-right">
                                  {ref.status === 'completed' ? (
                                    <button
                                      onClick={() => handleRedeemReferral(ref.id)}
                                      className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-xs cursor-pointer transition-all"
                                    >
                                      Claim £15 Cash
                                    </button>
                                  ) : ref.status === 'claimed' ? (
                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                      Paid to Wallet
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-gray-400">
                                      Awaiting service
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {activeSubTab === 'help' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4" id="help-support-bot">
              <div>
                <h3 className="text-lg font-extrabold text-black tracking-tight">UrbanUK Help Desk & FAQ Assistant</h3>
                <p className="text-xs text-gray-500">Ask any compliance, invoicing, damage cover or DBS verification policy question.</p>
              </div>

              {/* Support logs */}
              <div className="h-64 border border-gray-100 rounded-xl p-4 overflow-y-auto space-y-3 bg-gray-50/50" id="support-chat-log">
                {helpMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-xl text-xs max-w-sm leading-relaxed ${
                      msg.sender === 'user' ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-xs'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {helpLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 text-gray-400 p-3 rounded-xl text-xs flex items-center gap-1">
                      <span className="animate-bounce font-extrabold">.</span>
                      <span className="animate-bounce font-extrabold [animation-delay:0.2s]">.</span>
                      <span className="animate-bounce font-extrabold [animation-delay:0.4s]">.</span>
                      <span>Support scanning guidelines...</span>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleHelpSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Do service providers have DBS check certificates?"
                  value={helpInput}
                  onChange={(e) => setHelpInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-black"
                />
                <button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {activeSubTab === 'settings' && currentUser && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6" id="settings-subview">
              {/* Address management */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-black uppercase tracking-wider">Manage Saved Addresses</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Flat 12, Queens Court, Birmingham B1 2HA"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden"
                  />
                  <button
                    onClick={handleAddAddress}
                    className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg"
                  >
                    Add Address
                  </button>
                </div>
                <div className="space-y-2 mt-2">
                  {currentUser.addresses.map((addr, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-xs font-medium text-gray-700">
                      <MapPin className="h-4 w-4 text-black shrink-0" />
                      <span>{addr}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-black text-black uppercase tracking-wider">Manage Cards & Payment Methods</h4>
                <div className="space-y-2">
                  {currentUser.paymentMethods.map((pm, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs">
                      <CreditCard className="h-4 w-4 text-black" />
                      <div className="flex-1">
                        <span className="font-bold text-black block">{pm.type} ending {pm.last4}</span>
                        <span className="text-[10px] text-gray-400">Card Holder: {pm.cardHolder}</span>
                      </div>
                      <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-sm font-semibold border border-green-200">
                        Default
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* SECURE REAL-TIME MESSAGE CHAT MODAL OVERLAY */}
      {selectedBooking && chatMessages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="chat-modal-overlay">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]" id="chat-modal-card">
            
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Interactive Service Chat</span>
                <h4 className="text-sm font-black text-black">{selectedBooking.serviceName}</h4>
                <p className="text-[10px] text-gray-500">
                  {isProviderRole ? `Client: ${selectedBooking.userName}` : `Provider: ${selectedBooking.providerName}`}
                </p>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-black p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50" id="chat-message-logs">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === (isProviderRole ? 'provider' : 'user') ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-xl text-xs max-w-sm leading-normal ${
                    msg.senderId === (isProviderRole ? 'provider' : 'user') 
                      ? 'bg-black text-white' 
                      : 'bg-white border border-gray-200 text-gray-800 shadow-xs'
                  }`}>
                    <span className="text-[9px] text-gray-400 font-bold block mb-1">{msg.senderName}</span>
                    <p>{msg.content}</p>
                    <span className="text-[8px] text-gray-400 text-right block mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input form */}
            <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:border-black"
                id="booking-chat-input"
              />
              <button
                onClick={handleSendMessage}
                className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg"
                id="send-booking-chat"
              >
                Send
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* COMPLIANT AUTOMATED INVOICE PDF OVERLAY */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="invoice-modal-overlay">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6" id="invoice-modal-card">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <span className="bg-black text-white font-extrabold text-sm px-2 py-1 rounded-sm block w-fit">URBANUK</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mt-2">UK Compliance Invoice</span>
                <span className="text-xs font-bold text-gray-900 block">{viewingInvoice.id}</span>
              </div>
              <button onClick={() => setViewingInvoice(null)} className="text-gray-400 hover:text-black">✕ Close</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-semibold uppercase text-[10px] block">Customer</span>
                <span className="font-extrabold text-black block mt-1">{viewingInvoice.customerName}</span>
                <span className="text-gray-500 block">{viewingInvoice.customerEmail}</span>
              </div>
              <div>
                <span className="text-gray-400 font-semibold uppercase text-[10px] block">Service Specialist</span>
                <span className="font-extrabold text-black block mt-1">{viewingInvoice.providerName}</span>
                <span className="text-gray-500 block">Registration Code: Verified</span>
              </div>
            </div>

            <div className="border-t border-b border-gray-100 py-3 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">{viewingInvoice.serviceName}</span>
                <span className="font-bold text-black">£{viewingInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">UK Standard VAT (20%)</span>
                <span className="font-bold text-black">£{viewingInvoice.vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Booking Surcharge</span>
                <span className="font-bold text-black">£{viewingInvoice.fees.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
              <span className="font-black text-black">Total Paid Amount:</span>
              <span className="font-black text-black">£{viewingInvoice.total.toFixed(2)}</span>
            </div>

            <div className="text-[10px] text-gray-400 text-center leading-normal">
              UrbanUK compliance guarantees public liability protection and automatic VAT invoice filing under HMRC regulatory terms. Thank you for booking through our verified network.
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER RATING REVIEW SCREEN MODAL */}
      {!isProviderRole && selectedBooking && selectedBooking.status === 'completed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="review-modal-overlay">
          <form onSubmit={handleSubmitReview} className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4" id="review-modal-card">
            <h3 className="text-lg font-black text-black tracking-tight">Submit Verified Review</h3>
            <p className="text-xs text-gray-500">Provide trust and accountability by rating your experience with {selectedBooking.providerName}.</p>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block">Rating (Stars)</label>
              <select
                value={ratingInput}
                onChange={(e) => setRatingInput(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              >
                <option value="5">★★★★★ (5/5 Excellence)</option>
                <option value="4">★★★★☆ (4/5 Very Good)</option>
                <option value="3">★★★☆☆ (3/5 Average)</option>
                <option value="2">★★☆☆☆ (2/5 Below Average)</option>
                <option value="1">★☆☆☆☆ (1/5 Poor)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block">Comment / Review Details</label>
              <textarea
                rows={3}
                required
                placeholder="How was the punctuality, cleanliness and standard of service?"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-xs text-gray-500 hover:text-black font-semibold px-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-black hover:bg-gray-800 text-white font-bold text-xs px-4 py-2 rounded-lg"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
