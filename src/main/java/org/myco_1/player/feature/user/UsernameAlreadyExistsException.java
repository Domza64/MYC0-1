package org.myco_1.player.feature.user;

import org.myco_1.player.exception.ApiException;
import org.springframework.http.HttpStatus;

public class UsernameAlreadyExistsException extends ApiException {
    public UsernameAlreadyExistsException(String message) {
        super(message, null, HttpStatus.CONFLICT, "USERNAME_EXISTS", true);
    }
}
