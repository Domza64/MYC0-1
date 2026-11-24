package org.myco_1.player.feature.playlist.dto;

// TODO: Validation, also everythings optional
public record PlaylistUpdateRequest(
        String name,
        String description, // not required
        boolean shared
) {
}
