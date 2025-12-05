'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  RefreshCw,
  BarChart3,
  Search,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface RAGMetrics {
  totalQueries: number;
  avgResponseTime: number;
  successRate: number;
  topIntents: { intent: string; count: number }[];
  topContextTypes: { type: string; count: number }[];
}

interface RagChatPageProps {
  graphqlEndpoint?: string;
}

// Quick action categories
const QUICK_ACTIONS = [
  {
    icon: Package,
    label: 'Sản phẩm',
    queries: [
      'Danh sách sản phẩm đang bán',
      'Sản phẩm có giá cao nhất',
      'Sản phẩm bán chạy nhất',
    ],
    color: 'text-blue-600 bg-blue-100',
  },
  {
    icon: ShoppingCart,
    label: 'Đơn hàng',
    queries: [
      'Đơn hàng hôm nay',
      'Đơn hàng chờ giao',
      'Tổng doanh thu tháng này',
    ],
    color: 'text-green-600 bg-green-100',
  },
  {
    icon: Users,
    label: 'Khách hàng',
    queries: [
      'Danh sách khách hàng',
      'Top khách hàng mua nhiều nhất',
      'Khách hàng mới trong tháng',
    ],
    color: 'text-purple-600 bg-purple-100',
  },
  {
    icon: Warehouse,
    label: 'Tồn kho',
    queries: [
      'Sản phẩm sắp hết hàng',
      'Tổng giá trị tồn kho',
      'Sản phẩm cần nhập thêm',
    ],
    color: 'text-orange-600 bg-orange-100',
  },
];

// GraphQL queries
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

const RAG_QUICK_STATS_QUERY = `
  query RagQuickStats {
    ragQuickStats {
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

const RAG_METRICS_QUERY = `
  query RagMetrics {
    ragMetrics {
      totalQueries
      avgResponseTime
      successRate
      topIntents {
        intent
        count
      }
      topContextTypes {
        type
        count
      }
    }
  }
`;

export function RagChatPage({ graphqlEndpoint }: RagChatPageProps) {
  // Use configured endpoint or environment variable
  const resolvedEndpoint = useMemo(() => graphqlEndpoint || getGraphqlEndpoint(), [graphqlEndpoint]);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<RAGMetrics | null>(null);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load metrics on mount
  useEffect(() => {
    loadMetrics();
  }, [resolvedEndpoint]);

  const loadMetrics = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(resolvedEndpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ query: RAG_METRICS_QUERY }),
      });
      const result = await response.json();
      if (result.data?.ragMetrics) {
        setMetrics(result.data.ragMetrics);
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  // Send message
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };

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
            input: { message: messageText.trim() },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Có lỗi xảy ra');
      }

      const ragResponse: RAGResponse = result.data.ragChat;

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

      // Refresh metrics
      loadMetrics();
    } catch (error) {
      console.error('RAG Chat error:', error);
      
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

  // Get quick stats
  const getQuickStats = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(resolvedEndpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ query: RAG_QUICK_STATS_QUERY }),
      });

      const result = await response.json();

      if (result.data?.ragQuickStats) {
        const ragResponse: RAGResponse = result.data.ragQuickStats;
        
        setMessages((prev) => [
          ...prev,
          {
            id: `stats-${Date.now()}`,
            role: 'assistant',
            content: ragResponse.answer,
            timestamp: new Date(),
            sources: ragResponse.sources,
            suggestedQueries: ragResponse.suggestedQueries,
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to get quick stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
  };

  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 p-4">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">RAG Chatbot - Hệ thống Rau Sạch</h2>
                <p className="text-sm text-white/80">Truy vấn dữ liệu bằng ngôn ngữ tự nhiên</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={getQuickStats}
                className="text-white hover:bg-white/20"
                disabled={isLoading}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Thống kê
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-white hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Làm mới
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="bg-green-100 rounded-full p-6 mb-6">
                <Bot className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Chào mừng đến với RAG Chatbot! 🌿
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Tôi có thể giúp bạn truy vấn thông tin về sản phẩm, đơn hàng, khách hàng, 
                tồn kho và nhiều thông tin khác từ hệ thống rau sạch.
              </p>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                {QUICK_ACTIONS.map((action) => (
                  <Card
                    key={action.label}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', action.color)}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <h4 className="font-medium text-sm mb-2">{action.label}</h4>
                      <div className="space-y-1">
                        {action.queries.slice(0, 2).map((query) => (
                          <button
                            key={query}
                            onClick={() => sendMessage(query)}
                            className="w-full text-left text-xs text-gray-500 hover:text-green-600 truncate flex items-center gap-1"
                          >
                            <ChevronRight className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{query}</span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
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

                  <div className={cn('flex-1 max-w-[80%]', message.role === 'user' ? 'text-right' : 'text-left')}>
                    <div
                      className={cn(
                        'inline-block px-4 py-3 rounded-2xl',
                        message.role === 'user'
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      )}
                    >
                      {message.isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Đang xử lý...</span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      )}
                    </div>

                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.sources.map((source, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {source.type}: {source.entity}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {message.suggestedQueries && message.suggestedQueries.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-gray-500">Gợi ý tiếp theo:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestedQueries.map((query, index) => (
                            <button
                              key={index}
                              onClick={() => sendMessage(query)}
                              className="text-xs px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded-full text-green-700 transition-colors"
                            >
                              {query}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-400 mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về sản phẩm, đơn hàng, khách hàng..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={!input.trim() || isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>

      {/* Sidebar - Metrics */}
      <div className="w-full lg:w-80 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Thống kê RAG
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {metrics.totalQueries}
                    </div>
                    <div className="text-xs text-gray-500">Tổng queries</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {metrics.successRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Tỷ lệ thành công</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">
                    {metrics.avgResponseTime.toFixed(0)}ms
                  </div>
                  <div className="text-xs text-gray-500">Thời gian phản hồi TB</div>
                </div>

                {metrics.topIntents.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Top Intents</h4>
                    <div className="space-y-1">
                      {metrics.topIntents.slice(0, 5).map((intent, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-gray-600">{intent.intent}</span>
                          <Badge variant="secondary">{intent.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-400 py-4">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm">Đang tải metrics...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Hướng dẫn sử dụng</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 space-y-2">
            <p>• Hỏi bằng ngôn ngữ tự nhiên tiếng Việt</p>
            <p>• Có thể hỏi về: sản phẩm, đơn hàng, khách hàng, tồn kho</p>
            <p>• Hệ thống tự động nhận diện ý định và trích xuất dữ liệu</p>
            <p>• Click vào gợi ý để tiếp tục trò chuyện</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RagChatPage;
