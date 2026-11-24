package org.myco_1.player.feature.album.dto;

import org.jspecify.annotations.Nullable;
import org.myco_1.player.feature.album.AlbumEntity;
import org.myco_1.player.feature.author.AuthorResponse;

import java.util.List;

public record AlbumResponse(
        Long id,
        String title,
        List<AuthorResponse> authors,
        @Nullable String cover
) {
    public static AlbumResponse from(AlbumEntity album) {
        return new AlbumResponse(
                album.getId(),
                album.getTitle(),
                album.getAuthors()
                        .stream()
                        .map(AuthorResponse::from)
                        .toList(),
                album.getCover()
        );
    }
}
