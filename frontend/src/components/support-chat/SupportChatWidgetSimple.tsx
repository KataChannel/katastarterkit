'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useMutation, useLazyQuery } from '@apollo/client';
import { CREATE_CONVERSATION_WITH_AUTH, SEND_SUPPORT_MESSAGE, GET_SUPPORT_CONVERSATION } from '@/graphql/support-chat/support-chat.graphql';
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
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  senderType: 'CUSTOMER' | 'AGENT' | 'BOT';
  senderName?: string;
  customerAuthIcon?: string;
  sentAt: string;
  isRead: boolean;
  isAIGenerated?: boolean;
}

interface SupportChatWidgetSimpleProps {
  apiUrl?: string;
  websocketUrl?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export default function SupportChatWidgetSimple({
  apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001',
  websocketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:12001/support-chat',
  primaryColor = '#2563eb',
  position = 'bottom-right',
}: SupportChatWidgetSimpleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Phone auth state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showAuthInput, setShowAuthInput] = useState(true);
  const [agentInfo, setAgentInfo] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Storage key for persistence
  const STORAGE_KEY = 'support_chat_session';

  // Clear session and start new conversation
  const clearSession = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    
    // Reset state
    setCustomerName('');
    setCustomerPhone('');
    setConversationId(null);
    setMessages([]);
    setShowAuthInput(true);
    
