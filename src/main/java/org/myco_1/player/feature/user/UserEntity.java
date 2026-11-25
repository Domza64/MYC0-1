package org.myco_1.player.feature.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jspecify.annotations.Nullable;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Setter
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Setter
    private Role role;

    @Column(nullable = false)
    @Setter
    private String password;

    @Nullable
    private String profilePicture;

    public UserEntity(String username, Role role, String password) {
        this.username = username;
        this.role = role;
        this.password = password;
        profilePicture = null;
    }
}
