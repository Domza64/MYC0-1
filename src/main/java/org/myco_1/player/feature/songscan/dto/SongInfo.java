package org.myco_1.player.feature.songscan.dto;

import java.util.List;

public record SongInfo(
    String title,
    List<String> genres,
    Integer year,
    Integer duration,
    List<String> artists,
    List<String> albums
) {
}
