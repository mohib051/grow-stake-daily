import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/ui/stat-card";
import { 
  Users, 
  Wallet, 
  Target, 
  TrendingUp, 
  Settings, 
  RefreshCw,
  Eye,
  Edit,
  Search,
  Filter,
  Download
} from "lucide-react";
import { User, Stake, Payment, PayoutRule } from "@/types/api";

// Mock admin data
const mockUsers: User[] = [
  {
    id: "user-1",
    email: "john@example.com",
    phone: "+91 98765 43210",
    kyc_status: "VERIFIED",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "user-2", 
    email: "jane@example.com",
    phone: "+91 87654 32109",
    kyc_status: "PENDING",
    is_active: true,
    created_at: "2024-01-20T14:30:00Z"
  },
  {
    id: "user-3",
    email: "bob@example.com",
    phone: "+91 76543 21098",
    kyc_status: "NONE",
    is_active: false,
    created_at: "2024-01-25T09:15:00Z"
  }
];

const mockPayments: Payment[] = [
  {
    id: "pay-1",
    user_id: "user-1",
    gateway: "RAZORPAY",
    gateway_order_id: "order_123456",
    amount: 10000,
    status: "SUCCESS",
    created_at: "2024-01-30T10:00:00Z"
  },
  {
    id: "pay-2",
    user_id: "user-2",
    gateway: "PAYTM",
    gateway_order_id: "order_234567",
    amount: 5000,
    status: "FAILED",
    created_at: "2024-01-29T15:30:00Z"
  }
];

const AdminDashboard = () => {
  const [users] = useState<User[]>(mockUsers);
  const [payments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState("");

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

  const getKycBadgeVariant = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'default';
      case 'PENDING':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'default';
      case 'FAILED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const totalUsers = users.length;
  const verifiedUsers = users.filter(u => u.kyc_status === 'VERIFIED').length;
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  const successfulPayments = payments.filter(p => p.status === 'SUCCESS').length;

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">DailyStake Admin</h1>
                <p className="text-sm text-muted-foreground">Administrative Dashboard</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={totalUsers}
            change={{ value: 8.2, period: "vs last month" }}
            icon={Users}
            variant="default"
          />
          <StatCard
            title="Verified Users"
            value={verifiedUsers}
            change={{ value: 12.5, period: "this month" }}
            icon={Users}
            variant="success"
          />
          <StatCard
            title="Total Payments"
            value={formatCurrency(totalPayments)}
            change={{ value: 23.1, period: "vs last month" }}
            icon={Wallet}
            variant="success"
          />
          <StatCard
            title="Success Rate"
            value={`${Math.round((successfulPayments / payments.length) * 100)}%`}
            icon={TrendingUp}
            variant="default"
          />
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="stakes">Stakes</TabsTrigger>
            <TabsTrigger value="rules">Payout Rules</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="finance-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>KYC Status</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.email}</p>
                            <p className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{user.phone || 'Not provided'}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getKycBadgeVariant(user.kyc_status)}>
                            {user.kyc_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? "default" : "destructive"}>
                            {user.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{formatDate(user.created_at)}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <Card className="finance-card">
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Gateway</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <p className="font-mono text-sm">{payment.id.slice(0, 8)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{payment.user_id.slice(0, 8)}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.gateway}</Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPaymentBadgeVariant(payment.status)}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{formatDate(payment.created_at)}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stakes Tab */}
          <TabsContent value="stakes" className="space-y-4">
            <Card className="finance-card">
              <CardHeader>
                <CardTitle>Stake Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Stakes Management</h3>
                  <p>View and manage all user stakes, monitor payout schedules</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payout Rules Tab */}
          <TabsContent value="rules" className="space-y-4">
            <Card className="finance-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payout Rules Configuration</CardTitle>
                  <Button variant="gradient">
                    <Settings className="w-4 h-4 mr-2" />
                    Add New Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="min-amount">Minimum Amount</Label>
                      <Input id="min-amount" type="number" placeholder="500" />
                    </div>
                    <div>
                      <Label htmlFor="max-amount">Maximum Amount</Label>
                      <Input id="max-amount" type="number" placeholder="999" />
                    </div>
                    <div>
                      <Label htmlFor="daily-payout">Daily Payout</Label>
                      <Input id="daily-payout" type="number" placeholder="30" />
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full">Save Rule</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <h4 className="font-medium mb-3">Current Payout Rules</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-background rounded border">
                        <span className="text-sm">₹500 - ₹999</span>
                        <span className="font-medium text-success">₹30/day</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-background rounded border">
                        <span className="text-sm">₹1,000 - ₹4,999</span>
                        <span className="font-medium text-success">₹70/day</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-background rounded border">
                        <span className="text-sm">₹5,000 - ₹9,999</span>
                        <span className="font-medium text-success">₹300/day</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-background rounded border">
                        <span className="text-sm">₹10,000+</span>
                        <span className="font-medium text-success">₹600/day</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;