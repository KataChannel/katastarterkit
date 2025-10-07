/**
 * AccessDenied Component
 * 
 * Display access denied message for unauthorized users
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface AccessDeniedProps {
  userRole?: string;
  requiredRole?: string;
}

export function AccessDenied({ 
  userRole = 'Unknown', 
  requiredRole = 'ADMIN' 
}: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <ShieldAlert className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h3>
            <p className="text-gray-600 mb-4">
              You need <strong>{requiredRole}</strong> role to access this page.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Your current role: <strong>{userRole}</strong>
            </p>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
