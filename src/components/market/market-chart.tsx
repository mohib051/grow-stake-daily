import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, RefreshCw } from "lucide-react";
import { MarketData } from "@/types/api";

// Mock market data - replace with real API integration
const generateMockData = (): MarketData[] => {
  const symbols = ['NIFTY', 'SENSEX', 'BANKNIFTY', 'RELIANCE', 'TCS'];
  return symbols.map(symbol => ({
    symbol,
    price: Math.random() * 5000 + 15000,
    change: (Math.random() - 0.5) * 200,
    change_percent: (Math.random() - 0.5) * 4,
    volume: Math.random() * 10000000,
    timestamp: new Date().toISOString()
  }));
};

export function MarketChart() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('NIFTY');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMarketData();
    // Simulate real-time updates
    const interval = setInterval(fetchMarketData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setMarketData(generateMockData());
      setIsLoading(false);
    }, 500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 10000000) {
      return `${(volume / 10000000).toFixed(1)}Cr`;
    } else if (volume >= 100000) {
      return `${(volume / 100000).toFixed(1)}L`;
    }
    return volume.toString();
  };

  const selectedData = marketData.find(data => data.symbol === selectedSymbol);

  return (
    <Card className="finance-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle>Live Market</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchMarketData}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Symbol Selector */}
        <div className="flex flex-wrap gap-2">
          {marketData.map((data) => (
            <Button
              key={data.symbol}
              variant={selectedSymbol === data.symbol ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSymbol(data.symbol)}
              className="text-xs"
            >
              {data.symbol}
            </Button>
          ))}
        </div>

        {/* Selected Symbol Details */}
        {selectedData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{selectedData.symbol}</h3>
                <p className="text-3xl font-bold">
                  ₹{formatCurrency(selectedData.price)}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  {selectedData.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                  <Badge 
                    variant={selectedData.change >= 0 ? "secondary" : "destructive"}
                    className={selectedData.change >= 0 ? "bg-success/10 text-success" : ""}
                  >
                    {selectedData.change >= 0 ? "+" : ""}
                    {formatCurrency(selectedData.change)}
                  </Badge>
                </div>
                <Badge 
                  variant={selectedData.change_percent >= 0 ? "secondary" : "destructive"}
                  className={`mt-1 ${selectedData.change_percent >= 0 ? "bg-success/10 text-success" : ""}`}
                >
                  {selectedData.change_percent >= 0 ? "+" : ""}
                  {selectedData.change_percent.toFixed(2)}%
                </Badge>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Volume</span>
              <span className="font-medium">{formatVolume(selectedData.volume)}</span>
            </div>
          </div>
        )}

        {/* Mock Chart Area */}
        <div className="h-48 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-border/50 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Interactive Chart</p>
            <p className="text-xs">Real-time market data visualization</p>
          </div>
        </div>

        {/* Market Summary */}
        <div className="grid grid-cols-2 gap-4">
          {marketData.slice(0, 4).map((data) => (
            <div 
              key={data.symbol}
              className="p-3 bg-card/50 rounded-lg border border-border/30 hover:bg-accent/30 transition-colors cursor-pointer"
              onClick={() => setSelectedSymbol(data.symbol)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{data.symbol}</span>
                <div className="text-right">
                  <p className="text-sm font-semibold">₹{formatCurrency(data.price)}</p>
                  <div className="flex items-center space-x-1">
                    {data.change >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    )}
                    <span className={`text-xs ${
                      data.change >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {data.change_percent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}