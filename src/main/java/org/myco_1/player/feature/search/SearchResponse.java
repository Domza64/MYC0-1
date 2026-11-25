package org.myco_1.player.feature.search;

import org.myco_1.player.feature.album.dto.SimpleAlbumView;
import org.myco_1.player.feature.author.AuthorResponse;
import org.myco_1.player.feature.song.dto.SimpleSongView;

import java.util.List;

public record SearchResponse(
        List<SimpleSongView> matchedSongs,
        List<AuthorResponse> matchedAuthors,
        List<SimpleAlbumView> matchedAlbums
) {
}
