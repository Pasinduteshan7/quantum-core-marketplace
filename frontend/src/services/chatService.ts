import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from './api';
import { ChatMessage, ConversationSummary, SendMessagePayload } from '../types';

export const getWebSocketUrl = (): string => {
  // In our setup, Spring Boot runs on 8080
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  return apiUrl.replace('/api', '') + '/ws';
};

/**
 * Creates and activates a configured STOMP client over SockJS.
 */
export const createStompClient = (
  token: string | null,
  onConnect: (client: Client) => void,
  onError?: (err: any) => void
): Client => {
  const wsUrl = getWebSocketUrl();

  const client = new Client({
    webSocketFactory: () => new SockJS(wsUrl) as any,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (str) => {
      // In development, you can uncomment to see frames
      // console.log('[STOMP]', str);
    },
    onConnect: () => {
      onConnect(client);
    },
    onStompError: (frame) => {
      console.error('[STOMP Error]', frame.headers['message'], frame.body);
      if (onError) onError(frame);
    },
    onWebSocketError: (event) => {
      console.error('[WebSocket Error]', event);
      if (onError) onError(event);
    }
  });

  client.activate();
  return client;
};

/**
 * REST API Chat helpers
 */
export const chatService = {
  /**
   * Send message via REST (fallback or initial thread kickoff)
   */
  sendMessageRest: async (payload: SendMessagePayload): Promise<ChatMessage> => {
    const res = await api.post<ChatMessage>('/chat/send', payload);
    return res.data;
  },

  /**
   * Get all conversations for the logged-in customer
   */
  getCustomerConversations: async (): Promise<ConversationSummary[]> => {
    const res = await api.get<ConversationSummary[]>('/chat/conversations');
    return res.data;
  },

  /**
   * Get all conversations across the store (Store Owner / Admin only)
   */
  getAdminConversations: async (): Promise<ConversationSummary[]> => {
    const res = await api.get<ConversationSummary[]>('/chat/admin/conversations');
    return res.data;
  },

  /**
   * Fetch complete message history for a conversation thread
   */
  getConversationMessages: async (conversationId: number): Promise<ChatMessage[]> => {
    const res = await api.get<ChatMessage[]>(`/chat/conversations/${conversationId}/messages`);
    return res.data;
  },

  /**
   * Mark messages in a conversation as read
   */
  markAsRead: async (conversationId: number): Promise<void> => {
    await api.post(`/chat/conversations/${conversationId}/read`);
  }
};
