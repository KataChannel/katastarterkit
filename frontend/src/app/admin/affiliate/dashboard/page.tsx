'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AffiliateDashboard } from '@/components/affiliate';

export default function AffiliateDashboardPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Affiliate Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Overview of your affiliate program performance and key metrics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Track your affiliate program metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AffiliateDashboard />
        </CardContent>
      </Card>
    </div>
  );
}