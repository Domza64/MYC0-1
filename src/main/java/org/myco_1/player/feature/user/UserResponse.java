package org.myco_1.player.feature.user;

import org.jspecify.annotations.Nullable;
import org.myco_1.player.security.MycoUserDetails;

public record UserResponse(
        Long id,
        String username,
        Role role,
        @Nullable String profilePicture
) {
    public static UserResponse from(MycoUserDetails user) {
        return new UserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getRole(),
                user.getProfilePicture()
        );
    }

    public static UserResponse from(UserEntity user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.getProfilePicture()
        );
    }
}
