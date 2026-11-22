package org.myco_1.player.feature.user;

import org.myco_1.player.security.MycoUserDetails;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/users", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {

    @GetMapping("me")
    public ResponseEntity<UserResponse> getUser(@AuthenticationPrincipal MycoUserDetails user) {
        return ResponseEntity.ok(UserResponse.from(user));
    }
}
