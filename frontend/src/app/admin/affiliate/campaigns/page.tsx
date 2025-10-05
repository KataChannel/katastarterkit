'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignManagement } from '@/components/affiliate';

export default function CampaignsPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Campaign Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create, manage, and monitor your affiliate marketing campaigns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>
            Manage your affiliate campaigns, set commission rates, and track performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CampaignManagement />
        </CardContent>
      </Card>
    </div>
  );
}