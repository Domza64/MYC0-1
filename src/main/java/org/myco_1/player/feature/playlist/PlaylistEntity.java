package org.myco_1.player.feature.playlist;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.myco_1.player.feature.user.UserEntity;

import java.time.Instant;

@Entity
@Table(name = "playlists")
@Getter
@NoArgsConstructor
public class PlaylistEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Setter
    private String name;

    @Setter
    private String description;

    @Column(nullable = false)
    @Setter
    private boolean shared;

    private String image;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    @Setter
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    public PlaylistEntity(String name, String description, boolean shared, UserEntity user) {
        Instant now = Instant.now();
        this.name = name;
        this.description = description;
        this.shared = shared;
        this.user = user;
        this.createdAt = now;
        this.updatedAt = now;
    }
}
