import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Eye, EyeOff, Plus, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { StatCard } from "@/components/ui/stat-card";

interface WalletOverviewProps {
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  onTopUp: () => void;
}

export function WalletOverview({ 
  balance, 
  pendingBalance, 
  totalEarned, 
  onTopUp 
}: WalletOverviewProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Main Wallet Card */}
      <Card className="finance-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Wallet Balance</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold gradient-text">
                {showBalance ? formatCurrency(balance) : "••••••"}
              </span>
              {pendingBalance > 0 && (
                <Badge variant="secondary" className="text-xs">
                  +{formatCurrency(pendingBalance)} pending
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
          </div>
          
          <div className="flex space-x-3">
            <Button onClick={onTopUp} className="flex-1 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Top Up Wallet
            </Button>
            <Button variant="outline" className="flex-1">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Earned"
          value={formatCurrency(totalEarned)}
          change={{ value: 12.5, period: "this month" }}
          icon={ArrowUpRight}
          variant="success"
        />
        <StatCard
          title="Pending Payments"
          value={formatCurrency(pendingBalance)}
          icon={Wallet}
          variant={pendingBalance > 0 ? "warning" : "default"}
        />
      </div>
    </div>
  );
}