package org.myco_1.player.exception;

import java.time.Instant;

public record ErrorResponse(
        int httpStatus,
        String message,
        String apiPath,
        String code,
        Instant timestamp
) {
}
