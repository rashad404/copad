package com.drcopad.copad.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class CustomErrorHandler {

    @ExceptionHandler(NoHandlerFoundException.class)
    public String handle404Error() {
        return "error-404"; // Create error-404.html in templates
    }
}
