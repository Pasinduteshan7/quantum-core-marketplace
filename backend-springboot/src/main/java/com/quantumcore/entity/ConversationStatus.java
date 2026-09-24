package com.quantumcore.entity;

/**
 * Status of a customer-admin conversation.
 * OPEN: Active conversation, awaiting reply or currently in progress.
 * RESOLVED: Issue or question has been answered and closed by the store owner/admin.
 */
public enum ConversationStatus {
    OPEN,
    RESOLVED
}
