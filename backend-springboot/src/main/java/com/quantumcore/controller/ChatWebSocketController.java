package com.quantumcore.controller;

import com.quantumcore.dto.chat.ChatMessageDto;
import com.quantumcore.dto.chat.SendMessageRequest;
import com.quantumcore.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * 📡 WEBSOCKET MESSAGE CONTROLLER
 * 
 * Catches STOMP frames sent to /app/chat.send.
 * The user is authenticated via the WebSocket STOMP connect channel interceptor,
 * so Principal.getName() returns the user's email.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final ChatService chatService;

    @MessageMapping("/chat.send")
    public void handleChatMessage(@Payload SendMessageRequest request, Principal principal) {
        if (principal == null) {
            log.warn("Unauthorized WebSocket message attempt without Principal");
            return;
        }

        String userEmail = principal.getName();
        log.info("Received WebSocket chat message from {}: content='{}'", userEmail, request.getContent());
        chatService.sendMessage(userEmail, request);
    }
}
