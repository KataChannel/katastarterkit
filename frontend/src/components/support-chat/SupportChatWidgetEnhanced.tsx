'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useMutation, useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  ChevronDown,
  CheckCheck,
  Bot,
  User,
  Phone,
  Mail,
  Facebook,
  Chrome,
  RotateCcw,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Image,
  File,
  Smile,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// GraphQL Mutations
const CREATE_CONVERSATION_WITH_AUTH = gql`
  mutation CreateSupportConversationWithAuth($input: CreateConversationWithAuthInput!) {
    createSupportConversationWithAuth(input: $input) {
      id
      conversationCode
      customerName
      authType
      platform
    }
  }
`;

const SEND_SUPPORT_MESSAGE = gql`
  mutation SendSupportMessage($input: SendSupportMessageInput!) {
    sendSupportMessage(input: $input) {
      id
      content
      senderType
      senderName
      customerAuthType
      customerAuthIcon
      sentAt
      isRead
    }
  }
`;

const GET_SUPPORT_CONVERSATION = gql`
  query GetSupportConversation($id: String!) {
    supportConversation(id: $id) {
      id
      conversationCode
      customerName
      authType
      status
      messages {
        id
        content
        senderType
        senderName
        customerAuthIcon
        sentAt
        isRead
      }
    }
  }
`;

interface Message {
  id: string;
  content: string;
  senderType: 'CUSTOMER' | 'AGENT' | 'BOT';
  senderName?: string;
  customerAuthType?: string;
  customerAuthIcon?: string;
  sentAt: string;
  isRead: boolean;
  isAIGenerated?: boolean;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
}

interface QuickReply {
  icon: string;
  text: string;
}

interface SupportChatWidgetEnhancedProps {
  apiUrl?: string;
  websocketUrl?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
  enableZaloLogin?: boolean;
  enableFacebookLogin?: boolean;
  enableGoogleLogin?: boolean;
  enableSoundNotification?: boolean;
  enableDesktopNotification?: boolean;
  enableFileUpload?: boolean;
  enableEmojis?: boolean;
  quickReplies?: QuickReply[];
  welcomeMessage?: string;
  offlineMessage?: string;
}

