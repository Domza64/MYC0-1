package org.myco_1.player.feature.song.dto;

import org.myco_1.player.feature.song.SongEntity;

public record SongResponse(
    Long id,
    String filePath,
    String fileName,
    Long fileSize
) {
    public static SongResponse from(SongEntity songEntity) {
        return new SongResponse(
                songEntity.getId(),
                songEntity.getFilePath(),
                songEntity.getFileName(),
                songEntity.getFileSize()
        );
    }
}
