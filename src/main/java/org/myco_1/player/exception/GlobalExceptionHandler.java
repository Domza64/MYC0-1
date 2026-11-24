package org.myco_1.player.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.Instant;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiExceptions(
            ApiException ex,
            WebRequest request
    ) {
        String path = getPath(request);
        if (ex.isLogError()) log.info("{}, path = {}", ex.getMessage(), path);

        return ResponseEntity
                .status(ex.getHttpStatus())
                .body(new ErrorResponse(
                        ex.getHttpStatus().value(),
                        ex.getMessage(),
                        path,
                        ex.getCode(),
                        Instant.now()
                ));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            NoResourceFoundException ex,
            WebRequest request
    ) {
        String path = getPath(request);
        log.warn(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(
                        HttpStatus.NOT_FOUND.value(),
                        ex.getMessage(),
                        path,
                        "NOT_FOUND",
                        Instant.now()
                ));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(
            MethodArgumentTypeMismatchException ex,
            WebRequest request
    ) {
        String path = getPath(request);
        log.warn(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(
                        HttpStatus.BAD_REQUEST.value(),
                        ex.getMessage(),
                        path,
                        "BAD_REQUEST",
                        Instant.now()
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(
            Exception ex,
            WebRequest request
    ) {
        String path = getPath(request);
        log.error("Error at '{}'", path, ex);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        ex.getMessage(),
                        path,
                        "INTERNAL_SERVER_ERROR",
                        Instant.now()
                ));
    }

    private String getPath(WebRequest request) {
        return request.getDescription(false).replace("uri=", "");
    }
}