    // Disconnect socket
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
          customerAuthIcon: msg.customerAuthIcon || '📱',
          sentAt: msg.sentAt || msg.createdAt,
          isRead: msg.isRead,
        }));
        setMessages(serverMessages);
      }
    },
    onError: (error) => {
      console.error('Error fetching conversation:', error);
      // If conversation not found, clear local storage and reset
      if (error.message.includes('not found') || error.message.includes('Not found')) {
        clearSession();
      }
    },
  });

  // Load saved session from localStorage on mount
  useEffect(() => {
    let savedConvId: string | null = null;
    try {
      const savedSession = localStorage.getItem(STORAGE_KEY);
      if (savedSession) {
        const session = JSON.parse(savedSession);
        if (session.customerName) setCustomerName(session.customerName);
        if (session.customerPhone) setCustomerPhone(session.customerPhone);
        if (session.conversationId) {
          savedConvId = session.conversationId;
          setConversationId(session.conversationId);
          setShowAuthInput(false);
        }
        // Load cached messages initially (they'll be updated by server fetch)
        if (session.messages?.length > 0) {
          setMessages(session.messages);
        }
      }
    } catch (error) {
      console.error('Error loading saved session:', error);
    }
    setIsLoading(false);
    
    // Fetch fresh messages from server if we have a saved conversation
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
          messages: messages.slice(-50), // Save last 50 messages only
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }
  }, [customerName, customerPhone, conversationId, messages, isLoading]);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (isOpen && !socket) {
      const newSocket = io(websocketUrl, {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('✅ Connected to support chat');
        // Rejoin conversation if we have one from saved session
        if (conversationId) {
          newSocket.emit('join_conversation', { conversationId });
        }
      });

      newSocket.on('new_message', (message: Message) => {
        console.log('📩 New message received:', message);
        // Check for duplicates to avoid double-adding
        setMessages(prev => {
          const exists = prev.some(m => m.id === message.id);
          if (exists) {
            console.log('⚠️ Message already exists, skipping:', message.id);
            return prev;
          }
          return [...prev, message];
        });
        if (message.senderType !== 'CUSTOMER') {
          setUnreadCount(prev => prev + 1);
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
  }, [isOpen, websocketUrl, conversationId]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start conversation với phone auth
  const startConversation = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      return;
    }

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
          content: `Xin chào ${customerName}! Cảm ơn bạn đã liên hệ. Tôi có thể giúp gì cho bạn?`,
          senderType: 'BOT',
          senderName: 'Trợ lý ảo',
          sentAt: new Date().toISOString(),
          isRead: true,
          isAIGenerated: true,
        },
      ]);

      // Focus input after successful connection
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);

    } catch (error) {
      console.error('❌ Error starting conversation:', error);
      alert('Không thể kết nối. Vui lòng thử lại.');
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversationId) return;

    const messageContent = inputMessage;
    setInputMessage('');

    try {
      const { data } = await sendMessageMutation({
        variables: {
          input: {
            conversationId,
            content: messageContent,
            senderType: 'CUSTOMER',
            senderName: customerName,
            customerAuthType: 'PHONE',
          },
        },
      });

      // Optimistic update - add message immediately
      // Backend will broadcast via WebSocket, so we just add locally
      // Check for duplicates when receiving WebSocket message
      setMessages(prev => [...prev, {
        id: data?.sendSupportMessage?.id || `temp-${Date.now()}`,
        content: messageContent,
        senderType: 'CUSTOMER',
        senderName: customerName,
        customerAuthIcon: '📱',
        sentAt: new Date().toISOString(),
        isRead: false,
      }]);

    } catch (error) {
      console.error('❌ Error sending message:', error);
      setInputMessage(messageContent); // Restore message on error
    }
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

  // Position classes for chat button (floating button, not fullscreen)
  const buttonPositionClasses = position === 'bottom-right' 
    ? 'right-4 sm:right-6' 
    : 'left-4 sm:left-6';

  return (
    <>
      {/* Chat Button - Mobile First */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={cn(
              "fixed bottom-4 sm:bottom-6 z-50",
              buttonPositionClasses
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
              "sm:inset-auto sm:bottom-6 sm:w-96",
              // Position for desktop
              position === 'bottom-right' ? 'sm:right-6' : 'sm:left-6'
            )}
            style={{
              // Mobile: always full height, Desktop: limited height
              maxHeight: isMinimized ? '64px' : undefined,
              height: isMinimized ? 'auto' : undefined,
            }}
          >
            <Card className={cn(
              "h-full flex flex-col shadow-2xl border-0",
              // Mobile: no rounded corners, Desktop: rounded
              "rounded-none sm:rounded-xl",
              // Desktop: limit height
              "sm:max-h-[600px]"
            )}>
              {/* Header - Fixed at top */}
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
                    <Avatar className="h-10 w-10 border-2 border-white/20">
                      <AvatarImage src={agentInfo?.avatar} alt={agentInfo?.name} />
                      <AvatarFallback className="bg-white/20">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">
                        {agentInfo?.name || 'Hỗ trợ khách hàng'}
                      </h3>
                      <p className="text-xs opacity-90">
                        {isTyping ? 'Đang nhập...' : 'Trực tuyến'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* New conversation button - only show when already authenticated */}
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
                  {/* Messages Area - Scrollable content */}
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
                              Vui lòng cho chúng tôi biết thông tin để bắt đầu hội thoại.
                            </p>

                            <div className="space-y-3">
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
                                onKeyPress={(e) => e.key === 'Enter' && startConversation()}
                                placeholder="Số điện thoại..."
                                className="h-11"
                              />
                              <Button
                                onClick={startConversation}
                                disabled={!customerName.trim() || !customerPhone.trim()}
                                className={cn(
                                  "w-full h-11 text-white border-0",
                                  "bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)] hover:opacity-90"
                                )}
                                style={{ '--chat-primary': primaryColor } as React.CSSProperties}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Bắt đầu chat
                              </Button>
                            </div>
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
                      <div className="flex items-end space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="flex-shrink-0 h-11 w-11"
                          title="Đính kèm file"
                        >
                          <Paperclip className="h-5 w-5" />
                        </Button>

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
                          />
                        </div>

                        <Button
                          size="icon"
                          onClick={sendMessage}
                          disabled={!inputMessage.trim()}
                          className={cn(
                            "flex-shrink-0 rounded-xl text-white border-0 h-11 w-11",
                            "bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)] hover:opacity-90"
                          )}
                          style={{ '--chat-primary': primaryColor } as React.CSSProperties}
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Quick Replies */}
                      {messages.length === 1 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {[
                            { icon: '💰', text: 'Giá sản phẩm' },
                            { icon: '📦', text: 'Theo dõi đơn hàng' },
                            { icon: '🚚', text: 'Vận chuyển' },
                          ].map((reply, idx) => (
                            <Button
                              key={idx}
                              variant="secondary"
                              size="sm"
                              className="h-auto py-1.5 px-3 text-xs rounded-full"
                              onClick={() => {
                                setInputMessage(reply.text);
                                inputRef.current?.focus();
                              }}
                            >
                              <span className="mr-1">{reply.icon}</span>
                              {reply.text}
                            </Button>
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
