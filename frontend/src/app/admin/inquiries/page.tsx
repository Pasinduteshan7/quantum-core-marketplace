'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { chatService, createStompClient } from '../../../services/chatService';
import { ChatMessage, ConversationSummary } from '../../../types';
import { 
  MessageSquare, 
  Send, 
  User, 
  Package, 
  CheckCircle2, 
  Clock, 
  Search, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Radio
} from 'lucide-react';
import { Client } from '@stomp/stompjs';
import toast from 'react-hot-toast';

export default function AdminInquiriesPage() {
  const { user, token, isAdmin } = useAuth();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isWsConnected, setIsWsConnected] = useState(false);

  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = conversations.find((c) => c.id === selectedConvId);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversations on mount
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await chatService.getAdminConversations();
      setConversations(data);
      if (data.length > 0 && !selectedConvId) {
        setSelectedConvId(data[0].id);
      }
    } catch (err: any) {
      toast.error('Failed to load inquiries: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && token) {
      fetchConversations();
    }
  }, [isAdmin, token]);

  // Load message history when selected conversation changes
  useEffect(() => {
    if (!selectedConvId || !token) return;

    const loadThread = async () => {
      try {
        const history = await chatService.getConversationMessages(selectedConvId);
        setMessages(history);
        await chatService.markAsRead(selectedConvId);

        // Update unread count locally in sidebar
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedConvId ? { ...c, unreadCount: 0 } : c))
        );
      } catch (err: any) {
        toast.error('Failed to load message history');
      }
    };

    loadThread();
  }, [selectedConvId, token]);

  // Setup Real-Time WebSocket connection to /topic/admin/chat
  useEffect(() => {
    if (!isAdmin || !token) return;

    const client = createStompClient(
      token,
      (stomp) => {
        setIsWsConnected(true);

        // Store Owner listens to all incoming customer inquiries
        stomp.subscribe('/topic/admin/chat', (stompMessage) => {
          try {
            const incoming: ChatMessage = JSON.parse(stompMessage.body);

            // If message is from a customer, show a quick notification
            if (incoming.senderRole === 'ROLE_CUSTOMER' || incoming.senderRole === 'CUSTOMER') {
              toast(`💬 New customer question: "${incoming.content.substring(0, 30)}..."`, {
                icon: '📩'
              });
            }

            // Append to current chat if it belongs to selected conversation
            setSelectedConvId((currentSelected) => {
              if (currentSelected === incoming.conversationId) {
                setMessages((prev) => {
                  if (prev.some((m) => m.id === incoming.id)) return prev;
                  return [...prev, incoming];
                });
                chatService.markAsRead(incoming.conversationId);
              }
              return currentSelected;
            });

            // Update conversation list item lastMessage and timestamp
            setConversations((prevList) => {
              const exists = prevList.find((c) => c.id === incoming.conversationId);
              if (exists) {
                return prevList.map((c) =>
                  c.id === incoming.conversationId
                    ? {
                        ...c,
                        lastMessage: incoming.content,
                        lastMessageTime: incoming.createdAt,
                        unreadCount:
                          c.id === selectedConvId
                            ? 0
                            : incoming.senderRole === 'ROLE_CUSTOMER'
                            ? c.unreadCount + 1
                            : c.unreadCount
                      }
                    : c
                );
              } else {
                // If brand new conversation started, reload list
                fetchConversations();
                return prevList;
              }
            });
          } catch (e) {
            console.error('Error handling incoming admin chat', e);
          }
        });
      },
      () => {
        setIsWsConnected(false);
      }
    );

    stompClientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [isAdmin, token, selectedConvId]);

  // Handle Admin sending a reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConvId) return;

    const text = replyText.trim();
    setReplyText('');

    const payload = {
      conversationId: selectedConvId,
      content: text
    };

    try {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.publish({
          destination: '/app/chat.send',
          body: JSON.stringify(payload)
        });
      } else {
        const saved = await chatService.sendMessageRest(payload);
        setMessages((prev) => [...prev, saved]);
      }
    } catch (err: any) {
      toast.error('Failed to send reply: ' + (err.response?.data?.error || err.message));
    }
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const formatPrice = (val: any) => {
    if (typeof val === 'number') {
      return `LKR ${val.toLocaleString()}`;
    }
    if (!val) return '';
    return String(val);
  };

  const quickReplies = [
    'Yes, this item is in stock and ready to ship!',
    'Brand new sealed unit with 2-Year official warranty.',
    'We offer islandwide delivery within 1-2 business days.',
    'Yes, you can place the order directly through the cart.'
  ];

  return (
    <div style={{ padding: '0 0 24px 0', fontFamily: 'inherit' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Customer Inquiries
            </h1>
            {totalUnread > 0 && (
              <span
                style={{
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#22d3ee',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '20px'
                }}
              >
                {totalUnread} Unanswered
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Real-time direct messaging between prospective buyers and the store owner.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#0f172a',
              border: '1px solid #1e293b',
              fontSize: '12px',
              color: isWsConnected ? '#34d399' : '#f59e0b'
            }}
          >
            <Radio size={14} />
            <span>{isWsConnected ? 'WebSocket Live' : 'Reconnecting...'}</span>
          </div>
          <button
            onClick={fetchConversations}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Refresh Inquiries"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          height: 'calc(100vh - 200px)',
          minHeight: '620px'
        }}
      >
        {/* Left Column: Sidebar Threads */}
        <div
          style={{
            width: '340px',
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {/* Search bar */}
          <div style={{ padding: '12px', borderBottom: '1px solid #1e293b', background: '#090d1a' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search
                size={14}
                style={{ position: 'absolute', left: '10px', color: '#64748b' }}
              />
              <input
                type="text"
                placeholder="Search inquiries or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 12px 8px 32px',
                  fontSize: '12px',
                  color: '#f8fafc',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Threads list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                Loading inquiries...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                No customer inquiries found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      textAlign: 'left',
                      background: isSelected ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #1e293b',
                      borderLeft: isSelected ? '4px solid #06b6d4' : '4px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: isSelected ? '#0284c7' : '#1e293b',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700,
                            flexShrink: 0
                          }}
                        >
                          {conv.customerName ? conv.customerName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: isSelected ? '#ffffff' : '#e2e8f0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {conv.customerName || conv.customerEmail}
                        </span>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span
                          style={{
                            background: '#ef4444',
                            color: '#ffffff',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '10px',
                            flexShrink: 0
                          }}
                        >
                          {conv.unreadCount} new
                        </span>
                      )}
                    </div>

                    {/* Attached product tag if exists */}
                    {conv.productName && (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '11px',
                          color: '#38bdf8',
                          background: 'rgba(6, 182, 212, 0.1)',
                          border: '1px solid rgba(6, 182, 212, 0.25)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          maxWidth: '100%',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        <Package size={12} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {conv.productName}
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                      <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                        {conv.lastMessage}
                      </p>
                      <span style={{ fontSize: '10px', color: '#64748b', flexShrink: 0 }}>
                        {conv.lastMessageTime
                          ? new Date(conv.lastMessageTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : ''}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation Workspace */}
        <div
          style={{
            flex: 1,
            background: '#090d1a',
            border: '1px solid #1e293b',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {activeConversation ? (
            <>
              {/* Conversation Top Header */}
              <div
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid #1e293b',
                  background: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '14px'
                    }}
                  >
                    {activeConversation.customerName
                      ? activeConversation.customerName.charAt(0).toUpperCase()
                      : 'U'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                      {activeConversation.customerName}{' '}
                      <span style={{ fontSize: '12px', fontWeight: 400, color: '#94a3b8' }}>
                        ({activeConversation.customerEmail})
                      </span>
                    </h3>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                      Thread #{activeConversation.id} •{' '}
                      <span style={{ color: '#34d399', fontWeight: 600 }}>Active</span>
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.25)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    color: '#22d3ee',
                    fontWeight: 600
                  }}
                >
                  <ShieldCheck size={14} />
                  <span>Replying as Store Owner</span>
                </div>
              </div>

              {/* Attached Product Card Banner */}
              {activeConversation.productName && (
                <div
                  style={{
                    background: '#020617',
                    borderBottom: '1px solid #1e293b',
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    {activeConversation.productImageUrl && (
                      <img
                        src={activeConversation.productImageUrl}
                        alt={activeConversation.productName}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid #334155',
                          flexShrink: 0
                        }}
                      />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: '#38bdf8',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}
                        >
                          Customer Asking About:
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>
                          {formatPrice(activeConversation.productPrice)}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: '2px 0 0 0',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#e2e8f0',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {activeConversation.productName}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`/search?q=${encodeURIComponent(activeConversation.productName)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      background: '#1e293b',
                      color: '#cbd5e1',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      flexShrink: 0
                    }}
                  >
                    <span>View Product</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Messages Stream */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {messages.length === 0 ? (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: '#64748b',
                      fontSize: '12px'
                    }}
                  >
                    <MessageSquare size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontWeight: 600, color: '#94a3b8' }}>No messages in this thread yet.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isAdminMsg =
                      msg.senderRole === 'ROLE_ADMIN' || msg.senderRole === 'ADMIN';

                    return (
                      <div
                        key={msg.id || Math.random()}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isAdminMsg ? 'flex-end' : 'flex-start'
                        }}
                      >
                        {/* Sender Label & Timestamp */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '4px',
                            padding: '0 4px',
                            fontSize: '10px'
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              color: isAdminMsg ? '#38bdf8' : '#cbd5e1'
                            }}
                          >
                            {isAdminMsg ? 'Store Owner (You)' : msg.senderName || 'Customer'}
                          </span>
                          <span style={{ color: '#64748b' }}>
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : ''}
                          </span>
                        </div>

                        {/* Bubble */}
                        <div
                          style={{
                            maxWidth: '75%',
                            borderRadius: isAdminMsg ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                            padding: '10px 14px',
                            fontSize: '13px',
                            lineHeight: 1.45,
                            background: isAdminMsg
                              ? 'linear-gradient(135deg, #0284c7, #2563eb)'
                              : '#1e293b',
                            color: '#ffffff',
                            border: isAdminMsg ? 'none' : '1px solid #334155',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                          }}
                        >
                          {/* 📦 EMBEDDED PRODUCT CARD BUBBLE */}
                          {msg.productName && (
                            <div
                              style={{
                                background: isAdminMsg ? 'rgba(0,0,0,0.25)' : '#0f172a',
                                border: isAdminMsg ? '1px solid rgba(255,255,255,0.2)' : '1px solid #334155',
                                borderRadius: '8px',
                                padding: '8px 10px',
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                              }}
                            >
                              {msg.productImageUrl && (
                                <img
                                  src={msg.productImageUrl}
                                  alt={msg.productName}
                                  style={{
                                    width: '40px',
                                    height: '40px',
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
                                    fontSize: '12px',
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
                                  <div
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      color: isAdminMsg ? '#bae6fd' : '#38bdf8'
                                    }}
                                  >
                                    {formatPrice(msg.productPrice)}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div style={{ wordBreak: 'break-word' }}>{msg.content}</div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Canned Replies Bar for Store Owner */}
              <div
                style={{
                  background: '#090d1a',
                  borderTop: '1px solid #1e293b',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Quick:</span>
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => setReplyText(reply)}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      color: '#cbd5e1',
                      borderRadius: '14px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Reply Input Box */}
              <form
                onSubmit={handleSendReply}
                style={{
                  padding: '12px 16px',
                  background: '#020617',
                  borderTop: '1px solid #1e293b',
                  display: 'flex',
                  gap: '10px'
                }}
              >
                <input
                  type="text"
                  placeholder={`Reply to ${activeConversation.customerName || 'customer'}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    opacity: !replyText.trim() ? 0.4 : 1
                  }}
                >
                  <span>Send Reply</span>
                  <Send size={14} />
                </button>
              </form>
            </>
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '13px'
              }}
            >
              <MessageSquare size={40} style={{ color: '#334155', marginBottom: '12px' }} />
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 6px 0' }}>
                Select a customer inquiry
              </p>
              <p style={{ margin: 0, color: '#94a3b8' }}>
                Choose an inquiry from the left to view questions and reply in real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
