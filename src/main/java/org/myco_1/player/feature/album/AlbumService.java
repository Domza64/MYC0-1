package org.myco_1.player.feature.album;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.exception.ResourceNotFoundException;
import org.myco_1.player.feature.album.dto.AlbumResponse;
import org.myco_1.player.feature.song.SongRepository;
import org.myco_1.player.feature.song.dto.SongResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final SongRepository songRepository;
    
    public List<AlbumResponse> getAlbums() {
        return albumRepository.findAll()
                .stream()
                .map(AlbumResponse::from)
                .toList();
    }

    public List<SongResponse> getAlbumSongs(Long albumId) {
        getAlbumEntity(albumId); // Throws error if album doesn't exist

        return songRepository.findByAlbum(albumId)
                .stream()
                .map(SongResponse::from)
                .toList();
    }

    public AlbumResponse getAlbum(Long albumId) {
        return AlbumResponse.from(getAlbumEntity(albumId));
    }

    private AlbumEntity getAlbumEntity(Long albumId) {
        return albumRepository.findById(albumId)
                .orElseThrow(() -> new ResourceNotFoundException("Album %s not found.".formatted(albumId)));
    }
}
