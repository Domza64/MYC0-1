package org.myco_1.player.feature.playlist.dto;

import java.util.List;

// TODO: Validation
public record AddSongsRequest(
        List<Long> songIds
) {
}
