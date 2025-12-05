'use client';

import { RagChatWidget } from '@/components/rag-chatbot';

/**
 * RAG Chat Widget Provider
 * Wrap pages that need the floating chat widget
 */
export function RagChatProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <RagChatWidget 
        position="bottom-right"
        title="Trợ lý AI Rau Sạch"
        placeholder="Hỏi về sản phẩm, đơn hàng, khách hàng..."
      />
    </>
  );
}
