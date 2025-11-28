'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  GET_SUPPORT_CONVERSATIONS, 
  GET_SUPPORT_CONVERSATION,
  SEND_SUPPORT_MESSAGE,
  ASSIGN_CONVERSATION_TO_AGENT,
  UPDATE_CONVERSATION_STATUS
} from '@/graphql/support-chat/support-chat.graphql';
import {
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  Send,
  Paperclip,
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  Star,
  Bot,
  Facebook,
  MessageCircle as ZaloIcon,
} from 'lucide-react';
import { CustomerAuthBadge, type CustomerAuthType } from './CustomerAuthBadge';

interface Conversation {
  id: string;
  conversationCode: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  platform: string;
  status: string;
  priority: string;
  authType?: CustomerAuthType;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  customer?: any;
  assignedAgent?: any;
}

interface Message {
  id: string;
  content: string;
  senderType: 'CUSTOMER' | 'AGENT' | 'BOT';
  senderName?: string;
  customerAuthType?: CustomerAuthType;
  customerAuthIcon?: string;
  isAIGenerated?: boolean;
  isRead: boolean;
  sentAt: string;
  createdAt: string;
  sender?: any;
}

export default function AdminChatDashboard() {
  const { user } = useAuth(); // Get current user
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'waiting' | 'closed'>('all');
  const [authTypeFilter, setAuthTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use ref to track selected conversation in socket handlers (avoid stale closure)
  const selectedConversationRef = useRef<Conversation | null>(null);
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    waiting: 0,
    avgResponseTime: 0,
    byAuthType: {
      GUEST: 0,
      PHONE: 0,
      ZALO: 0,
      FACEBOOK: 0,
      GOOGLE: 0,
      USER_ACCOUNT: 0,
    },
  });

  // Apollo queries and mutations
  const { data: conversationsData, refetch: refetchConversations } = useQuery(GET_SUPPORT_CONVERSATIONS, {
    variables: {
      where: filter !== 'all' ? { status: filter.toUpperCase() } : undefined,
      take: 50,
    },
  });

  const { data: conversationData } = useQuery(GET_SUPPORT_CONVERSATION, {
    variables: { id: selectedConversation?.id },
    skip: !selectedConversation,
  });

  const [sendMessageMutation] = useMutation(SEND_SUPPORT_MESSAGE);
  const [assignToAgentMutation] = useMutation(ASSIGN_CONVERSATION_TO_AGENT);
  const [updateStatusMutation] = useMutation(UPDATE_CONVERSATION_STATUS);

  const conversations = conversationsData?.supportConversations || [];

  // Update stats when conversations change
  useEffect(() => {
    const total = conversations.length;
    const active = conversations.filter((c: Conversation) => c.status === 'ACTIVE').length;
    const waiting = conversations.filter((c: Conversation) => c.status === 'WAITING').length;
    
    const authTypeStats = {
      GUEST: 0,
      PHONE: 0,
      ZALO: 0,
      FACEBOOK: 0,
      GOOGLE: 0,
      USER_ACCOUNT: 0,
    };
    
    conversations.forEach((c: Conversation) => {
      if (c.authType && authTypeStats.hasOwnProperty(c.authType)) {
        authTypeStats[c.authType as keyof typeof authTypeStats]++;
      }
    });
    
    setStats({
      total,
      active,
      waiting,
      avgResponseTime: 45, // Mock data
      byAuthType: authTypeStats,
    });
  }, [conversations]);

  // Update messages when conversation data changes
  useEffect(() => {
    if (conversationData?.supportConversation?.messages) {
      setMessages(conversationData.supportConversation.messages);
    }
  }, [conversationData]);

  // Keep ref in sync with state
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // Initialize Socket.IO - only once on mount
  useEffect(() => {
    // Use NEXT_PUBLIC_WS_URL or fall back to localhost:12001
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:12001/support-chat';
    
    console.log('🔌 Admin connecting to WebSocket:', wsUrl);
    
    const newSocket = io(wsUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('✅ Admin connected to support chat');
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
      console.error('Make sure backend is running on port 12001');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected from support chat:', reason);
    });

    newSocket.on('new_conversation', () => {
      refetchConversations();
    });

    // Listen for new messages - use ref to avoid stale closure
    newSocket.on('new_message', (message: any) => {
      console.log('📨 Admin received new_message:', message);
      const currentConv = selectedConversationRef.current;
      if (currentConv && message.conversationId === currentConv.id) {
        // Check if message already exists to avoid duplication
        setMessages(prev => {
          const exists = prev.some(m => m.id === message.id);
          if (exists) {
            console.log('⚠️ Message already exists, skipping:', message.id);
            return prev;
          }
          return [...prev, message];
        });
      }
      refetchConversations();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Refetch when filter changes
  useEffect(() => {
    refetchConversations();
  }, [filter, refetchConversations]);

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);

    // Join conversation via WebSocket
    if (socket && user) {
      socket.emit('join_conversation', {
        conversationId: conversation.id,
        userId: user.id,
      });
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedConversation || !user) return;

    const messageContent = inputMessage;
    setInputMessage(''); // Clear immediately

    // Optimistic update - add message immediately to UI
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      senderType: 'AGENT',
      senderName: user.username || 'Agent',
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const result = await sendMessageMutation({
        variables: {
          input: {
            conversationId: selectedConversation.id,
            content: messageContent,
            senderType: 'AGENT',
            senderId: user.id,
            senderName: user.username || 'Agent',
          },
        },
      });

      // Replace optimistic message with real one
      if (result.data?.sendSupportMessage) {
        setMessages(prev => prev.map(m => 
          m.id === optimisticMessage.id ? result.data.sendSupportMessage : m
        ));
      }

      // Backend will broadcast via WebSocket, no need to emit here
      // This prevents duplication
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message and restore input on error
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      setInputMessage(messageContent);
    }
  };

  const assignToMe = async () => {
    if (!selectedConversation || !user) return;

    try {
      await assignToAgentMutation({
        variables: {
          conversationId: selectedConversation.id,
          agentId: user.id, // Use actual logged-in user ID
        },
      });

      refetchConversations();
    } catch (error) {
      console.error('Error assigning conversation:', error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'FACEBOOK':
        return <Facebook className="w-4 h-4" />;
      case 'ZALO':
        return <ZaloIcon className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-600 bg-red-100';
      case 'HIGH':
        return 'text-orange-600 bg-orange-100';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hỗ trợ khách hàng</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý tất cả hội thoại</p>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">Tổng số</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-gray-500">Đang xử lý</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.waiting}</div>
              <div className="text-xs text-gray-500">Chờ xử lý</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.avgResponseTime}s</div>
              <div className="text-xs text-gray-500">Thời gian phản hồi</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm khách hàng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('waiting')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'waiting'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chờ xử lý
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đang xử lý
            </button>
            
            {/* Auth Type Filter */}
            <select
              value={authTypeFilter}
              onChange={(e) => setAuthTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="all">Tất cả loại xác thực</option>
              <option value="PHONE">📱 Điện thoại</option>
              <option value="ZALO">💬 Zalo</option>
              <option value="FACEBOOK">👥 Facebook</option>
              <option value="GOOGLE">🔍 Google</option>
              <option value="USER_ACCOUNT">🔐 Tài khoản</option>
              <option value="GUEST">👤 Khách</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
          {conversations.map((conversation: Conversation) => (
            <motion.div
              key={conversation.id}
              whileHover={{ backgroundColor: '#f9fafb' }}
              onClick={() => selectConversation(conversation)}
              className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {conversation.customerName?.[0]?.toUpperCase() || 'K'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.customerName || 'Khách hàng'}
                      </h3>
                      {conversation.authType && (
                        <CustomerAuthBadge 
                          authType={conversation.authType} 
                          size="sm"
                        />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      {getPlatformIcon(conversation.platform)}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(conversation.priority)}`}>
                        {conversation.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessagePreview || 'Chưa có tin nhắn'}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {conversation.lastMessageAt
                        ? new Date(conversation.lastMessageAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>
                    {conversation.assignedAgent && (
                      <span className="text-xs text-blue-600">
                        {conversation.assignedAgent.username}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {selectedConversation.customerName?.[0]?.toUpperCase() || 'K'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.customerName || 'Khách hàng'}
                      </h3>
                      {selectedConversation.authType && (
                        <CustomerAuthBadge 
                          authType={selectedConversation.authType} 
                          showLabel 
                        />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {selectedConversation.customerEmail && (
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{selectedConversation.customerEmail}</span>
                        </span>
                      )}
                      {selectedConversation.customerPhone && (
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{selectedConversation.customerPhone}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={assignToMe}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Nhận hội thoại
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderType === 'AGENT' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                      message.senderType === 'AGENT'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {message.senderType !== 'AGENT' && (
                      <div className="flex items-center justify-between mb-1">
                        {message.isAIGenerated ? (
                          <div className="flex items-center space-x-1">
                            <Bot className="w-3 h-3 text-blue-500" />
                            <span className="text-xs font-medium text-gray-600">AI</span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-gray-600">
                            {message.senderName || 'Khách hàng'}
                          </span>
                        )}
                        {message.customerAuthType && (
                          <CustomerAuthBadge 
                            authType={message.customerAuthType} 
                            size="sm"
                          />
                        )}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className={`text-xs block mt-1 ${message.senderType === 'AGENT' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(message.sentAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>

                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  rows={1}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />

                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim()}
                  className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Chọn một hội thoại để bắt đầu</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
