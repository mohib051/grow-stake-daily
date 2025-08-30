import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Target, Settings, RefreshCw } from "lucide-react";
import { Transaction } from "@/types/api";

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onLoadMore?: () => void;
}

export function TransactionHistory({ 
  transactions, 
  isLoading = false, 
  onLoadMore 
}: TransactionHistoryProps) {
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'TOPUP':
        return <ArrowDownLeft className="w-4 h-4 text-success" />;
      case 'PAYOUT':
        return <ArrowUpRight className="w-4 h-4 text-primary" />;
      case 'STAKE_CREATION':
        return <Target className="w-4 h-4 text-secondary" />;
      case 'WITHDRAWAL':
        return <ArrowUpRight className="w-4 h-4 text-warning" />;
      case 'ADJUSTMENT':
        return <Settings className="w-4 h-4 text-muted-foreground" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'TOPUP':
        return { variant: 'secondary' as const, text: 'Top Up' };
      case 'PAYOUT':
        return { variant: 'default' as const, text: 'Payout' };
      case 'STAKE_CREATION':
        return { variant: 'secondary' as const, text: 'Stake Created' };
      case 'WITHDRAWAL':
        return { variant: 'destructive' as const, text: 'Withdrawal' };
      case 'ADJUSTMENT':
        return { variant: 'outline' as const, text: 'Adjustment' };
      default:
        return { variant: 'outline' as const, text: type };
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'TOPUP':
      case 'PAYOUT':
        return 'text-success';
      case 'STAKE_CREATION':
      case 'WITHDRAWAL':
        return 'text-destructive';
      default:
        return 'text-foreground';
    }
  };

  const getAmountPrefix = (type: string) => {
    switch (type) {
      case 'TOPUP':
      case 'PAYOUT':
        return '+';
      case 'STAKE_CREATION':
      case 'WITHDRAWAL':
        return '-';
      default:
        return '';
    }
  };

  return (
    <Card className="finance-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            <span>Transaction History</span>
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {transactions.length} transactions
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-1">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <RefreshCw className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Your transaction history will appear here</p>
          </div>
        ) : (
          <>
            {transactions.map((transaction) => {
              const badge = getTransactionBadge(transaction.type);
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/30 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center group-hover:bg-accent">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={badge.variant} className="text-xs">
                          {badge.text}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(transaction.created_at)}
                      </p>
                      {transaction.metadata && (
                        <p className="text-xs text-muted-foreground">
                          {JSON.stringify(transaction.metadata)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold ${getAmountColor(transaction.type)}`}>
                      {getAmountPrefix(transaction.type)}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Balance: {formatCurrency(transaction.balance_after)}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {onLoadMore && (
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}