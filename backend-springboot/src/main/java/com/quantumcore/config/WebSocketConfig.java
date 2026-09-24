package com.quantumcore.config;

import com.quantumcore.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;

/**
 * 🌐 WEBSOCKET & STOMP CONFIGURATION
 * 
 * Enables real-time bi-directional messaging between the Frontend and Backend.
 * 
 * Channels:
 * - /topic/admin/chat: Broadcast channel for Store Owner / Admin to receive all customer inquiries.
 * - /user/{email}/queue/chat: Dedicated private queue for each customer to receive admin replies.
 * - /app/chat.send: Application destination where clients publish new chat messages.
 */
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the WebSocket handshake endpoint with SockJS fallback support
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        // Also allow pure WebSocket connections without SockJS
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Enable a simple in-memory message broker to carry messages to clients
        // /topic: for broadcasts (e.g. all Admins listening for incoming customer questions)
        // /queue: for point-to-point private messaging to a specific user
        registry.enableSimpleBroker("/topic", "/queue");

        // Prefix for messages bound for @MessageMapping annotated methods in controllers
        registry.setApplicationDestinationPrefixes("/app");

        // Prefix used by SimpMessagingTemplate.convertAndSendToUser()
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    List<String> authHeaders = accessor.getNativeHeader("Authorization");
                    if (authHeaders != null && !authHeaders.isEmpty()) {
                        String authHeader = authHeaders.get(0);
                        if (authHeader != null && authHeader.startsWith("Bearer ")) {
                            String token = authHeader.substring(7);
                            try {
                                String email = jwtUtils.extractEmail(token);
                                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                                if (jwtUtils.validateToken(token, userDetails)) {
                                    UsernamePasswordAuthenticationToken auth =
                                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                                    accessor.setUser(auth);
                                    log.info("WebSocket user authenticated: {} with authorities {}", email, userDetails.getAuthorities());
                                }
                            } catch (Exception e) {
                                log.error("Failed to authenticate WebSocket user from JWT: {}", e.getMessage());
                            }
                        }
                    }
                }
                return message;
            }
        });
    }
}
