package org.myco_1.player.feature.user;

import jakarta.validation.constraints.*;

public record CreateUserRequest(
        @NotBlank(message = "Username is required.")
        @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters.")
        @Pattern(
                regexp = "^[a-zA-Z0-9_-]+$",
                message = "Username can only contain letters, numbers, underscores and hyphens."
        )
        String username,

        @NotNull(message = "Role must be specified.")
        Role role,

        @NotBlank(message = "Password is required.")
        @Size(min = 12, max = 128, message = "Password must be between 12 and 128 characters.")
        String password
) {
}
