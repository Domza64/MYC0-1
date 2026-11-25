package org.myco_1.player.feature.playlist.dto;

import jakarta.validation.constraints.Size;

public record PlaylistUpdateRequest(
        @Size(min = 1, max = 100, message = "Playlist name must be between 1 and 100 characters.")
        String name,

        @Size(max = 1000, message = "Playlist description cannot exceed 1000 characters.")
        String description,

        Boolean shared
) {
    public boolean atLeastOneFieldNotNull() {
        return name != null || description != null || shared != null;
    }
}
