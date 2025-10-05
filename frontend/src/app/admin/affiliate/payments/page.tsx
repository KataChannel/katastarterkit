'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentManagement } from '@/components/affiliate';

export default function PaymentsPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Payment Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your earnings, manage payout requests, and view payment history
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings & Payouts</CardTitle>
          <CardDescription>
            Monitor commission earnings, request payouts, and manage payment methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentManagement />
        </CardContent>
      </Card>
    </div>
  );
}