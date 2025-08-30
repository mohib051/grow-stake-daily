import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { WalletOverview } from "@/components/wallet/wallet-overview";
import { StakeCard } from "@/components/stakes/stake-card";
import { CreateStakeModal } from "@/components/stakes/create-stake-modal";
import { MarketChart } from "@/components/market/market-chart";
import { TransactionHistory } from "@/components/transactions/transaction-history";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, Clock, Award } from "lucide-react";
import { User, Wallet, Stake, Transaction, PayoutRule, DashboardStats } from "@/types/api";

// Mock data - replace with real API calls
const mockUser: User = {
  id: "user-123",
  email: "user@dailystake.com",
  phone: "+91 98765 43210",
  kyc_status: "VERIFIED",
  is_active: true,
  created_at: new Date().toISOString()
};

const mockWallet: Wallet = {
  user_id: "user-123",
  balance: 25000,
  pending_balance: 1500,
  total_earned: 8750,
  created_at: new Date().toISOString()
};

const mockStakes: Stake[] = [
  {
    id: "stake-1",
    user_id: "user-123",
    amount: 10000,
    daily_payout: 600,
    duration_days: 60,
    start_date: "2024-01-15",
    next_payout_date: "2024-02-01",
    payouts_remaining: 43,
    payouts_completed: 17,
    state: "ACTIVE",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "stake-2",
    user_id: "user-123",
    amount: 5000,
    daily_payout: 300,
    duration_days: 60,
    start_date: "2024-01-20",
    next_payout_date: "2024-02-01",
    payouts_remaining: 48,
    payouts_completed: 12,
    state: "ACTIVE",
    created_at: "2024-01-20T14:30:00Z"
  },
  {
    id: "stake-3",
    user_id: "user-123",
    amount: 7500,
    daily_payout: 450,
    duration_days: 60,
    start_date: "2023-12-01",
    next_payout_date: "2024-01-30",
    payouts_remaining: 0,
    payouts_completed: 60,
    state: "COMPLETED",
    created_at: "2023-12-01T09:15:00Z"
  }
];

const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    user_id: "user-123",
    type: "PAYOUT",
    amount: 600,
    balance_after: 25000,
    created_at: "2024-01-31T06:00:00Z"
  },
  {
    id: "tx-2",
    user_id: "user-123",
    type: "PAYOUT",
    amount: 300,
    balance_after: 24400,
    created_at: "2024-01-31T06:00:00Z"
  },
  {
    id: "tx-3",
    user_id: "user-123",
    type: "TOPUP",
    amount: 15000,
    balance_after: 24100,
    created_at: "2024-01-30T14:30:00Z"
  },
  {
    id: "tx-4",
    user_id: "user-123",
    type: "STAKE_CREATION",
    amount: 10000,
    balance_after: 9100,
    created_at: "2024-01-15T10:00:00Z"
  }
];

const mockPayoutRules: PayoutRule[] = [
  { id: "rule-1", min_amount: 500, max_amount: 999, daily_payout: 30, is_active: true },
  { id: "rule-2", min_amount: 1000, max_amount: 4999, daily_payout: 70, is_active: true },
  { id: "rule-3", min_amount: 5000, max_amount: 9999, daily_payout: 300, is_active: true },
  { id: "rule-4", min_amount: 10000, max_amount: 99999, daily_payout: 600, is_active: true }
];

const Index = () => {
  const [user] = useState<User>(mockUser);
  const [wallet] = useState<Wallet>(mockWallet);
  const [stakes] = useState<Stake[]>(mockStakes);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [payoutRules] = useState<PayoutRule[]>(mockPayoutRules);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const activeStakes = stakes.filter(stake => stake.state === 'ACTIVE');
  const completedStakes = stakes.filter(stake => stake.state === 'COMPLETED');
  const totalInvested = stakes.reduce((sum, stake) => sum + stake.amount, 0);
  const todaysPayout = activeStakes.reduce((sum, stake) => sum + stake.daily_payout, 0);

  const handleLogout = () => {
    console.log("Logout");
  };

  const handleTopUp = () => {
    console.log("Top up wallet");
  };

  const handleCreateStake = (amount: number, useWallet: boolean) => {
    console.log("Create stake:", { amount, useWallet });
  };

  const handleViewStakeDetails = (stakeId: string) => {
    console.log("View stake details:", stakeId);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Stakes"
            value={activeStakes.length}
            change={{ value: 2, period: "this month" }}
            icon={Target}
            variant="success"
          />
          <StatCard
            title="Total Invested"
            value={formatCurrency(totalInvested)}
            change={{ value: 15.2, period: "vs last month" }}
            icon={TrendingUp}
            variant="default"
          />
          <StatCard
            title="Today's Payout"
            value={formatCurrency(todaysPayout)}
            icon={Clock}
            variant="success"
          />
          <StatCard
            title="Completed Stakes"
            value={completedStakes.length}
            icon={Award}
            variant="default"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet & Stakes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Overview */}
            <WalletOverview
              balance={wallet.balance}
              pendingBalance={wallet.pending_balance}
              totalEarned={wallet.total_earned}
              onTopUp={handleTopUp}
            />

            {/* Stakes Section */}
            <Card className="finance-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Stakes</CardTitle>
                  <CreateStakeModal
                    walletBalance={wallet.balance}
                    payoutRules={payoutRules}
                    onCreateStake={handleCreateStake}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="active">Active ({activeStakes.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({completedStakes.length})</TabsTrigger>
                    <TabsTrigger value="all">All Stakes ({stakes.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active" className="space-y-4 mt-4">
                    {activeStakes.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No active stakes</p>
                        <p className="text-sm">Create your first stake to start earning daily payouts</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {activeStakes.map((stake) => (
                          <StakeCard
                            key={stake.id}
                            stake={stake}
                            onViewDetails={handleViewStakeDetails}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed" className="space-y-4 mt-4">
                    {completedStakes.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No completed stakes yet</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {completedStakes.map((stake) => (
                          <StakeCard
                            key={stake.id}
                            stake={stake}
                            onViewDetails={handleViewStakeDetails}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="all" className="space-y-4 mt-4">
                    <div className="grid gap-4">
                      {stakes.map((stake) => (
                        <StakeCard
                          key={stake.id}
                          stake={stake}
                          onViewDetails={handleViewStakeDetails}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Market & Transactions */}
          <div className="space-y-6">
            {/* Market Chart */}
            <MarketChart />
            
            {/* Recent Transactions */}
            <TransactionHistory 
              transactions={transactions.slice(0, 5)}
              onLoadMore={() => console.log("Load more transactions")}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
