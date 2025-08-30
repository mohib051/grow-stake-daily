import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calculator, TrendingUp, Clock } from "lucide-react";
import { PayoutRule } from "@/types/api";

interface CreateStakeModalProps {
  walletBalance: number;
  payoutRules: PayoutRule[];
  onCreateStake: (amount: number, useWallet: boolean) => void;
}

export function CreateStakeModal({ 
  walletBalance, 
  payoutRules, 
  onCreateStake 
}: CreateStakeModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("500");
  const [useWallet, setUseWallet] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPayoutRule = (amount: number): PayoutRule | null => {
    return payoutRules.find(rule => 
      amount >= rule.min_amount && amount <= rule.max_amount && rule.is_active
    ) || null;
  };

  const calculateStats = (amount: number) => {
    const rule = getPayoutRule(amount);
    if (!rule) return null;

    const dailyPayout = rule.daily_payout;
    const recoveryDays = Math.ceil(amount / dailyPayout);
    const totalPayout = dailyPayout * 60; // 60 days default
    const totalReturn = totalPayout - amount;
    const returnPercentage = (totalReturn / amount) * 100;

    return {
      dailyPayout,
      recoveryDays,
      totalPayout,
      totalReturn,
      returnPercentage
    };
  };

  const numericAmount = parseFloat(amount) || 0;
  const stats = calculateStats(numericAmount);
  const canUseWallet = useWallet && walletBalance >= numericAmount;
  const isValidAmount = numericAmount >= 500;

  const handleSubmit = () => {
    if (isValidAmount && (canUseWallet || !useWallet)) {
      onCreateStake(numericAmount, useWallet);
      setOpen(false);
      setAmount("500");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="lg" className="w-full">
          <Plus className="w-5 h-5 mr-2" />
          Create New Stake
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl gradient-text">Create New Stake</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Stake Amount (Minimum ₹500)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                min="500"
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-lg"
                placeholder="500"
              />
            </div>
            {!isValidAmount && amount && (
              <p className="text-sm text-destructive">Minimum stake amount is ₹500</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Card 
                className={`cursor-pointer transition-all ${
                  useWallet ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent/50'
                }`}
                onClick={() => setUseWallet(true)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Use Wallet</h4>
                      <p className="text-sm text-muted-foreground">
                        Balance: {formatCurrency(walletBalance)}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      useWallet ? 'bg-primary border-primary' : 'border-muted-foreground'
                    }`} />
                  </div>
                  {useWallet && !canUseWallet && (
                    <p className="text-xs text-destructive mt-2">Insufficient balance</p>
                  )}
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${
                  !useWallet ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent/50'
                }`}
                onClick={() => setUseWallet(false)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Pay via Gateway</h4>
                      <p className="text-sm text-muted-foreground">
                        Razorpay/UPI
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      !useWallet ? 'bg-primary border-primary' : 'border-muted-foreground'
                    }`} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payout Preview */}
          {stats && (
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Calculator className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Payout Calculation</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Daily Payout</span>
                      <span className="font-medium text-success">
                        {formatCurrency(stats.dailyPayout)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Recovery Days</span>
                      <span className="font-medium">{stats.recoveryDays} days</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Return</span>
                      <span className="font-medium text-primary">
                        {formatCurrency(stats.totalReturn)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Return %</span>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        +{stats.returnPercentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Payout (60 days)</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(stats.totalPayout)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="gradient" 
              className="flex-1"
              onClick={handleSubmit}
              disabled={!isValidAmount || (useWallet && !canUseWallet)}
            >
              {useWallet ? "Create Stake" : "Proceed to Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}