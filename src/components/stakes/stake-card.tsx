import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingUp, Clock, Target } from "lucide-react";
import { Stake } from "@/types/api";

interface StakeCardProps {
  stake: Stake;
  onViewDetails: (stakeId: string) => void;
}

export function StakeCard({ stake, onViewDetails }: StakeCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const getStakeProgress = () => {
    const completed = stake.payouts_completed || 0;
    const total = stake.duration_days;
    return (completed / total) * 100;
  };

  const getStakeVariant = () => {
    switch (stake.state) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'secondary';
      case 'PENDING_PAYMENT':
        return 'warning';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStakeStatus = () => {
    switch (stake.state) {
      case 'ACTIVE':
        return 'Active';
      case 'COMPLETED':
        return 'Completed';
      case 'PENDING_PAYMENT':
        return 'Pending Payment';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return stake.state;
    }
  };

  const totalEarned = (stake.payouts_completed || 0) * stake.daily_payout;
  const totalPotential = stake.duration_days * stake.daily_payout;

  return (
    <Card className="finance-card hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Stake #{stake.id.slice(0, 8)}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Started {formatDate(stake.created_at)}
            </p>
          </div>
          <Badge variant={getStakeVariant() as any} className="text-xs">
            {getStakeStatus()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Amount and Daily Payout */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Staked Amount</p>
            <p className="text-xl font-bold">{formatCurrency(stake.amount)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Daily Payout</p>
            <p className="text-xl font-bold text-success">{formatCurrency(stake.daily_payout)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {stake.payouts_completed || 0} / {stake.duration_days} days
            </span>
          </div>
          <Progress value={getStakeProgress()} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Earned</p>
              <p className="text-sm font-semibold text-success">{formatCurrency(totalEarned)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Potential</p>
              <p className="text-sm font-semibold">{formatCurrency(totalPotential)}</p>
            </div>
          </div>
        </div>

        {/* Next Payout Info */}
        {stake.state === 'ACTIVE' && (
          <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Next Payout</p>
              <p className="text-sm font-medium">
                {formatDate(stake.next_payout_date)} - {formatCurrency(stake.daily_payout)}
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-accent/50 transition-colors"
          onClick={() => onViewDetails(stake.id)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}