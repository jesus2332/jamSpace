package com.mc.rehearsal_rooms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidDateTimeRangeException extends RuntimeException{
    public InvalidDateTimeRangeException(String message) {
        super(message);
    }
}
