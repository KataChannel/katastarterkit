'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
// DEPRECATED: Apollo Client removed
const useMutation = () => [async () => ({}), { data: null, loading: false, error: null }];
import { CREATE_SUPPORT_CONVERSATION, SEND_SUPPORT_MESSAGE } from '@/graphql/support-chat/support-chat.graphql';
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  ChevronDown,
  CheckCheck,
  Bot,
  User,
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderType: 'CUSTOMER' | 'AGENT' | 'BOT';
  senderName?: string;
  sentAt: string;
  isRead: boolean;
  isAIGenerated?: boolean;
}

interface SupportChatWidgetProps {
  apiUrl?: string;
  websocketUrl?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export default function SupportChatWidget({
  apiUrl = 'http://localhost:3001',
  websocketUrl = 'http://localhost:3001/support-chat',
  primaryColor = '#2563eb',
  position = 'bottom-right',
}: SupportChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [agentInfo, setAgentInfo] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Apollo mutations
  const [createConversationMutation] = useMutation(CREATE_SUPPORT_CONVERSATION);
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

  // Start conversation
  const startConversation = async () => {
    if (!customerName.trim()) return;

    try {
      const { data } = await createConversationMutation({
        variables: {
          input: {
            customerName,
            platform: 'WEBSITE',
          },
        },
      });

      if (!data?.createSupportConversation) {
        throw new Error('Failed to create conversation');
      }
      
      const conversation = data.createSupportConversation;
      
      setConversationId(conversation.id);
      setShowNameInput(false);

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

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversationId) return;

    const messageContent = inputMessage;
    setInputMessage(''); // Clear input immediately

    try {
      // Send via GraphQL mutation to save in DB
      const { data } = await sendMessageMutation({
        variables: {
          input: {
            conversationId,
            content: messageContent,
            senderType: 'CUSTOMER',
            senderName: customerName,
          },
        },
      });

      // Also send via WebSocket for real-time
      if (socket && data?.sendSupportMessage) {
        socket.emit('send_message', {
          conversationId,
          messageId: data.sendSupportMessage.id,
          content: messageContent,
          senderType: 'CUSTOMER',
          senderName: customerName,
        });
      }

      // Add to local messages (optimistic update)
      setMessages(prev => [...prev, {
        id: data?.sendSupportMessage?.id || Date.now().toString(),
        content: messageContent,
        senderType: 'CUSTOMER',
        senderName: customerName,
        sentAt: new Date().toISOString(),
        isRead: false,
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setInputMessage(messageContent); // Restore message on error
    }
  };

  // Handle typing indicator
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
    ? 'right-4 md:right-6' 
    : 'left-4 md:left-6';

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-4 md:bottom-6 ${positionClasses} z-50 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-opacity-50`}
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 4px ${primaryColor}20`,
            }}
          >
            <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : undefined,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-4 md:bottom-6 ${positionClasses} z-50 w-[calc(100vw-2rem)] md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
            style={{
              maxHeight: isMinimized ? '60px' : 'calc(100vh - 8rem)',
              height: isMinimized ? 'auto' : '600px',
            }}
          >
            {/* Header */}
            <div
              className="p-4 flex items-center justify-between text-white relative overflow-hidden"
              style={{ backgroundColor: primaryColor }}
            >
              {/* Animated background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute w-32 h-32 bg-white rounded-full -top-10 -left-10 animate-pulse" />
                <div className="absolute w-24 h-24 bg-white rounded-full -bottom-5 -right-5 animate-pulse delay-300" />
              </div>

              <div className="flex items-center space-x-3 relative z-10">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    {agentInfo?.avatar ? (
                      <img 
                        src={agentInfo.avatar} 
                        alt={agentInfo.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Bot className="w-6 h-6" />
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    {agentInfo ? agentInfo.name : 'Hỗ trợ khách hàng'}
                  </h3>
                  <p className="text-xs opacity-90">
                    {isTyping ? 'Đang nhập...' : 'Trực tuyến'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 relative z-10">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform ${isMinimized ? 'rotate-180' : ''}`} 
                  />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setUnreadCount(0);
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {showNameInput ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl p-6 shadow-sm"
                    >
                      <h4 className="font-semibold mb-2 text-gray-900">
                        Chào mừng bạn! 👋
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Vui lòng cho chúng tôi biết tên của bạn để bắt đầu hội thoại.
                      </p>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && startConversation()}
                        placeholder="Nhập tên của bạn..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-3"
                      />
                      <button
                        onClick={startConversation}
                        disabled={!customerName.trim()}
                        className="w-full py-2 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Bắt đầu chat
                      </button>
                    </motion.div>
                  ) : (
                    messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${message.senderType === 'CUSTOMER' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                            message.senderType === 'CUSTOMER'
                              ? 'text-white rounded-br-sm'
                              : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                          }`}
                          style={{
                            backgroundColor: message.senderType === 'CUSTOMER' ? primaryColor : undefined,
                          }}
                        >
                          {message.senderType !== 'CUSTOMER' && (
                            <div className="flex items-center space-x-1 mb-1">
                              {message.isAIGenerated ? (
                                <Bot className="w-3 h-3 text-blue-500" />
                              ) : (
                                <User className="w-3 h-3 text-gray-500" />
                              )}
                              <span className="text-xs font-medium text-gray-600">
                                {message.senderName}
                              </span>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-end space-x-1 mt-1">
                            <span className={`text-xs ${message.senderType === 'CUSTOMER' ? 'text-white/70' : 'text-gray-400'}`}>
                              {new Date(message.sentAt).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {message.senderType === 'CUSTOMER' && (
                              <CheckCheck
                                className={`w-3.5 h-3.5 ${message.isRead ? 'text-blue-300' : 'text-white/50'}`}
                              />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                {!showNameInput && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-end space-x-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        title="Đính kèm file"
                      >
                        <Paperclip className="w-5 h-5 text-gray-500" />
                      </button>

                      <div className="flex-1 relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputMessage}
                          onChange={(e) => {
                            setInputMessage(e.target.value);
                            handleTyping();
                          }}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Nhập tin nhắn..."
                          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        />
                      </div>

                      <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim()}
                        className="p-2.5 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quick Replies */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {messages.length === 1 && (
                        <>
                          <button className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                            💰 Giá sản phẩm
                          </button>
                          <button className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                            📦 Theo dõi đơn hàng
                          </button>
                          <button className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                            🚚 Vận chuyển
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
