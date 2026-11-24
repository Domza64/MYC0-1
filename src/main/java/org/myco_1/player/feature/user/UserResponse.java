package org.myco_1.player.feature.user;

import org.jspecify.annotations.Nullable;
import org.myco_1.player.security.MycoUserDetails;

import java.util.List;

public record UserResponse(
        Long id,
        String username,
        List<Role> roles,
        @Nullable String profilePicture
) {
    public static UserResponse from(MycoUserDetails user) {
        return new UserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getRoles().stream().toList(),
                user.getProfilePicture()
        );
    }

    public static UserResponse from(UserEntity user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRoles().stream().toList(),
                user.getProfilePicture()
        );
    }
}
