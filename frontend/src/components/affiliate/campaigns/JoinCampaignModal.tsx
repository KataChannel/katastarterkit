'use client'

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { JOIN_CAMPAIGN } from '../../../graphql/affiliate.queries';
import { AffiliateCampaign } from '../../../types/affiliate';

interface JoinCampaignModalProps {
  campaign: AffiliateCampaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function JoinCampaignModal({
  campaign,
  isOpen,
  onClose,
  onSuccess
}: JoinCampaignModalProps) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [joinCampaign, { loading }] = useMutation(JOIN_CAMPAIGN, {
    onCompleted: () => {
      setMessage('');
      setError('');
      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      setError(err.message || 'Failed to join campaign');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    try {
      await joinCampaign({
        variables: {
          input: {
            campaignId: campaign.id,
            message: message.trim() || undefined
          }
        }
      });
    } catch (err) {
      // Error handled by onError callback
    }
  };

  const handleClose = () => {
    setMessage('');
    setError('');
    onClose();
  };

  if (!campaign) return null;

  const requiresApproval = campaign.type !== 'PUBLIC';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Join Campaign</DialogTitle>
          <DialogDescription>
            Review the campaign details and send your application
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Info */}
          <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <div>
              <h3 className="font-semibold text-lg mb-2">{campaign.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {campaign.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Commission Info */}
              <div className="flex items-start space-x-2">
                <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Commission</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {campaign.commissionType === 'PERCENTAGE'
                      ? `${campaign.commissionRate}% per sale`
                      : `${campaign.fixedAmount.toLocaleString()} VND per sale`}
                  </p>
                </div>
              </div>

              {/* Campaign Type */}
              <div className="flex items-start space-x-2">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <Badge variant={campaign.type === 'PUBLIC' ? 'default' : 'secondary'}>
                    {campaign.type}
                  </Badge>
                </div>
              </div>

              {/* Cookie Duration */}
              <div className="flex items-start space-x-2">
                <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Cookie Duration</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {campaign.cookieDuration} days
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={campaign.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Notice */}
          {requiresApproval && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This campaign requires approval. Your application will be reviewed by the merchant.
                Include a message to increase your chances of approval.
              </AlertDescription>
            </Alert>
          )}

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message">
              Message {requiresApproval ? '(Required)' : '(Optional)'}
            </Label>
            <Textarea
              id="message"
              placeholder="Tell the merchant why you'd like to promote their products..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required={requiresApproval}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {requiresApproval
                ? 'Include your audience size, niche, and why you\'re a good fit'
                : 'Optional message to the merchant'}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || campaign.status !== 'ACTIVE'}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  {requiresApproval ? 'Send Application' : 'Join Campaign'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
