'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { chatService, createStompClient } from '../../services/chatService';
import { ChatMessage, ConversationSummary, Product } from '../../types';
import { MessageSquare, X, Send, Store, ShieldCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import { Client } from '@stomp/stompjs';
import toast from 'react-hot-toast';

export const CustomerChatWidget: React.FC = () => {
  const { user, token, isAuthenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [pinnedProduct, setPinnedProduct] = useState<Partial<Product> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);

  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Global listener: allows any button (Header, ProductCard, etc.) to pop open chat
  useEffect(() => {
    const handleOpenChatEvent = (e: any) => {
      const product = e.detail as Partial<Product> | null;
      if (product) {
        setPinnedProduct(product);
      }
      setIsOpen(true);
    };

    window.addEventListener('open-store-chat', handleOpenChatEvent);
    return () => {
      window.removeEventListener('open-store-chat', handleOpenChatEvent);
    };
  }, []);

  // Fetch customer conversations
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const loadConversations = async () => {
      try {
        const list = await chatService.getCustomerConversations();
        setConversations(list);
        const unread = list.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        setUnreadTotal(unread);

        if (pinnedProduct && pinnedProduct.id) {
          const match = list.find((c) => c.productId === Number(pinnedProduct.id));
          if (match) {
            setActiveConversationId(match.id);
          }
        }
      } catch (err) {
        console.error('Failed to load conversations', err);
      }
    };

    loadConversations();
  }, [isAuthenticated, token, isOpen, pinnedProduct]);

  // Fetch thread messages
  useEffect(() => {
    if (!activeConversationId || !token) return;

    const loadMessages = async () => {
      try {
        const history = await chatService.getConversationMessages(activeConversationId);
        setMessages(history);
        await chatService.markAsRead(activeConversationId);
        setUnreadTotal((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Failed to load message history', err);
      }
    };

    loadMessages();
  }, [activeConversationId, token]);

  // Real-time WebSocket connection
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const client = createStompClient(
      token,
      (stompClient) => {
        setIsConnected(true);

        stompClient.subscribe('/user/queue/chat', (stompMessage) => {
          try {
            const newMsg: ChatMessage = JSON.parse(stompMessage.body);

            setActiveConversationId((currentActiveId) => {
              if (currentActiveId === newMsg.conversationId) {
                setMessages((prev) => {
                  if (prev.some((m) => m.id === newMsg.id)) return prev;
                  return [...prev, newMsg];
                });
                chatService.markAsRead(newMsg.conversationId);
              } else {
                setUnreadTotal((prev) => prev + 1);
                toast.success(`Store Owner: "${newMsg.content.substring(0, 30)}..."`);
              }
              return currentActiveId;
            });
          } catch (e) {
            console.error('Failed to parse incoming WebSocket message', e);
          }
        });
      },
      () => {
        setIsConnected(false);
      }
    );

    stompClientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [isAuthenticated, token]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isAuthenticated) return;

    const text = inputMessage.trim();
    setInputMessage('');
    const currentProduct = pinnedProduct;
    setPinnedProduct(null);

    const payload = {
      conversationId: activeConversationId,
      productId: currentProduct ? Number(currentProduct.id) : null,
      content: text
    };

    try {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.publish({
          destination: '/app/chat.send',
          body: JSON.stringify(payload)
        });
      } else {
        const savedMsg = await chatService.sendMessageRest(payload);
        setMessages((prev) => [...prev, savedMsg]);
        if (!activeConversationId) {
          setActiveConversationId(savedMsg.conversationId);
        }
      }
    } catch (err: any) {
      toast.error('Failed to send: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <>
      {/* 1. FLOATING LAUNCHER BUTTON (Bottom Right - Fixed) */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999 }}>
        <button
          id="open-chat-widget-btn"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'relative',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 8px 25px rgba(6, 182, 212, 0.45)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          aria-label="Customer Support Chat"
        >
          {isOpen ? <X size={26} /> : <MessageSquare size={26} />}

          {unreadTotal > 0 && !isOpen && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #0f172a'
              }}
            >
              {unreadTotal}
            </span>
          )}
        </button>
      </div>

      {/* 2. CHAT DRAWER WINDOW */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '520px',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '18px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 99999,
            overflow: 'hidden',
            fontFamily: 'inherit'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#020617',
              padding: '12px 16px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  position: 'relative',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#22d3ee'
                }}
              >
                <Store size={18} />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: isConnected ? '#10b981' : '#f59e0b',
                    border: '2px solid #020617'
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Store Owner Support</span>
                  <ShieldCheck size={14} color="#22d3ee" />
                </div>
                <div style={{ fontSize: '11px', color: isConnected ? '#34d399' : '#94a3b8' }}>
                  {isConnected ? '● Online & Ready' : '● Connecting...'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {activeConversationId && (
                <button
                  onClick={() => {
                    setActiveConversationId(null);
                    setPinnedProduct(null);
                  }}
                  style={{
                    background: '#1e293b',
                    color: '#94a3b8',
                    border: 'none',
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ArrowLeft size={12} /> All Chats
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isAuthenticated ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(6, 182, 212, 0.1)',
                  color: '#22d3ee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}
              >
                <MessageSquare size={24} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px' }}>
                Ask the Store Owner
              </h4>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.4 }}>
                Please sign in to your account so the store owner can respond directly to you in real-time.
              </p>
              <a
                href="/login"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '8px 18px',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                Sign In to Chat
              </a>
            </div>
          ) : !activeConversationId && conversations.length > 0 && !pinnedProduct ? (
            /* Threads Listing */
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#94a3b8',
                  marginBottom: '10px',
                  padding: '0 4px'
                }}
              >
                <span>Your Inquiries</span>
                <button
                  onClick={() => setActiveConversationId(null)}
                  style={{ background: 'none', border: 'none', color: '#22d3ee', cursor: 'pointer', fontSize: '12px' }}
                >
                  + New Question
                </button>
              </div>

              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConversationId(c.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.productName || 'General Inquiry'}
                      </span>
                      {c.unreadCount > 0 && (
                        <span style={{ background: '#06b6d4', color: '#020617', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '10px' }}>
                          {c.unreadCount} new
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.lastMessage}
                    </p>
                  </div>
                  <ChevronRight size={16} color="#64748b" />
                </button>
              ))}
            </div>
          ) : (
            /* Active Thread */
            <>
              {/* Pinned Product banner */}
              {pinnedProduct && (
                <div
                  style={{
                    background: '#020617',
                    borderBottom: '1px solid #1e293b',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    {pinnedProduct.image && (
                      <img
                        src={pinnedProduct.image}
                        alt=""
                        style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: '#f1f5f9', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pinnedProduct.name}
                      </div>
                      <div style={{ color: '#22d3ee', fontSize: '11px', fontWeight: 700 }}>
                        {typeof pinnedProduct.price === 'number'
                          ? `LKR ${pinnedProduct.price.toLocaleString()}`
                          : pinnedProduct.price || ''}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setPinnedProduct(null)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Message bubbles */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.length === 0 ? (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#94a3b8' }}>Ask anything about this product!</p>
                    <p style={{ margin: 0, fontSize: '11px' }}>Warranty, specs, compatibility or delivery.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderRole === 'ROLE_CUSTOMER' || msg.senderRole === 'CUSTOMER';
                    return (
                      <div
                        key={msg.id || Math.random()}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '85%',
                            padding: '10px 14px',
                            borderRadius: '14px',
                            fontSize: '12px',
                            lineHeight: 1.4,
                            background: isMe ? 'linear-gradient(135deg, #0284c7, #2563eb)' : '#1e293b',
                            color: '#ffffff',
                            border: isMe ? 'none' : '1px solid #334155'
                          }}
                        >
                          {!isMe && (
                            <div style={{ fontSize: '10px', fontWeight: 700, color: '#22d3ee', marginBottom: '4px' }}>
                              Store Owner
                            </div>
                          )}

                          {/* 📦 EMBEDDED PRODUCT CARD BUBBLE */}
                          {msg.productName && (
                            <div
                              style={{
                                background: isMe ? 'rgba(0,0,0,0.3)' : '#0f172a',
                                border: isMe ? '1px solid rgba(255,255,255,0.2)' : '1px solid #334155',
                                borderRadius: '8px',
                                padding: '6px 10px',
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              {msg.productImageUrl && (
                                <img
                                  src={msg.productImageUrl}
                                  alt={msg.productName}
                                  style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '6px',
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                    border: '1px solid rgba(255,255,255,0.1)'
                                  }}
                                />
                              )}
                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {msg.productName}
                                </div>
                                {msg.productPrice != null && (
                                  <div style={{ fontSize: '10px', color: isMe ? '#bae6fd' : '#38bdf8', fontWeight: 600 }}>
                                    {typeof msg.productPrice === 'number'
                                      ? `LKR ${msg.productPrice.toLocaleString()}`
                                      : msg.productPrice}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div style={{ wordBreak: 'break-word' }}>{msg.content}</div>
                        </div>
                        <span style={{ fontSize: '9px', color: '#64748b', marginTop: '2px', padding: '0 4px' }}>
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Just now'}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Customer Question Chips */}
              <div
                style={{
                  background: '#090d1a',
                  borderTop: '1px solid #1e293b',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap'
                }}
              >
                {[
                  'Is this item in stock?',
                  'What is the warranty period?',
                  'Is islandwide delivery available?',
                  'Can you suggest best alternatives?'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputMessage(chip)}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      color: '#94a3b8',
                      fontSize: '11px',
                      borderRadius: '12px',
                      padding: '3px 8px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input box */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '10px 14px',
                  background: '#020617',
                  borderTop: '1px solid #1e293b',
                  display: 'flex',
                  gap: '8px'
                }}
              >
                <input
                  type="text"
                  placeholder="Type your question..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: !inputMessage.trim() ? 0.4 : 1
                  }}
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CustomerChatWidget;
