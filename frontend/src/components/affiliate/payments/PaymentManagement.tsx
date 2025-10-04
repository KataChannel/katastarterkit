'use client'

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import { 
  Plus, 
  DollarSign, 
  CreditCard, 
  Banknote, 
  Bitcoin,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Download,
  Filter
} from 'lucide-react';
import { GET_AFFILIATE_PAYMENT_REQUESTS, CREATE_PAYMENT_REQUEST, GET_AFFILIATE_EARNINGS_REPORT } from '../../../graphql/affiliate.queries';
import { AffiliatePaymentRequest, CreatePaymentRequestInput } from '../../../types/affiliate';

interface PaymentManagementProps {
  className?: string;
}

export default function PaymentManagement({ className = '' }: PaymentManagementProps) {
  const [selectedTab, setSelectedTab] = useState('requests');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  
  // Form state for payment request
  const [formData, setFormData] = useState<CreatePaymentRequestInput>({
    amount: 0,
    method: 'PAYPAL',
    paymentDetails: {},
  });

  // GraphQL queries and mutations
  const { data: requestsData, loading: requestsLoading, refetch } = useQuery(GET_AFFILIATE_PAYMENT_REQUESTS, {
    variables: { search: { page: 1, size: 20 } }
  });

  const { data: earningsData, loading: earningsLoading } = useQuery(GET_AFFILIATE_EARNINGS_REPORT, {
    variables: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString()
    }
  });

  const [createPaymentRequest, { loading: creating }] = useMutation(CREATE_PAYMENT_REQUEST, {
    onCompleted: () => {
      setCreateDialogOpen(false);
      setFormData({
        amount: 0,
        method: 'PAYPAL',
        paymentDetails: {},
      });
      refetch();
    }
  });

  const requests: AffiliatePaymentRequest[] = requestsData?.affiliatePaymentRequests || [];
  const earnings = earningsData?.affiliateEarningsReport || {
    totalEarnings: 0,
    availableForPayout: 0,
    pendingPayments: 0,
    paidThisMonth: 0,
    minimumPayout: 50
  };

  const handleCreateRequest = async () => {
    try {
      await createPaymentRequest({
        variables: { input: formData }
      });
    } catch (error) {
      console.error('Error creating payment request:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'PROCESSING':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'PENDING': 'secondary',
      'PROCESSING': 'default',
      'COMPLETED': 'default',
      'CANCELLED': 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'PAYPAL':
        return <CreditCard className="h-4 w-4" />;
      case 'BANK_TRANSFER':
        return <Banknote className="h-4 w-4" />;
      case 'CRYPTO':
        return <Bitcoin className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const PaymentRequestCard = ({ request }: { request: AffiliatePaymentRequest }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(request.status)}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">${request.amount.toFixed(2)}</h3>
                {getStatusBadge(request.status)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {getMethodIcon(request.method)}
                <span>{request.method.replace('_', ' ')}</span>
                <span>•</span>
                <span>{new Date(request.requestedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            Request ID: <code className="text-xs">{request.id.slice(-8)}</code>
          </div>
        </div>

        {request.status === 'COMPLETED' && request.processedAt && (
          <div className="text-sm text-muted-foreground mb-2">
            <div className="flex items-center justify-between">
              <span>Processed:</span>
              <span>{new Date(request.processedAt).toLocaleDateString()}</span>
            </div>
            {request.transactionId && (
              <div className="flex items-center justify-between">
                <span>Transaction ID:</span>
                <code className="text-xs">{request.transactionId}</code>
              </div>
            )}
          </div>
        )}

        {request.adminNotes && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-1">Admin Notes:</div>
            <div className="text-sm text-muted-foreground">{request.adminNotes}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const PaymentRequestForm = () => (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="text-sm font-medium mb-2">Available Balance</div>
        <div className="text-2xl font-bold text-green-600">
          ${earnings.availableForPayout?.toFixed(2) || '0.00'}
        </div>
        <div className="text-xs text-muted-foreground">
          Minimum payout: ${earnings.minimumPayout || 50}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          max={earnings.availableForPayout || 0}
          value={formData.amount || ''}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
        />
        <div className="text-xs text-muted-foreground">
          Maximum: ${earnings.availableForPayout?.toFixed(2) || '0.00'}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="method">Payment Method</Label>
        <Select 
          value={formData.method} 
          onValueChange={(value) => setFormData({ ...formData, method: value as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PAYPAL">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                PayPal
              </div>
            </SelectItem>
            <SelectItem value="BANK_TRANSFER">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4" />
                Bank Transfer
              </div>
            </SelectItem>
            <SelectItem value="CRYPTO">
              <div className="flex items-center gap-2">
                <Bitcoin className="h-4 w-4" />
                Cryptocurrency
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.method === 'PAYPAL' && (
        <div className="space-y-2">
          <Label htmlFor="paypalEmail">PayPal Email</Label>
          <Input
            id="paypalEmail"
            type="email"
            value={formData.paymentDetails?.email || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              paymentDetails: { ...formData.paymentDetails, email: e.target.value }
            })}
            placeholder="your-paypal@email.com"
          />
        </div>
      )}

      {formData.method === 'BANK_TRANSFER' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              value={formData.paymentDetails?.accountName || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                paymentDetails: { ...formData.paymentDetails, accountName: e.target.value }
              })}
              placeholder="Account holder name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={formData.paymentDetails?.accountNumber || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                paymentDetails: { ...formData.paymentDetails, accountNumber: e.target.value }
              })}
              placeholder="Your account number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="routingNumber">Routing Number</Label>
            <Input
              id="routingNumber"
              value={formData.paymentDetails?.routingNumber || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                paymentDetails: { ...formData.paymentDetails, routingNumber: e.target.value }
              })}
              placeholder="Bank routing number"
            />
          </div>
        </div>
      )}

      {formData.method === 'CRYPTO' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cryptoType">Cryptocurrency</Label>
            <Select
              value={formData.paymentDetails?.cryptoType || 'BTC'}
              onValueChange={(value) => setFormData({ 
                ...formData, 
                paymentDetails: { ...formData.paymentDetails, cryptoType: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="USDT">Tether (USDT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="walletAddress">Wallet Address</Label>
            <Input
              id="walletAddress"
              value={formData.paymentDetails?.walletAddress || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                paymentDetails: { ...formData.paymentDetails, walletAddress: e.target.value }
              })}
              placeholder="Your wallet address"
            />
          </div>
        </div>
      )}
    </div>
  );

  if (requestsLoading || earningsLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Manage your earnings and payment requests
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              disabled={!earnings.availableForPayout || earnings.availableForPayout < (earnings.minimumPayout || 50)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Request Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Payment</DialogTitle>
            </DialogHeader>
            <PaymentRequestForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateRequest} 
                disabled={creating || formData.amount < (earnings.minimumPayout || 50) || formData.amount > (earnings.availableForPayout || 0)}
              >
                {creating ? 'Creating...' : 'Submit Request'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <div className="text-2xl font-bold">${earnings.totalEarnings?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-muted-foreground">Lifetime</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <div className="text-2xl font-bold text-green-600">
                  ${earnings.availableForPayout?.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">Ready for payout</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <div className="text-2xl font-bold text-yellow-600">
                  ${earnings.pendingPayments?.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">Being processed</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <div className="text-2xl font-bold">${earnings.paidThisMonth?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-muted-foreground">Paid out</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">Payment Requests</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Payment Requests</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No payment requests</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't made any payment requests yet.
                    </p>
                    {earnings.availableForPayout >= (earnings.minimumPayout || 50) && (
                      <Button onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Request Your First Payment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              requests.map(request => (
                <PaymentRequestCard key={request.id} request={request} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Payment History</h3>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Payment history chart</h3>
                <p className="text-muted-foreground">
                  Detailed payment history visualization will be implemented here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred Payment Method</Label>
                  <Select defaultValue="PAYPAL">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAYPAL">PayPal</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                      <SelectItem value="CRYPTO">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Automatic Payout Threshold</Label>
                  <Select defaultValue="100">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">$50</SelectItem>
                      <SelectItem value="100">$100</SelectItem>
                      <SelectItem value="250">$250</SelectItem>
                      <SelectItem value="500">$500</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Automatically request payment when you reach this amount
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tax ID / SSN</Label>
                  <Input placeholder="XXX-XX-XXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Tax Country</Label>
                  <Select defaultValue="US">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">Upload Tax Documents</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}