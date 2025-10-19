'use client'

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import { Alert, AlertDescription } from '../../ui/alert';
import { 
  DollarSign, 
  MousePointer, 
  TrendingUp, 
  Users, 
  Link2, 
  BarChart3,
  Plus,
  ExternalLink,
  Calendar,
  Target
} from 'lucide-react';
import { GET_AFFILIATE_USER, GET_AFFILIATE_LINKS, GET_AFFILIATE_CAMPAIGNS } from '../../../graphql/affiliate.queries';
import { AffiliateUser, AffiliateLink, AffiliateCampaign } from '../../../types/affiliate';

interface AffiliateDashboardProps {
  className?: string;
}

export default function AffiliateDashboard({ className = '' }: AffiliateDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  
  // GraphQL Queries
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_AFFILIATE_USER);
  const { data: linksData, loading: linksLoading } = useQuery(GET_AFFILIATE_LINKS, {
    variables: { search: { pagination: { page: 1, size: 10 } } }
  });
  const { data: campaignsData, loading: campaignsLoading } = useQuery(GET_AFFILIATE_CAMPAIGNS, {
    variables: { search: { status: 'ACTIVE', page: 1, size: 10 } }
  });

  const affiliateUser: AffiliateUser = userData?.affiliateUser;
  const affiliateLinks: AffiliateLink[] = linksData?.affiliateLinks || [];
  const campaigns: AffiliateCampaign[] = campaignsData?.affiliateCampaigns || [];

  // Show registration prompt if user is not registered as affiliate
  if (!userLoading && !affiliateUser) {
    return (
      <div className={`p-6 ${className}`}>
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Affiliate Program</CardTitle>
            <CardDescription>
              Join our affiliate program and start earning commissions by promoting our products.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 border rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold">Earn Commissions</h3>
                <p className="text-sm text-muted-foreground">Up to 30% on every sale</p>
              </div>
              <div className="p-4 border rounded-lg">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <h3 className="font-semibold">Real-time Analytics</h3>
                <p className="text-sm text-muted-foreground">Track your performance</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <h3 className="font-semibold">Multiple Campaigns</h3>
                <p className="text-sm text-muted-foreground">Choose what to promote</p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button size="lg" className="w-full max-w-xs">
                <Plus className="h-4 w-4 mr-2" />
                Join Affiliate Program
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className={`p-6 ${className}`}>
        <Alert>
          <AlertDescription>Failed to load affiliate data. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Calculate dashboard stats
  const stats = {
    totalEarnings: affiliateUser?.totalEarnings || 0,
    totalClicks: affiliateUser?.totalClicks || 0,
    totalConversions: affiliateUser?.totalConversions || 0,
    conversionRate: affiliateUser?.conversionRate || 0,
    activeLinks: affiliateLinks.filter(link => link.isActive).length,
    activeCampaigns: campaigns.length,
    averageOrderValue: affiliateUser?.averageOrderValue || 0,
    pendingCommissions: affiliateLinks.reduce((sum, link) => sum + (link.commission || 0), 0)
  };

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
          <p className="text-muted-foreground">
            {affiliateUser?.businessName || 'Welcome back'} • {affiliateUser?.role}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={affiliateUser?.status === 'ACTIVE' ? 'default' : 'secondary'}>
            {affiliateUser?.status}
          </Badge>
          {affiliateUser?.isVerified && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                <div className="text-2xl font-bold">{stats.totalConversions}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.conversionRate.toFixed(1)}% rate
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Links</p>
                <div className="text-2xl font-bold">{stats.activeLinks}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeCampaigns} campaigns
                </p>
              </div>
              <Link2 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="links">My Links</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
                <CardDescription>Your performance over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="text-sm font-medium">{stats.conversionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={stats.conversionRate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Order Value</span>
                    <span className="text-sm font-medium">${stats.averageOrderValue.toFixed(2)}</span>
                  </div>
                  <Progress value={(stats.averageOrderValue / 200) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Commission Rate</span>
                    <span className="text-sm font-medium">15-30%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Link2 className="h-4 w-4 mr-2" />
                  Create New Link
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Request Payment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Browse Campaigns
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Affiliate Links</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Link
            </Button>
          </div>
          
          <div className="grid gap-4">
            {affiliateLinks.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-10">
                  <div className="text-center">
                    <Link2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No links created yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first affiliate link to start earning commissions.</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              affiliateLinks.map((link) => (
                <Card key={link.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold truncate">{link.title || link.campaign.name}</h4>
                          <Badge variant={link.isActive ? 'default' : 'secondary'}>
                            {link.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{link.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{link.clicks} clicks</span>
                          <span>{link.conversions} conversions</span>
                          <span>${link.commission.toFixed(2)} earned</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Available Campaigns</h3>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{campaign.name}</h4>
                        <Badge variant={campaign.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                        <Badge variant="outline">
                          {campaign.commissionType === 'PERCENTAGE' ? 
                            `${campaign.commissionRate}%` : 
                            `$${campaign.fixedAmount}`
                          }
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{campaign.totalClicks.toLocaleString()} clicks</span>
                        <span>{campaign.totalConversions} conversions</span>
                        <span>{campaign.conversionRate.toFixed(1)}% rate</span>
                        <span>${campaign.totalRevenue.toFixed(2)} revenue</span>
                      </div>
                    </div>
                    <Button>
                      <Link2 className="h-4 w-4 mr-2" />
                      Create Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Trend</CardTitle>
                <CardDescription>Your earnings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>Chart component will be implemented</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Click Performance</CardTitle>
                <CardDescription>Clicks and conversions by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <MousePointer className="h-12 w-12 mx-auto mb-4" />
                    <p>Performance chart will be implemented</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}