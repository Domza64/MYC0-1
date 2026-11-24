package org.myco_1.player.feature.playlist.dto;

// TODO: Validation
public record PlaylistCreateRequest(
        String name,
        String description, // not required
        Boolean shared
) {
    public boolean atLeastOneFieldNotNull() {
        return name != null || description != null || shared != null;
    }
}
