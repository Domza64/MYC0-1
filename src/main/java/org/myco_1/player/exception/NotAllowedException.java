package org.myco_1.player.exception;

import org.jspecify.annotations.Nullable;
import org.springframework.http.HttpStatus;

public class NotAllowedException extends ApiException {
    public NotAllowedException(String message, @Nullable Exception cause, boolean logError) {
        super(message, cause, HttpStatus.FORBIDDEN, "FORBIDDEN", logError);
    }

    public NotAllowedException(String message) {
        this(message, null, true);
    }
}
