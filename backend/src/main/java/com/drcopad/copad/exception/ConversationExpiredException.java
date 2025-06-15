package com.drcopad.copad.exception;

public class ConversationExpiredException extends RuntimeException {
    public ConversationExpiredException(String message) {
        super(message);
    }
    
    public ConversationExpiredException(String message, Throwable cause) {
        super(message, cause);
    }
}