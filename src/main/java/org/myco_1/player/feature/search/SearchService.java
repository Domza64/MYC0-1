package org.myco_1.player.feature.search;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.feature.album.AlbumRepository;
import org.myco_1.player.feature.album.dto.SimpleAlbumView;
import org.myco_1.player.feature.author.AuthorRepository;
import org.myco_1.player.feature.author.AuthorResponse;
import org.myco_1.player.feature.song.SongRepository;
import org.myco_1.player.feature.song.dto.SimpleSongView;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final SongRepository songRepository;
    private final AuthorRepository authorRepository;
    private final AlbumRepository albumRepository;

    public SearchResponse search(String query) {
        List<SimpleSongView> songs = songRepository.autocomplete(query, 10);
        List<AuthorResponse> authors = authorRepository.autocomplete(query, 5)
                .stream()
                .map(AuthorResponse::from)
                .toList();
        List<SimpleAlbumView> albums = albumRepository.autocomplete(query, 5);

        return new SearchResponse(
                songs,
                authors,
                albums
        );
    }
}
