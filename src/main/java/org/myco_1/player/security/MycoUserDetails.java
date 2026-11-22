package org.myco_1.player.security;

import lombok.Getter;
import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;
import org.myco_1.player.feature.user.Role;
import org.myco_1.player.feature.user.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;

@Getter
public class MycoUserDetails implements UserDetails {
    private final Long userId;
    private final String username;
    private final String password;
    private final @Nullable String profilePicture;
    private final Set<Role> roles;

    public MycoUserDetails(UserEntity user) {
        this.userId = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.profilePicture = user.getProfilePicture();
        this.roles = user.getRoles();
    }

    @Override
    @NullMarked
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .toList();
    }
}
