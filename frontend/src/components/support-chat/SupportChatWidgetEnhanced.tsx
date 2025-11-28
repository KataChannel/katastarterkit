'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useMutation } from '@apollo/client';
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
}

interface SupportChatWidgetEnhancedProps {
  apiUrl?: string;
  websocketUrl?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
  enableZaloLogin?: boolean;
  enableFacebookLogin?: boolean;
  enableGoogleLogin?: boolean;
}

export default function SupportChatWidgetEnhanced({
  apiUrl = 'http://localhost:3001',
  websocketUrl = 'http://localhost:3001/support-chat',
  primaryColor = '#2563eb',
  position = 'bottom-right',
  enableZaloLogin = true,
  enableFacebookLogin = true,
  enableGoogleLogin = true,
}: SupportChatWidgetEnhancedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Authentication state
  const [authType, setAuthType] = useState<'GUEST' | 'PHONE' | 'ZALO' | 'FACEBOOK' | 'GOOGLE'>('GUEST');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showAuthInput, setShowAuthInput] = useState(true);
  const [agentInfo, setAgentInfo] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Apollo mutations
  const [createConversationMutation] = useMutation(CREATE_CONVERSATION_WITH_AUTH);
  const [sendMessageMutation] = useMutation(SEND_SUPPORT_MESSAGE);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (isOpen && !socket) {
      const newSocket = io(websocketUrl, {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to support chat');
      });

      newSocket.on('new_message', (message: Message) => {
        setMessages(prev => [...prev, message]);
        if (message.senderType !== 'CUSTOMER') {
          setUnreadCount(prev => prev + 1);
        }
        scrollToBottom();
      });

      newSocket.on('ai_suggestion', (data: any) => {
        console.log('AI Suggestion:', data);
      });

      newSocket.on('user_typing', () => {
        setIsTyping(true);
      });

      newSocket.on('user_stopped_typing', () => {
        setIsTyping(false);
      });

      newSocket.on('agent_assigned', (data: any) => {
        setAgentInfo(data.agent);
      });

      newSocket.on('customer_auth_updated', (data: any) => {
        console.log('Customer auth updated:', data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen, websocketUrl]);

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
          content: `Xin chào ${customerName}! Tôi có thể giúp gì cho bạn?`,
          senderType: 'BOT',
          senderName: 'Trợ lý ảo',
          sentAt: new Date().toISOString(),
          isRead: true,
          isAIGenerated: true,
        },
      ]);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  // Social login handlers
  const handleZaloLogin = async () => {
    // TODO: Implement Zalo OAuth flow
    console.log('Zalo login');
    // After getting access token from Zalo OAuth:
    // startSocialConversation('ZALO', accessToken);
  };

  const handleFacebookLogin = async () => {
    // TODO: Implement Facebook OAuth flow
    console.log('Facebook login');
  };

  const handleGoogleLogin = async () => {
    // TODO: Implement Google OAuth flow
    console.log('Google login');
  };

  // Start conversation with social auth
  const startSocialConversation = async (provider: 'ZALO' | 'FACEBOOK' | 'GOOGLE', accessToken: string) => {
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

      setMessages([
        {
          id: '1',
          content: `Xin chào ${conversation.customerName}! Cảm ơn bạn đã đăng nhập qua ${provider}. Tôi có thể giúp gì cho bạn?`,
          senderType: 'BOT',
          senderName: 'Trợ lý ảo',
          sentAt: new Date().toISOString(),
          isRead: true,
          isAIGenerated: true,
        },
      ]);
    } catch (error) {
      console.error('Error starting social conversation:', error);
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
            customerAuthType: authType,
          },
        },
      });

      if (socket && data?.sendSupportMessage) {
        socket.emit('send_message', {
          conversationId,
          messageId: data.sendSupportMessage.id,
          content: messageContent,
          senderType: 'CUSTOMER',
          senderName: customerName,
          customerAuthType: authType,
        });
      }

      setMessages(prev => [...prev, {
        id: data?.sendSupportMessage?.id || Date.now().toString(),
        content: messageContent,
        senderType: 'CUSTOMER',
        senderName: customerName,
        customerAuthType: authType,
        customerAuthIcon: data?.sendSupportMessage?.customerAuthIcon,
        sentAt: new Date().toISOString(),
        isRead: false,
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setInputMessage(messageContent);
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

  const positionClasses = position === 'bottom-right' 
    ? 'right-4 sm:right-6' 
    : 'left-4 sm:left-6';

  return (
    <>
      {/* Chat Button */}
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

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-4 sm:bottom-6 z-50",
              "w-[calc(100vw-2rem)] sm:w-96",
              positionClasses
            )}
            style={{
              maxHeight: isMinimized ? '64px' : 'calc(100vh - 8rem)',
              height: isMinimized ? 'auto' : '600px',
            }}
          >
            <Card className="h-full flex flex-col shadow-2xl border-0">
              {/* Header */}
              <CardHeader
                className="p-4 text-white relative overflow-hidden cursor-pointer"
                style={{ backgroundColor: primaryColor }}
                onClick={() => setIsMinimized(!isMinimized)}
              >
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
                  <CardContent className="flex-1 p-0">
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
                                />
                                <Input
                                  type="tel"
                                  value={customerPhone}
                                  onChange={(e) => setCustomerPhone(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && startGuestConversation()}
                                  placeholder="Số điện thoại..."
                                />
                                <Button
                                  onClick={startGuestConversation}
                                  disabled={!customerName.trim() || !customerPhone.trim()}
                                  className={cn(
                                    "w-full text-white border-0",
                                    "bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)] hover:opacity-90"
                                  )}
                                  style={{ '--chat-primary': primaryColor } as React.CSSProperties}
                                >
                                  Bắt đầu chat
                                </Button>
                              </TabsContent>

                              <TabsContent value="social" className="space-y-3 mt-4">
                                {enableZaloLogin && (
                                  <Button
                                    onClick={handleZaloLogin}
                                    variant="outline"
                                    className="w-full"
                                  >
                                    <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                                    Đăng nhập với Zalo
                                  </Button>
                                )}
                                {enableFacebookLogin && (
                                  <Button
                                    onClick={handleFacebookLogin}
                                    variant="outline"
                                    className="w-full"
                                  >
                                    <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                                    Đăng nhập với Facebook
                                  </Button>
                                )}
                                {enableGoogleLogin && (
                                  <Button
                                    onClick={handleGoogleLogin}
                                    variant="outline"
                                    className="w-full"
                                  >
                                    <Chrome className="h-4 w-4 mr-2 text-red-600" />
                                    Đăng nhập với Google
                                  </Button>
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

                  {/* Input Area */}
                  {!showAuthInput && (
                    <div className="p-4 border-t bg-background">
                      <div className="flex items-end space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="flex-shrink-0"
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
                            className="rounded-xl"
                          />
                        </div>

                        <Button
                          size="icon"
                          onClick={sendMessage}
                          disabled={!inputMessage.trim()}
                          className={cn(
                            "flex-shrink-0 rounded-xl text-white border-0",
                            "bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)] hover:opacity-90"
                          )}
                          style={{ '--chat-primary': primaryColor } as React.CSSProperties}
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
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
