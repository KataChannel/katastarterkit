'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageSquare, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Trash2,
  RotateCcw,
  Maximize2,
  Minimize2,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getGraphqlEndpoint, getAuthToken } from '@/lib/api-config';

// Types
interface RAGSource {
  type: string;
  entity: string;
  relevance: number;
}

interface RAGResponse {
  answer: string;
  sources: RAGSource[];
  contextUsed: string[];
  confidence: number;
  suggestedQueries?: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: RAGSource[];
  suggestedQueries?: string[];
  isLoading?: boolean;
}

interface RagChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  defaultExpanded?: boolean;
  title?: string;
  placeholder?: string;
  graphqlEndpoint?: string;
}

// GraphQL query
const RAG_CHAT_QUERY = `
  query RagChat($input: RAGQueryInput!) {
    ragChat(input: $input) {
      answer
      sources {
        type
        entity
        relevance
      }
      contextUsed
      confidence
      suggestedQueries
    }
  }
`;

export function RagChatWidget({
  position = 'bottom-right',
  defaultExpanded = false,
  title = 'Trợ lý AI Rau Sạch',
  placeholder = 'Hỏi về sản phẩm, đơn hàng, khách hàng...',
  graphqlEndpoint,
}: RagChatWidgetProps) {
  // Use configured endpoint or environment variable
  const resolvedEndpoint = useMemo(() => graphqlEndpoint || getGraphqlEndpoint(), [graphqlEndpoint]);
  
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Cuộn xuống cuối khi có tin nhắn mới
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input khi mở widget
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Gửi tin nhắn
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };

    // Thêm tin nhắn user và loading placeholder
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: `loading-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true,
      },
    ]);
    
    setInput('');
    setIsLoading(true);

    try {
      const token = getAuthToken();
      const response = await fetch(resolvedEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          query: RAG_CHAT_QUERY,
          variables: {
            input: {
              message: messageText.trim(),
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Có lỗi xảy ra');
      }

      const ragResponse: RAGResponse = result.data.ragChat;

      // Replace loading message với response
      setMessages((prev) => [
        ...prev.filter((m) => !m.isLoading),
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: ragResponse.answer,
          timestamp: new Date(),
          sources: ragResponse.sources,
          suggestedQueries: ragResponse.suggestedQueries,
        },
      ]);
    } catch (error) {
      console.error('RAG Chat error:', error);
      
      // Replace loading với error message
      setMessages((prev) => [
        ...prev.filter((m) => !m.isLoading),
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Handle keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Handle suggested query click
  const handleSuggestedQuery = (query: string) => {
    sendMessage(query);
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Position classes
  const positionClasses = {
    'bottom-right': 'right-4 bottom-4',
    'bottom-left': 'left-4 bottom-4',
  };

  // Widget size classes
  const widgetSizeClasses = isExpanded
    ? 'w-[90vw] h-[80vh] max-w-4xl'
    : 'w-96 h-[500px] max-h-[70vh]';

  return (
    <div className={cn('fixed z-50', positionClasses[position])}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-all duration-300',
            widgetSizeClasses
          )}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-xs text-white/80">Hỗ trợ 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                onClick={clearChat}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 px-4">
                <div className="bg-green-100 rounded-full p-4 mb-4">
                  <Bot className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-700 mb-2">Xin chào! 👋</h4>
                <p className="text-sm mb-4">
                  Tôi là trợ lý AI của hệ thống rau sạch. Bạn có thể hỏi tôi về:
                </p>
                <div className="space-y-2 w-full max-w-xs">
                  {[
                    'Thống kê tổng quan hệ thống',
                    'Danh sách sản phẩm đang bán',
                    'Đơn hàng hôm nay',
                    'Sản phẩm sắp hết hàng',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestedQuery(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-green-50 rounded-lg transition-colors border border-gray-200 hover:border-green-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                        message.role === 'user'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-green-100 text-green-600'
                      )}
                    >
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div
                      className={cn(
                        'flex-1 max-w-[80%]',
                        message.role === 'user' ? 'text-right' : 'text-left'
                      )}
                    >
                      <div
                        className={cn(
                          'inline-block px-4 py-2 rounded-2xl text-sm',
                          message.role === 'user'
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-800 rounded-bl-md'
                        )}
                      >
                        {message.isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Đang suy nghĩ...</span>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        )}
                      </div>

                      {/* Sources */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.sources.map((source, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs bg-gray-50"
                            >
                              {source.type}: {source.entity}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Suggested Queries */}
                      {message.suggestedQueries && message.suggestedQueries.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <p className="text-xs text-gray-500">Câu hỏi gợi ý:</p>
                          {message.suggestedQueries.map((query, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestedQuery(query)}
                              className="block w-full text-left text-xs px-2 py-1.5 bg-green-50 hover:bg-green-100 rounded text-green-700 transition-colors"
                            >
                              → {query}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      <div
                        className={cn(
                          'text-xs text-gray-400 mt-1',
                          message.role === 'user' ? 'text-right' : 'text-left'
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="min-h-[44px] max-h-32 resize-none bg-white"
                rows={1}
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-[44px] px-4 bg-green-500 hover:bg-green-600"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Powered by Gemini AI • Dữ liệu cập nhật realtime
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default RagChatWidget;
