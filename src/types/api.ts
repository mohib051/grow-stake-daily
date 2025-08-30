// API Types for DailyStake

export interface User {
  id: string;
  email: string;
  phone?: string;
  kyc_status: 'NONE' | 'PENDING' | 'VERIFIED';
  is_active: boolean;
  created_at: string;
}

export interface Wallet {
  user_id: string;
  balance: number;
  pending_balance: number;
  total_earned: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'TOPUP' | 'PAYOUT' | 'STAKE_CREATION' | 'ADJUSTMENT' | 'WITHDRAWAL';
  amount: number;
  balance_after: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Stake {
  id: string;
  user_id: string;
  amount: number;
  daily_payout: number;
  duration_days: number;
  start_date: string;
  next_payout_date: string;
  payouts_remaining: number;
  payouts_completed: number;
  state: 'PENDING_PAYMENT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  stake_id?: string;
  gateway: 'RAZORPAY' | 'PAYTM';
  gateway_order_id: string;
  amount: number;
  status: 'INIT' | 'SUCCESS' | 'FAILED';
  created_at: string;
}

export interface PayoutRule {
  id: string;
  min_amount: number;
  max_amount: number;
  daily_payout: number;
  is_active: boolean;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface DashboardStats {
  total_stakes: number;
  active_stakes: number;
  completed_stakes: number;
  total_invested: number;
  total_earned: number;
  pending_payouts: number;
}