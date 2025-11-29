'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_WORKFLOW_INSTANCE, RESPOND_TO_APPROVAL, CREATE_WORKFLOW_COMMENT } from '@/graphql/workflow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, Clock, XCircle, AlertCircle, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface WorkflowInstanceViewProps {
  instanceId: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-yellow-500', icon: <Clock className="h-4 w-4" /> },
  IN_PROGRESS: { label: 'Đang xử lý', color: 'bg-blue-500', icon: <Loader2 className="h-4 w-4 animate-spin" /> },
  WAITING_APPROVAL: { label: 'Chờ phê duyệt', color: 'bg-orange-500', icon: <AlertCircle className="h-4 w-4" /> },
  APPROVED: { label: 'Đã phê duyệt', color: 'bg-green-500', icon: <CheckCircle2 className="h-4 w-4" /> },
  REJECTED: { label: 'Đã từ chối', color: 'bg-red-500', icon: <XCircle className="h-4 w-4" /> },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-green-600', icon: <CheckCircle2 className="h-4 w-4" /> },
  CANCELLED: { label: 'Đã hủy', color: 'bg-gray-500', icon: <XCircle className="h-4 w-4" /> },
};

export default function WorkflowInstanceView({ instanceId }: WorkflowInstanceViewProps) {
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string>('');
  const [approvalDecision, setApprovalDecision] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [approvalComment, setApprovalComment] = useState('');
  const [newComment, setNewComment] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_WORKFLOW_INSTANCE, {
    variables: { id: instanceId },
    pollInterval: 10000, // Poll every 10s
  });

  const [respondToApproval, { loading: respondingApproval }] = useMutation(RESPOND_TO_APPROVAL, {
    onCompleted: () => {
      toast.success('Đã ghi nhận phê duyệt');
      setApprovalDialogOpen(false);
      setApprovalComment('');
      refetch();
    },
    onError: (err) => {
      toast.error(`Lỗi: ${err.message}`);
    },
  });

  const [createComment, { loading: creatingComment }] = useMutation(CREATE_WORKFLOW_COMMENT, {
    onCompleted: () => {
      toast.success('Đã thêm bình luận');
      setNewComment('');
      refetch();
    },
    onError: (err) => {
      toast.error(`Lỗi: ${err.message}`);
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.workflowInstance) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không tìm thấy workflow instance</p>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  const instance = data.workflowInstance;
  const statusInfo = statusConfig[instance.status] || statusConfig.PENDING;
  const totalSteps = instance.workflowTemplate.steps.length;
  const progress = (instance.currentStepNumber / totalSteps) * 100;

  const handleApprovalClick = (approvalId: string, decision: 'APPROVED' | 'REJECTED') => {
    setSelectedApprovalId(approvalId);
    setApprovalDecision(decision);
    setApprovalDialogOpen(true);
  };

  const handleApprovalSubmit = () => {
    respondToApproval({
      variables: {
        input: {
          approvalId: selectedApprovalId,
          decision: approvalDecision,
          comment: approvalComment,
        },
      },
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    createComment({
      variables: {
        input: {
          workflowInstanceId: instanceId,
          content: newComment,
        },
      },
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="font-mono">
                {instance.instanceCode}
              </Badge>
              <Badge className={statusInfo.color}>
                {statusInfo.icon}
                <span className="ml-1">{statusInfo.label}</span>
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{instance.title}</h1>
            {instance.description && (
              <p className="text-muted-foreground mt-1">{instance.description}</p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Tiến độ</span>
            <span className="text-muted-foreground">
              Bước {instance.currentStepNumber} / {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Các bước trong quy trình</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instance.stepExecutions.map((execution: any, index: number) => {
                  const isCompleted = execution.status === 'COMPLETED';
                  const isCurrent = execution.stepNumber === instance.currentStepNumber;
                  const isPending = execution.status === 'PENDING';

                  return (
                    <div
                      key={execution.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        isCurrent ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="font-medium">{execution.stepNumber}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{execution.workflowStep.name}</h3>
                          {isCurrent && (
                            <Badge variant="default" className="text-xs">
                              Đang xử lý
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {execution.workflowStep.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Loại: {execution.workflowStep.stepType}</span>
                          {execution.completedAt && (
                            <span>
                              Hoàn thành:{' '}
                              {formatDistanceToNow(new Date(execution.completedAt), {
                                addSuffix: true,
                                locale: vi,
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Approvals */}
          {instance.approvals && instance.approvals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Phê duyệt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {instance.approvals.map((approval: any) => (
                    <div key={approval.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">
                            {approval.approver.firstName} {approval.approver.lastName}
                          </span>
                          <Badge
                            variant={
                              approval.status === 'APPROVED'
                                ? 'default'
                                : approval.status === 'REJECTED'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {approval.status === 'PENDING' && 'Chờ phê duyệt'}
                            {approval.status === 'APPROVED' && 'Đã phê duyệt'}
                            {approval.status === 'REJECTED' && 'Đã từ chối'}
                          </Badge>
                        </div>
                        {approval.comment && (
                          <p className="text-sm text-muted-foreground mb-2">{approval.comment}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {approval.respondedAt
                            ? `${formatDistanceToNow(new Date(approval.respondedAt), {
                                addSuffix: true,
                                locale: vi,
                              })}`
                            : 'Chưa phản hồi'}
                        </p>
                      </div>
                      {approval.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprovalClick(approval.id, 'APPROVED')}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Phê duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApprovalClick(approval.id, 'REJECTED')}
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Từ chối
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Bình luận
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4">
                {instance.comments && instance.comments.length > 0 ? (
                  instance.comments.map((comment: any) => (
                    <div key={comment.id} className="p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.author.firstName} {comment.author.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Chưa có bình luận nào
                  </p>
                )}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Textarea
                  placeholder="Thêm bình luận..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || creatingComment}
                  className="w-full"
                >
                  {creatingComment && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Gửi bình luận
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Quy trình</p>
                <p className="font-medium">{instance.workflowTemplate.name}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Người khởi tạo</p>
                <p className="font-medium">
                  {instance.initiator.firstName} {instance.initiator.lastName}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Ngày tạo</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(instance.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </p>
              </div>
              {instance.completedAt && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground mb-1">Ngày hoàn thành</p>
                    <p className="font-medium">
                      {formatDistanceToNow(new Date(instance.completedAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lịch sử hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {instance.activityLogs && instance.activityLogs.length > 0 ? (
                  instance.activityLogs.slice(0, 10).map((log: any) => (
                    <div key={log.id} className="text-sm">
                      <p className="font-medium">{log.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(log.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Chưa có hoạt động
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalDecision === 'APPROVED' ? 'Phê duyệt' : 'Từ chối'} yêu cầu
            </DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do {approvalDecision === 'APPROVED' ? 'phê duyệt' : 'từ chối'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Nhập lý do..."
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              variant={approvalDecision === 'APPROVED' ? 'default' : 'destructive'}
              onClick={handleApprovalSubmit}
              disabled={respondingApproval}
            >
              {respondingApproval && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
