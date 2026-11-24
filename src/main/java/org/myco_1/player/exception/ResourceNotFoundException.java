package org.myco_1.player.exception;

import org.jspecify.annotations.Nullable;
import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String message, @Nullable Exception cause, boolean logError) {
        super(message, cause, HttpStatus.NOT_FOUND, "NOT_FOUND", logError);
    }

    public ResourceNotFoundException(String message) {
        this(message, null, true);
    }
}
