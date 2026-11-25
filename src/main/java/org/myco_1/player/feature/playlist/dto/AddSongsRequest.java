package org.myco_1.player.feature.playlist.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record AddSongsRequest(
        @NotEmpty(message = "At least one song ID must be provided.")
        List<
                @NotNull(message = "Song ID cannot be null.")
                @Positive(message = "Song ID must be a positive number.")
                        Long
                > songIds
) {
}
