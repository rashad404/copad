package com.drcopad.copad.exception;

public class CostLimitExceededException extends RuntimeException {
    public CostLimitExceededException(String message) {
        super(message);
    }
    
    public CostLimitExceededException(String message, Throwable cause) {
        super(message, cause);
    }
}