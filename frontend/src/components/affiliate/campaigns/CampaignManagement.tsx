'use client'

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Plus, 
  Edit, 
  Eye, 
  BarChart3, 
  Calendar, 
  Target, 
  DollarSign,
  Users,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { GET_AFFILIATE_CAMPAIGNS, CREATE_AFFILIATE_CAMPAIGN, UPDATE_AFFILIATE_CAMPAIGN } from '../../../graphql/affiliate.queries';
import { AffiliateCampaign, CreateCampaignInput } from '../../../types/affiliate';

interface CampaignManagementProps {
  className?: string;
  userRole?: 'AFFILIATE' | 'MERCHANT' | 'ADMIN';
}

export default function CampaignManagement({ className = '', userRole = 'AFFILIATE' }: CampaignManagementProps) {
  const [selectedTab, setSelectedTab] = useState('active');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<AffiliateCampaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state for campaign creation/editing
  const [formData, setFormData] = useState<Partial<CreateCampaignInput>>({
    name: '',
    description: '',
    type: 'PUBLIC',
    commissionType: 'PERCENTAGE',
    commissionRate: 10,
    cookieDuration: 30,
    minPayoutAmount: 50,
    categories: [],
    targetCountries: ['US'],
  });

  // GraphQL queries and mutations
  const { data: campaignsData, loading, error, refetch } = useQuery(GET_AFFILIATE_CAMPAIGNS, {
    variables: { 
      search: { 
        status: selectedTab === 'active' ? 'ACTIVE' : selectedTab === 'draft' ? 'DRAFT' : undefined,
        page: 1, 
        size: 20 
      } 
    }
  });

  const [createCampaign, { loading: creating }] = useMutation(CREATE_AFFILIATE_CAMPAIGN, {
    onCompleted: () => {
      setCreateDialogOpen(false);
      setFormData({
        name: '',
        description: '',
        type: 'PUBLIC',
        commissionType: 'PERCENTAGE',
        commissionRate: 10,
        cookieDuration: 30,
        minPayoutAmount: 50,
        categories: [],
        targetCountries: ['US'],
      });
      refetch();
    }
  });

  const [updateCampaign, { loading: updating }] = useMutation(UPDATE_AFFILIATE_CAMPAIGN, {
    onCompleted: () => {
      setEditingCampaign(null);
      refetch();
    }
  });

  const campaigns: AffiliateCampaign[] = campaignsData?.affiliateCampaigns || [];
  
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCampaign = async () => {
    try {
      await createCampaign({
        variables: { input: formData }
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const handleUpdateCampaign = async () => {
    if (!editingCampaign) return;
    
    try {
      await updateCampaign({
        variables: { 
          id: editingCampaign.id, 
          input: formData 
        }
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  const openEditDialog = (campaign: AffiliateCampaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      type: campaign.type,
      commissionType: campaign.commissionType,
      commissionRate: campaign.commissionRate,
      fixedAmount: campaign.fixedAmount,
      cookieDuration: campaign.cookieDuration,
      minPayoutAmount: campaign.minPayoutAmount,
      maxPayoutAmount: campaign.maxPayoutAmount,
      categories: campaign.categories,
      targetCountries: campaign.targetCountries,
      terms: campaign.terms,
    });
  };

  const CampaignCard = ({ campaign }: { campaign: AffiliateCampaign }) => (
    <Card key={campaign.id}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{campaign.name}</h3>
              <Badge variant={campaign.status === 'ACTIVE' ? 'default' : 'secondary'}>
                {campaign.status}
              </Badge>
              <Badge variant="outline">
                {campaign.type}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-3">{campaign.description}</p>
          </div>
          {userRole === 'MERCHANT' && (
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => window.location.href = `/admin/affiliate/campaigns/${campaign.id}/applications`}
                title="View Applications"
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => openEditDialog(campaign)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-sm font-semibold">
              {campaign.commissionType === 'PERCENTAGE' ? 
                `${campaign.commissionRate}%` : 
                `$${campaign.fixedAmount}`
              }
            </div>
            <div className="text-xs text-muted-foreground">Commission</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-sm font-semibold">{campaign.totalClicks.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Clicks</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-sm font-semibold">{campaign.totalConversions}</div>
            <div className="text-xs text-muted-foreground">Conversions</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-sm font-semibold">{campaign.conversionRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Rate</div>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Revenue: ${campaign.totalRevenue.toFixed(2)}</span>
            <span>Commission: ${campaign.totalCommission.toFixed(2)}</span>
            {campaign.endDate && (
              <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
            )}
          </div>
          {userRole === 'AFFILIATE' && (
            <Button size="sm">
              Create Link
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const CampaignForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Campaign Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter campaign name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Campaign Type</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => setFormData({ ...formData, type: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLIC">Public</SelectItem>
              <SelectItem value="PRIVATE">Private</SelectItem>
              <SelectItem value="INVITE_ONLY">Invite Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your campaign"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="commissionType">Commission Type</Label>
          <Select 
            value={formData.commissionType} 
            onValueChange={(value) => setFormData({ ...formData, commissionType: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Percentage</SelectItem>
              <SelectItem value="FIXED">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="commission">
            {formData.commissionType === 'PERCENTAGE' ? 'Commission Rate (%)' : 'Fixed Amount ($)'}
          </Label>
          <Input
            id="commission"
            type="number"
            value={formData.commissionType === 'PERCENTAGE' ? formData.commissionRate : formData.fixedAmount}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (formData.commissionType === 'PERCENTAGE') {
                setFormData({ ...formData, commissionRate: value });
              } else {
                setFormData({ ...formData, fixedAmount: value });
              }
            }}
            placeholder={formData.commissionType === 'PERCENTAGE' ? '10' : '25.00'}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cookieDuration">Cookie Duration (days)</Label>
          <Input
            id="cookieDuration"
            type="number"
            value={formData.cookieDuration || 30}
            onChange={(e) => setFormData({ ...formData, cookieDuration: parseInt(e.target.value) })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="minPayout">Minimum Payout ($)</Label>
          <Input
            id="minPayout"
            type="number"
            value={formData.minPayoutAmount || 50}
            onChange={(e) => setFormData({ ...formData, minPayoutAmount: parseFloat(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-12 bg-muted rounded"></div>
                    ))}
                  </div>
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
          <h1 className="text-3xl font-bold">
            {userRole === 'MERCHANT' ? 'My Campaigns' : 'Available Campaigns'}
          </h1>
          <p className="text-muted-foreground">
            {userRole === 'MERCHANT' 
              ? 'Manage your affiliate marketing campaigns' 
              : 'Browse and join campaigns to start earning'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          {userRole === 'AFFILIATE' && (
            <Button onClick={() => window.location.href = '/admin/affiliate/browse'}>
              <Search className="h-4 w-4 mr-2" />
              Browse All Campaigns
            </Button>
          )}
          {userRole === 'MERCHANT' && (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>

                </DialogHeader>
                <CampaignForm />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCampaign} disabled={creating}>
                    {creating ? 'Creating...' : 'Create Campaign'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between mb-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="ended">Ended</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No campaigns found</h3>
                <p className="text-muted-foreground mb-4">
                  {userRole === 'MERCHANT' 
                    ? "You haven't created any campaigns yet." 
                    : "No campaigns match your search criteria."
                  }
                </p>
                {userRole === 'MERCHANT' && (
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Campaign
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingCampaign} onOpenChange={(open) => !open && setEditingCampaign(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>

          </DialogHeader>
          <CampaignForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCampaign(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCampaign} disabled={updating}>
              {updating ? 'Updating...' : 'Update Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}