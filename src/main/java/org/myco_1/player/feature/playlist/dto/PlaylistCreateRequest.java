package org.myco_1.player.feature.playlist.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PlaylistCreateRequest(
        @NotBlank(message = "Playlist name is required.")
        @Size(max = 100, message = "Playlist name cannot exceed 100 characters.")
        String name,

        @Size(max = 1000, message = "Playlist description cannot exceed 1000 characters.")
        String description,

        Boolean shared
) {
}
