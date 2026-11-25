package org.myco_1.player.feature.song.dto;

import org.jspecify.annotations.Nullable;

public interface SimpleSongView {
    Long getId();
    @Nullable String getTitle();
    String getFileName();
    String getImage();
}
