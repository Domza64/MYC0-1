package org.myco_1.player.feature.playlist;

import org.myco_1.player.feature.user.UserResponse;

import java.time.Instant;

public record PlaylistResponse(
        Long id,
        String name,
        String description,
        boolean shared,
        Instant updatedAt,
        Instant createdAt,
        String playlistImage,
        UserResponse creator
) {
    public static PlaylistResponse from(PlaylistEntity playlistEntity) {
        return new PlaylistResponse(
                playlistEntity.getId(),
                playlistEntity.getName(),
                playlistEntity.getDescription(),
                playlistEntity.isShared(),
                playlistEntity.getUpdatedAt(),
                playlistEntity.getCreatedAt(),
                playlistEntity.getImage(),
                UserResponse.from(playlistEntity.getUser())
        );
    }
}
