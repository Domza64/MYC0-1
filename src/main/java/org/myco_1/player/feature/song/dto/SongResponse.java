package org.myco_1.player.feature.song.dto;

import org.jspecify.annotations.Nullable;
import org.myco_1.player.feature.song.SongEntity;

import java.util.List;

public record SongResponse(
    Long id,
    @Nullable String title,
    List<String> genres,
    @Nullable Integer year,
    @Nullable String image,
    @Nullable Integer duration,
    String filePath,
    String fileName,
    Long fileSize
) {
    public static SongResponse from(SongEntity songEntity) {
        return new SongResponse(
                songEntity.getId(),
                songEntity.getTitle(),
                songEntity.getGenres(),
                songEntity.getYear(),
                songEntity.getImage(),
                songEntity.getDuration(),
                songEntity.getFilePath(),
                songEntity.getFileName(),
                songEntity.getFileSize()
        );
    }
}
