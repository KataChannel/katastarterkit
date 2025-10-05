'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AffiliateDashboard,
  CampaignManagement,
  LinkManagement,
  PaymentManagement 
} from '@/components/affiliate';

export default function AffiliatePage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Affiliate Marketing
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your affiliate program, campaigns, and track performance
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Dashboard</CardTitle>
              <CardDescription>
                Overview of your affiliate program performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AffiliateDashboard />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Management</CardTitle>
              <CardDescription>
                Create and manage your affiliate campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CampaignManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="links" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Management</CardTitle>
              <CardDescription>
                Generate and track your affiliate links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinkManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
              <CardDescription>
                Track earnings and manage payout requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}