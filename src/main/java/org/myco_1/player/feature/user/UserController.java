package org.myco_1.player.feature.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.myco_1.player.security.MycoUserDetails;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/users", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getUser(@AuthenticationPrincipal MycoUserDetails user) {
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @GetMapping("")
    public ResponseEntity<List<UserResponse>> getUsers() {
        List<UserResponse> data = userService.getUsers();
        return ResponseEntity.ok(data);
    }

    @PostMapping("")
    public ResponseEntity<UserResponse> createUser(
            @RequestBody @Valid CreateUserRequest createUserRequest
    ) {
        UserResponse data = userService.createUser(createUserRequest);
        return ResponseEntity.ok(data);
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUser(
            @AuthenticationPrincipal MycoUserDetails currentUser,
            @PathVariable Long userId,
            @RequestBody @Valid UpdateUserRequest updateUserRequest
    ) {
        UserResponse data = userService.updateUser(currentUser, userId, updateUserRequest);
        return ResponseEntity.ok(data);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
            @AuthenticationPrincipal MycoUserDetails currentUser,
            @PathVariable Long userId
    ) {
        userService.deleteUser(currentUser, userId);
        return ResponseEntity.noContent().build();
    }
}
