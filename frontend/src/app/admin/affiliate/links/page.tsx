'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkManagement } from '@/components/affiliate';

export default function LinksPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Link Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Generate, customize, and track your affiliate links and performance
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Affiliate Links</CardTitle>
          <CardDescription>
            Create tracking links, monitor clicks, and analyze conversion rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LinkManagement />
        </CardContent>
      </Card>
    </div>
  );
}