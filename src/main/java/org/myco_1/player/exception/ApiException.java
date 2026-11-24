package org.myco_1.player.exception;

import lombok.Getter;
import org.jspecify.annotations.Nullable;
import org.springframework.http.HttpStatus;

@Getter
public class ApiException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String code;
    private final boolean logError;

    public ApiException(
            String message,
            @Nullable Exception cause,
            HttpStatus httpStatus,
            String code,
            boolean logError
    ) {
        super(message, cause);
        this.httpStatus = httpStatus;
        this.code = code;
        this.logError = logError;
    }
}
