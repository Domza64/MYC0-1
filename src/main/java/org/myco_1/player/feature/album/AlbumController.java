package org.myco_1.player.feature.album;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.feature.album.dto.AlbumResponse;
import org.myco_1.player.feature.song.dto.SongResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/albums", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class AlbumController {
    private final AlbumService albumService;

    @GetMapping("")
    public ResponseEntity<List<AlbumResponse>> getAlbums() {
        List<AlbumResponse> data = albumService.getAlbums();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/{albumId}/songs")
    public ResponseEntity<List<SongResponse>> getAlbumSongs(
            @PathVariable Long albumId
    ) {
        List<SongResponse> data = albumService.getAlbumSongs(albumId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/{albumId}")
    public ResponseEntity<AlbumResponse> getAlbum(
            @PathVariable Long albumId
    ) {
        AlbumResponse data = albumService.getAlbum(albumId);
        return ResponseEntity.ok(data);
    }
}
