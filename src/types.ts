export type ServiceCategory =
  | 'cooking'
  | 'women_salon'
  | 'spa_beauty'
  | 'cleaning'
  | 'plumbing'
  | 'painting'
  | 'gardening'
  | 'carpenter'
  | 'electrical_fitting'
  | 'appliance_repair';

export interface ServiceDefinition {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  basePrice: number;
  image: string;
  inclusions: string[];
  exclusions: string[];
  estimatedTime: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  addresses: string[];
  paymentMethods: { id: string; type: string; cardHolder: string; last4: string }[];
  bookingsCount: number;
  subscriptionPaid: boolean;
  registeredAt: string;
  referralCode: string;
  referredBy?: string;
  referralsCount: number;
  isBiometricEnabled?: boolean;
}

export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  category: ServiceCategory;
  pricing: number; // in GBP
  inclusions: string[];
  exclusions: string[];
  damageProtection: string;
  rating: number;
  reviewsCount: number;
  workImages: string[];
  certificationUrl: string;
  certificationName: string;
  dbsCheckUrl: string;
  dbsStatus: 'unverified' | 'pending' | 'verified' | 'failed';
  status: 'pending' | 'approved' | 'rejected';
  walletBalance: number;
  bookingsCount: number;
  subscriptionPaid: boolean;
  registeredAt: string;
  about: string;
  aiVerificationNotes?: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  date: string;
  time: string;
  requirements: string;
  totalAmount: number;
  vat: number;
  taxes: number;
  advancePaid: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  isPaid: boolean;
  paymentMethod: string;
  invoiceId?: string;
  address: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string; // 'user' or 'provider' or 'system'
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  providerName: string;
  serviceName: string;
  date: string;
  subtotal: number;
  vat: number;
  fees: number;
  total: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'refunded';
}

export interface AdminStats {
  dailyRegisteredUsers: { date: string; count: number }[];
  dailyRegisteredProviders: { date: string; count: number }[];
  servicesOffered: number;
  servicesConsumed: number;
  paymentsReceived: number; // total revenue in GBP
  activeSubscriptions: number;
}

export interface ReferralInvite {
  id: string;
  userId: string;
  friendName: string;
  friendEmail: string;
  friendPhone: string;
  status: 'invited' | 'registered' | 'completed';
  rewardEarned: number;
  createdAt: string;
}

export interface PropertyListing {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  providerPhone: string;
  title: string;
  type: 'shared_room' | 'short_term' | 'long_term';
  price: number; // monthly rent in GBP
  area: string; // Wembley, Southall, Belgrave, etc.
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface ViewingBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  providerId: string;
  date: string;
  time: string;
  isInterested: boolean; // whether they want to express strong interest to rent
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export type MarketplaceCategory = 'furniture' | 'electrical' | 'appliances' | 'clothes' | 'household' | 'other';

export interface MarketplaceItem {
  id: string;
  sellerId: string; // can be User id or ServiceProvider id
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  title: string;
  category: MarketplaceCategory;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  price: number;
  area: string;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface MarketplaceInterest {
  id: string;
  itemId: string;
  itemTitle: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  message: string;
  createdAt: string;
}