export default function SupportChatWidgetEnhanced({
  apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001',
  websocketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:12001/support-chat',
  primaryColor = '#2563eb',
  position = 'bottom-right',
  enableZaloLogin = true,
  enableFacebookLogin = true,
  enableGoogleLogin = true,
  enableSoundNotification = true,
  enableDesktopNotification = true,
  enableFileUpload = true,
  enableEmojis = true,
  quickReplies = [
    { icon: '💰', text: 'Giá sản phẩm' },
    { icon: '📦', text: 'Theo dõi đơn hàng' },
    { icon: '🚚', text: 'Vận chuyển' },
    { icon: '🔄', text: 'Đổi trả hàng' },
    { icon: '💳', text: 'Thanh toán' },
  ],
  welcomeMessage = 'Xin chào! Tôi có thể giúp gì cho bạn?',
  offlineMessage = 'Xin lỗi, hiện không có nhân viên trực. Vui lòng để lại tin nhắn.',
}: SupportChatWidgetEnhancedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  
  // Sound & Notification settings
  const [soundEnabled, setSoundEnabled] = useState(enableSoundNotification);
  const [notificationEnabled, setNotificationEnabled] = useState(enableDesktopNotification);
  
  // Authentication state
  const [authType, setAuthType] = useState<'GUEST' | 'PHONE' | 'ZALO' | 'FACEBOOK' | 'GOOGLE'>('GUEST');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showAuthInput, setShowAuthInput] = useState(true);
  const [agentInfo, setAgentInfo] = useState<any>(null);
  
  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);

  // Storage key for persistence
  const STORAGE_KEY = 'support_chat_enhanced_session';

  // Initialize notification sound
  useEffect(() => {
    if (typeof window !== 'undefined') {
      notificationSoundRef.current = new Audio('/sounds/notification.mp3');
      notificationSoundRef.current.volume = 0.5;
    }
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (soundEnabled && notificationSoundRef.current) {
      notificationSoundRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, [soundEnabled]);

  // Show desktop notification
  const showDesktopNotification = useCallback((title: string, body: string) => {
    if (notificationEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icons/chat-icon.png',
        badge: '/icons/chat-badge.png',
      });
    }
  }, [notificationEnabled]);

  // Request notification permission
  useEffect(() => {
    if (notificationEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [notificationEnabled]);

  // Clear session and start new conversation
  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCustomerName('');
    setCustomerPhone('');
    setConversationId(null);
    setMessages([]);
    setShowAuthInput(true);
    setAuthType('GUEST');
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [socket]);

  // Apollo mutations and queries
  const [createConversationMutation] = useMutation(CREATE_CONVERSATION_WITH_AUTH);
  const [sendMessageMutation] = useMutation(SEND_SUPPORT_MESSAGE);
  const [fetchConversation] = useLazyQuery(GET_SUPPORT_CONVERSATION, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.supportConversation?.messages) {
        const serverMessages = data.supportConversation.messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          senderType: msg.senderType,
          senderName: msg.senderName,
          customerAuthIcon: msg.customerAuthIcon || getAuthIcon(authType),
          sentAt: msg.sentAt || msg.createdAt,
          isRead: msg.isRead,
        }));
        setMessages(serverMessages);
      }
    },
    onError: (error) => {
      console.error('Error fetching conversation:', error);
      if (error.message.includes('not found') || error.message.includes('Not found')) {
        clearSession();
      }
    },
  });

  // Get auth icon based on type
  const getAuthIcon = (type: string) => {
    const icons: Record<string, string> = {
      GUEST: '👤',
      PHONE: '📱',
      ZALO: '💬',
      FACEBOOK: '👥',
      GOOGLE: '🔍',
      USER_ACCOUNT: '🔐',
    };
    return icons[type] || '👤';
  };

  // Load saved session from localStorage on mount
  useEffect(() => {
    let savedConvId: string | null = null;
    try {
      const savedSession = localStorage.getItem(STORAGE_KEY);
      if (savedSession) {
        const session = JSON.parse(savedSession);
        if (session.customerName) setCustomerName(session.customerName);
        if (session.customerPhone) setCustomerPhone(session.customerPhone);
        if (session.authType) setAuthType(session.authType);
        if (session.conversationId) {
          savedConvId = session.conversationId;
          setConversationId(session.conversationId);
          setShowAuthInput(false);
        }
        if (session.messages?.length > 0) {
          setMessages(session.messages);
        }
        if (session.soundEnabled !== undefined) setSoundEnabled(session.soundEnabled);
        if (session.notificationEnabled !== undefined) setNotificationEnabled(session.notificationEnabled);
      }
    } catch (error) {
      console.error('Error loading saved session:', error);
    }
    setIsLoading(false);
    
    if (savedConvId) {
      fetchConversation({ variables: { id: savedConvId } });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save session to localStorage when data changes
  useEffect(() => {
    if (!isLoading && (customerName || customerPhone || conversationId)) {
      try {
        const session = {
          customerName,
          customerPhone,
          conversationId,
          authType,
          messages: messages.slice(-50),
          soundEnabled,
          notificationEnabled,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }
  }, [customerName, customerPhone, conversationId, authType, messages, soundEnabled, notificationEnabled, isLoading]);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (isOpen && !socket) {
      const newSocket = io(websocketUrl, {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('✅ Connected to support chat');
        setIsOnline(true);
        if (conversationId) {
          newSocket.emit('join_conversation', { conversationId });
        }
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from support chat');
        setIsOnline(false);
      });

      newSocket.on('new_message', (message: Message) => {
        console.log('📩 New message received:', message);
        setMessages(prev => {
          const exists = prev.some(m => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });
        if (message.senderType !== 'CUSTOMER') {
          setUnreadCount(prev => prev + 1);
          playNotificationSound();
          if (!isOpen || document.hidden) {
            showDesktopNotification(
              agentInfo?.name || 'Hỗ trợ khách hàng',
              message.content
            );
          }
        }
        scrollToBottom();
      });

      newSocket.on('ai_suggestion', (data: any) => {
        console.log('🤖 AI Suggestion:', data);
      });

      newSocket.on('user_typing', () => {
        setIsTyping(true);
      });

      newSocket.on('user_stopped_typing', () => {
        setIsTyping(false);
      });

      newSocket.on('agent_assigned', (data: any) => {
        console.log('👤 Agent assigned:', data);
        setAgentInfo(data.agent);
      });

      newSocket.on('customer_auth_updated', (data: any) => {
        console.log('🔐 Customer auth updated:', data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen, websocketUrl, conversationId, playNotificationSound, showDesktopNotification, agentInfo?.name]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start conversation với guest (phone + name)
  const startGuestConversation = async () => {
    if (!customerName.trim() || !customerPhone.trim()) return;

    setIsSending(true);
    try {
      const { data } = await createConversationMutation({
        variables: {
          input: {
            customerName,
            customerPhone,
            authType: 'PHONE',
            platform: 'WEBSITE',
          },
        },
      });

      if (!data?.createSupportConversationWithAuth) {
        throw new Error('Failed to create conversation');
      }
      
      const conversation = data.createSupportConversationWithAuth;
      
      setConversationId(conversation.id);
      setAuthType('PHONE');
      setShowAuthInput(false);

      // Join conversation via WebSocket
      if (socket) {
        socket.emit('join_conversation', {
          conversationId: conversation.id,
        });
      }

      // Send welcome message
      setMessages([
        {
          id: '1',
          content: welcomeMessage.replace('{name}', customerName),
          senderType: 'BOT',
          senderName: 'Trợ lý ảo',
          sentAt: new Date().toISOString(),
          isRead: true,
          isAIGenerated: true,
        },
      ]);

      // Focus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    } catch (error) {
      console.error('❌ Error starting conversation:', error);
      alert('Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setIsSending(false);
    }
  };

  // Social login handlers
  const handleZaloLogin = async () => {
    try {
      const { initZaloAuth } = await import('@/lib/social-auth');
      const result = await initZaloAuth();
      
      if (result.success && result.accessToken) {
        await startSocialConversation('ZALO', result.accessToken);
      }
    } catch (error: any) {
      console.error('Zalo login error:', error);
      alert('Đăng nhập Zalo thất bại. Vui lòng thử lại.');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const { initFacebookAuth } = await import('@/lib/social-auth');
      const result = await initFacebookAuth();
      
      if (result.success && result.accessToken) {
        await startSocialConversation('FACEBOOK', result.accessToken);
      }
    } catch (error: any) {
      console.error('Facebook login error:', error);
      alert('Đăng nhập Facebook thất bại. Vui lòng thử lại.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { initGoogleAuth } = await import('@/lib/social-auth');
      const result = await initGoogleAuth();
      
      if (result.success && result.accessToken) {
        await startSocialConversation('GOOGLE', result.accessToken);
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      alert('Đăng nhập Google thất bại. Vui lòng thử lại.');
    }
  };

  // Start conversation with social auth
  const startSocialConversation = async (provider: 'ZALO' | 'FACEBOOK' | 'GOOGLE', accessToken: string) => {
    setIsSending(true);
    try {
      const { data } = await createConversationMutation({
        variables: {
          input: {
            authType: provider,
            socialAccessToken: accessToken,
            platform: 'WEBSITE',
          },
        },
      });

      if (!data?.createSupportConversationWithAuth) {
        throw new Error('Failed to create conversation');
      }
      
      const conversation = data.createSupportConversationWithAuth;
      
      setConversationId(conversation.id);
      setAuthType(provider);
      setCustomerName(conversation.customerName);
      setShowAuthInput(false);

      if (socket) {
        socket.emit('join_conversation', {
          conversationId: conversation.id,
        });
      }

      const providerNames: Record<string, string> = {
        ZALO: 'Zalo',
        FACEBOOK: 'Facebook',
        GOOGLE: 'Google',
      };

      setMessages([
        {
          id: '1',
          content: `Xin chào ${conversation.customerName}! Cảm ơn bạn đã đăng nhập qua ${providerNames[provider]}. ${welcomeMessage}`,
          senderType: 'BOT',
          senderName: 'Trợ lý ảo',
          sentAt: new Date().toISOString(),
          isRead: true,
          isAIGenerated: true,
        },
      ]);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    } catch (error) {
      console.error('❌ Error starting social conversation:', error);
      alert('Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setIsSending(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversationId || isSending) return;

    const messageContent = inputMessage;
    setInputMessage('');
    setIsSending(true);

    try {
      const { data } = await sendMessageMutation({
        variables: {
          input: {
            conversationId,
            content: messageContent,
            senderType: 'CUSTOMER',
            senderName: customerName,
            customerAuthType: authType,
          },
        },
      });

      // Optimistic update
      setMessages(prev => [...prev, {
        id: data?.sendSupportMessage?.id || `temp-${Date.now()}`,
        content: messageContent,
        senderType: 'CUSTOMER',
        senderName: customerName,
        customerAuthType: authType,
        customerAuthIcon: getAuthIcon(authType),
        sentAt: new Date().toISOString(),
        isRead: false,
      }]);

    } catch (error) {
      console.error('❌ Error sending message:', error);
      setInputMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  // Handle quick reply click
  const handleQuickReply = (text: string) => {
    setInputMessage(text);
    inputRef.current?.focus();
  };

  const handleTyping = () => {
    if (socket && conversationId) {
      socket.emit('typing_start', {
        conversationId,
        userId: 'customer',
      });

      setTimeout(() => {
        socket.emit('typing_stop', {
          conversationId,
          userId: 'customer',
        });
      }, 3000);
    }
  };

  const positionClasses = position === 'bottom-right' 
    ? 'right-4 sm:right-6' 
    : 'left-4 sm:left-6';

  // Zalo icon component
  const ZaloIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2" fill="#0068FF">
      <path d="M12.49 10.272v-.45h1.347v6.322h-.678a.672.672 0 01-.669-.669v-.113a2.743 2.743 0 01-1.678.563 2.985 2.985 0 01-2.994-2.994 2.985 2.985 0 012.994-2.994 2.73 2.73 0 011.678.335zm-1.566.788a1.9 1.9 0 00-1.903 1.903 1.9 1.9 0 001.903 1.904 1.9 1.9 0 001.903-1.904 1.9 1.9 0 00-1.903-1.903zM17.715 15.044a.7.7 0 01.225.563v.337h-3.445v-.337c0-.225.075-.394.225-.563l2.322-3.107h-2.21v-.9h3.221v.45a.79.79 0 01-.225.563l-2.21 2.994h2.097zM4.477 16.053V7.947c0-.9.9-1.578 1.791-1.347l5.95 1.572a1.463 1.463 0 011.122 1.397v8.106c0 .9-.9 1.578-1.791 1.347l-5.95-1.572a1.464 1.464 0 01-1.122-1.397z"/>
    </svg>
  );

  return (
    <>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        onChange={handleFileUpload}
      />

      {/* Chat Button - Mobile First */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={cn(
              "fixed bottom-4 sm:bottom-6 z-50",
              positionClasses
            )}
          >
            <Button
              size="lg"
              className={cn(
                "relative h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl text-white border-0",
                "hover:scale-110 active:scale-95 transition-transform hover:opacity-90",
                "bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)]"
              )}
              style={{ '--chat-primary': primaryColor } as React.CSSProperties}
              onClick={() => setIsOpen(true)}
            >
              <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window - Mobile Full Screen + Desktop Floating */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              // Mobile: Full screen
              "fixed inset-0 z-50",
              // Desktop: Floating window
              "sm:inset-auto sm:bottom-6 sm:w-[420px]",
              // Position for desktop
              position === 'bottom-right' ? 'sm:right-6' : 'sm:left-6'
            )}
            style={{
              maxHeight: isMinimized ? '64px' : undefined,
              height: isMinimized ? 'auto' : undefined,
            }}
          >
            <Card className={cn(
              "h-full flex flex-col shadow-2xl border-0",
              "rounded-none sm:rounded-xl",
              "sm:max-h-[650px]"
            )}>
              {/* Header */}
              <CardHeader
                className="p-4 text-white relative overflow-hidden cursor-pointer flex-shrink-0 safe-area-inset-top"
                style={{ backgroundColor: primaryColor }}
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {/* Animated background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute w-32 h-32 bg-white rounded-full -top-10 -left-10 animate-pulse" />
                  <div className="absolute w-24 h-24 bg-white rounded-full -bottom-5 -right-5 animate-pulse" 
                       style={{ animationDelay: '300ms' }} />
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-white/20">
                        <AvatarImage src={agentInfo?.avatar} alt={agentInfo?.name} />
                        <AvatarFallback className="bg-white/20">
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      {/* Online indicator */}
                      <span className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                        isOnline ? "bg-green-500" : "bg-gray-400"
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">
                        {agentInfo?.name || 'Hỗ trợ khách hàng'}
                      </h3>
                      <p className="text-xs opacity-90">
                        {isTyping ? 'Đang nhập...' : isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* Sound toggle */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSoundEnabled(!soundEnabled);
                      }}
                    >
                      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    
                    {/* Notification toggle */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      title={notificationEnabled ? 'Tắt thông báo' : 'Bật thông báo'}
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotificationEnabled(!notificationEnabled);
                      }}
                    >
                      {notificationEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </Button>

                    {/* New conversation button */}
                    {!showAuthInput && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        title="Cuộc hội thoại mới"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSession();
                        }}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMinimized(!isMinimized);
                      }}
                    >
                      <ChevronDown 
                        className={cn(
                          "h-5 w-5 transition-transform",
                          isMinimized && "rotate-180"
                        )} 
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                        setUnreadCount(0);
                      }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  {/* Messages/Auth Area */}
                  <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full px-4 py-4">
                      {showAuthInput ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Card className="p-6 border-0 shadow-sm">
                            <h4 className="font-semibold mb-2 text-foreground">
                              Chào mừng bạn! 👋
                            </h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Chọn cách bắt đầu cuộc trò chuyện:
                            </p>

                            <Tabs defaultValue="phone" className="w-full">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="phone">
                                  <Phone className="h-4 w-4 mr-2" />
                                  Số điện thoại
                                </TabsTrigger>
                                <TabsTrigger value="social">
                                  <User className="h-4 w-4 mr-2" />
                                  Đăng nhập
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent value="phone" className="space-y-3 mt-4">
                                <Input
                                  type="text"
                                  value={customerName}
                                  onChange={(e) => setCustomerName(e.target.value)}
                                  placeholder="Tên của bạn..."
                                  className="h-11"
                                />
                                <Input
                                  type="tel"
                                  value={customerPhone}
                                  onChange={(e) => setCustomerPhone(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && startGuestConversation()}
                                  placeholder="Số điện thoại..."
                                  className="h-11"
                                />
                                <Button
                                  onClick={startGuestConversation}
                                  disabled={!customerName.trim() || !customerPhone.trim() || isSending}
                                  className={cn(
                                    "w-full h-11 text-white border-0",
                                    "bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)] hover:opacity-90"
                                  )}
                                  style={{ '--chat-primary': primaryColor } as React.CSSProperties}
                                >
                                  {isSending ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <Phone className="h-4 w-4 mr-2" />
                                  )}
                                  Bắt đầu chat
                                </Button>
                              </TabsContent>

                              <TabsContent value="social" className="space-y-3 mt-4">
                                {enableZaloLogin && (
                                  <Button
                                    onClick={handleZaloLogin}
                                    variant="outline"
                                    className="w-full h-11"
                                    disabled={isSending}
                                  >
                                    <ZaloIcon />
                                    Đăng nhập với Zalo
                                  </Button>
                                )}
                                {enableFacebookLogin && (
                                  <Button
                                    onClick={handleFacebookLogin}
                                    variant="outline"
                                    className="w-full h-11"
                                    disabled={isSending}
                                  >
                                    <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                                    Đăng nhập với Facebook
                                  </Button>
                                )}
                                {enableGoogleLogin && (
                                  <Button
                                    onClick={handleGoogleLogin}
                                    variant="outline"
                                    className="w-full h-11"
                                    disabled={isSending}
                                  >
                                    <Chrome className="h-4 w-4 mr-2 text-red-600" />
                                    Đăng nhập với Google
                                  </Button>
                                )}
                                {!enableZaloLogin && !enableFacebookLogin && !enableGoogleLogin && (
                                  <p className="text-sm text-muted-foreground text-center py-4">
                                    Đăng nhập mạng xã hội không khả dụng.
                                  </p>
                                )}
                              </TabsContent>
                            </Tabs>
                          </Card>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message, index) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={cn(
                                "flex",
                                message.senderType === 'CUSTOMER' ? 'justify-end' : 'justify-start'
                              )}
                            >
                              <div
                                className={cn(
                                  "max-w-[80%] rounded-2xl px-4 py-2.5",
                                  message.senderType === 'CUSTOMER'
                                    ? 'text-white rounded-br-sm'
                                    : 'bg-muted text-foreground rounded-bl-sm'
                                )}
                                style={{
                                  backgroundColor: message.senderType === 'CUSTOMER' ? primaryColor : undefined,
                                }}
                              >
                                {message.senderType !== 'CUSTOMER' && (
                                  <div className="flex items-center space-x-1 mb-1">
                                    {message.isAIGenerated ? (
                                      <Bot className="h-3 w-3 text-primary" />
                                    ) : (
                                      <User className="h-3 w-3 text-muted-foreground" />
                                    )}
                                    <span className="text-xs font-medium text-muted-foreground">
                                      {message.senderName}
                                    </span>
                                  </div>
                                )}
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                <div className="flex items-center justify-end space-x-1 mt-1">
                                  {message.customerAuthIcon && (
                                    <span className="text-xs mr-1">{message.customerAuthIcon}</span>
                                  )}
                                  <span className={cn(
                                    "text-xs",
                                    message.senderType === 'CUSTOMER' ? 'text-white/70' : 'text-muted-foreground'
                                  )}>
                                    {new Date(message.sentAt).toLocaleTimeString('vi-VN', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                  {message.senderType === 'CUSTOMER' && (
                                    <CheckCheck
                                      className={cn(
                                        "h-3.5 w-3.5",
                                        message.isRead ? 'text-blue-300' : 'text-white/50'
                                      )}
                                    />
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {isTyping && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex justify-start"
                            >
                              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" 
                                       style={{ animationDelay: '150ms' }} />
                                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" 
                                       style={{ animationDelay: '300ms' }} />
                                </div>
                              </div>
                            </motion.div>
                          )}

                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>

                  {/* Input Area - Footer with safe area for mobile */}
                  {!showAuthInput && (
                    <div className="p-4 border-t bg-background flex-shrink-0 pb-safe">
                      {/* Quick Replies - Show only on first message or few messages */}
                      {messages.length <= 2 && quickReplies.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {quickReplies.map((reply, idx) => (
                            <Button
                              key={idx}
                              variant="secondary"
                              size="sm"
                              className="h-auto py-1.5 px-3 text-xs rounded-full"
                              onClick={() => handleQuickReply(reply.text)}
                            >
                              <span className="mr-1">{reply.icon}</span>
                              {reply.text}
                            </Button>
                          ))}
                        </div>
                      )}

                      <div className="flex items-end space-x-2">
                        {/* File upload button */}
                        {enableFileUpload && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="flex-shrink-0 h-11 w-11"
                            title="Đính kèm file"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Paperclip className="h-5 w-5" />
                          </Button>
                        )}

                        {/* Emoji button */}
                        {enableEmojis && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="flex-shrink-0 h-11 w-11 hidden sm:flex"
                            title="Emoji"
                          >
                            <Smile className="h-5 w-5" />
                          </Button>
                        )}

                        <div className="flex-1">
                          <Input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={(e) => {
                              setInputMessage(e.target.value);
                              handleTyping();
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Nhập tin nhắn..."
                            className="rounded-xl h-11"
                            disabled={isSending}
                          />
                        </div>

                        <Button
                          size="icon"
                          onClick={sendMessage}
                          disabled={!inputMessage.trim() || isSending}
                          className={cn(
                            "flex-shrink-0 rounded-xl text-white border-0 h-11 w-11",
                            "bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)] hover:opacity-90"
                          )}
                          style={{ '--chat-primary': primaryColor } as React.CSSProperties}
                        >
                          {isSending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Send className="h-5 w-5" />
                          )}
                        </Button>
                      </div>

                      {/* Selected files preview */}
                      {selectedFiles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedFiles.map((file, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {file.type.startsWith('image/') ? (
                                <Image className="h-3 w-3 mr-1" />
                              ) : (
                                <File className="h-3 w-3 mr-1" />
                              )}
                              {file.name.length > 15 ? file.name.slice(0, 15) + '...' : file.name}
                              <button
                                className="ml-1 text-muted-foreground hover:text-foreground"
                                onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== idx))}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
