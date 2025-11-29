'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MY_PENDING_APPROVALS, RESPOND_TO_APPROVAL } from '@/graphql/workflow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, XCircle, Clock, Eye, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Approval {
  id: string;
  stepNumber: number;
  status: string;
  comment: string;
  createdAt: string;
  workflowInstance: {
    id: string;
    instanceCode: string;
    title: string;
    description: string;
    status: string;
    currentStepNumber: number;
    workflowTemplate: {
      id: string;
      name: string;
      code: string;
      icon: string;
      color: string;
    };
  };
}

export default function MyApprovalsPage() {
  const router = useRouter();
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [comment, setComment] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_MY_PENDING_APPROVALS, {
    fetchPolicy: 'network-only',
  });

  const [respondToApproval, { loading: responding }] = useMutation(RESPOND_TO_APPROVAL, {
    onCompleted: () => {
      toast.success(
        decision === 'APPROVED' 
          ? 'Đã phê duyệt thành công!' 
          : 'Đã từ chối yêu cầu!'
      );
      setShowDialog(false);
      setSelectedApproval(null);
      setComment('');
      setDecision(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const approvals: Approval[] = data?.myPendingApprovals || [];

  const handleOpenDialog = (approval: Approval, decisionType: 'APPROVED' | 'REJECTED') => {
    setSelectedApproval(approval);
    setDecision(decisionType);
    setShowDialog(true);
  };

  const handleSubmitDecision = async () => {
    if (!selectedApproval || !decision) return;

    await respondToApproval({
      variables: {
        input: {
          approvalId: selectedApproval.id,
          decision,
          comment: comment || undefined,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300">
            Lỗi tải dữ liệu: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Chờ phê duyệt
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Danh sách các yêu cầu cần bạn phê duyệt
        </p>
      </div>

      {/* Count badge */}
      <div className="mb-6">
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Clock className="h-5 w-5 mr-2" />
          {approvals.length} yêu cầu đang chờ
        </Badge>
      </div>

      {/* Approvals list */}
      {approvals.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Không có yêu cầu nào
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Bạn đã xử lý hết tất cả yêu cầu phê duyệt
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <Card key={approval.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {approval.workflowInstance.instanceCode}
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        <Clock className="h-3 w-3 mr-1" />
                        Bước {approval.stepNumber}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-1">
                      {approval.workflowInstance.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {approval.workflowInstance.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Template:</span>
                    <Badge variant="secondary" className="text-xs">
                      {approval.workflowInstance.workflowTemplate.name}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(approval.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => router.push(`/workflow/instances/${approval.workflowInstance.id}`)}
                    variant="outline"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Xem chi tiết
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleOpenDialog(approval, 'APPROVED')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Phê duyệt
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleOpenDialog(approval, 'REJECTED')}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Từ chối
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Approval Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {decision === 'APPROVED' ? 'Phê duyệt yêu cầu' : 'Từ chối yêu cầu'}
            </DialogTitle>
            <DialogDescription>
              {selectedApproval && (
                <>
                  <span className="font-semibold">{selectedApproval.workflowInstance.title}</span>
                  <br />
                  Mã: {selectedApproval.workflowInstance.instanceCode}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">
              Nhận xét {decision === 'REJECTED' && '(bắt buộc)'}
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                decision === 'APPROVED'
                  ? 'Nhập nhận xét (không bắt buộc)...'
                  : 'Vui lòng cho biết lý do từ chối...'
              }
              rows={4}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                setComment('');
              }}
              disabled={responding}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitDecision}
              disabled={responding || (decision === 'REJECTED' && !comment.trim())}
              className={
                decision === 'APPROVED'
                  ? 'bg-green-600 hover:bg-green-700'
                  : ''
              }
              variant={decision === 'REJECTED' ? 'destructive' : 'default'}
            >
              {responding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  {decision === 'APPROVED' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Xác nhận phê duyệt
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Xác nhận từ chối
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
