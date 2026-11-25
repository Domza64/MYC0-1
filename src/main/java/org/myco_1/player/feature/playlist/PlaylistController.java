package org.myco_1.player.feature.playlist;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.myco_1.player.feature.playlist.dto.AddSongsRequest;
import org.myco_1.player.feature.playlist.dto.AddSongsResponse;
import org.myco_1.player.feature.playlist.dto.PlaylistCreateRequest;
import org.myco_1.player.feature.playlist.dto.PlaylistUpdateRequest;
import org.myco_1.player.feature.song.dto.SongResponse;
import org.myco_1.player.security.MycoUserDetails;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/playlists", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class PlaylistController {
    private final PlaylistService playlistService;

    @GetMapping("")
    public ResponseEntity<List<PlaylistResponse>> getAllPlaylists(
            @AuthenticationPrincipal MycoUserDetails user
    ) {
        List<PlaylistResponse> data = playlistService.getPlaylists(user);
        return ResponseEntity.ok(data);
    }

    @PostMapping("")
    public ResponseEntity<PlaylistResponse> createPlaylist(
            @AuthenticationPrincipal MycoUserDetails user,
            @RequestBody @Valid PlaylistCreateRequest request
    ) {
        PlaylistResponse data = playlistService.createPlaylist(user, request);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/songs/{playlistId}")
    public ResponseEntity<List<SongResponse>> getPlaylistSongs(
            @AuthenticationPrincipal MycoUserDetails user,
            @PathVariable Long playlistId
    ) {
        List<SongResponse> data = playlistService.getSongs(user, playlistId);
        return ResponseEntity.ok(data);
    }

    @PostMapping("/songs/{playlistId}")
    public ResponseEntity<AddSongsResponse> addSongsToPlaylist(
            @AuthenticationPrincipal MycoUserDetails user,
            @RequestBody @Valid AddSongsRequest request,
            @PathVariable Long playlistId
    ) {
        AddSongsResponse data = playlistService.addSongs(user, playlistId, request);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/{playlistId}")
    public ResponseEntity<PlaylistResponse> getPlaylist(
            @AuthenticationPrincipal MycoUserDetails user,
            @PathVariable Long playlistId
    ) {
        PlaylistResponse data = playlistService.getPlaylist(user, playlistId);
        return ResponseEntity.ok(data);
    }

    @PatchMapping("/{playlistId}")
    public ResponseEntity<PlaylistResponse> updatePlaylist(
            @AuthenticationPrincipal MycoUserDetails user,
            @PathVariable Long playlistId,
            @RequestBody @Valid PlaylistUpdateRequest request
    ) {
        PlaylistResponse data = playlistService.updatePlaylist(user, playlistId, request);
        return ResponseEntity.ok(data);
    }

    @DeleteMapping("/{playlistId}/{songId}")
    public ResponseEntity<PlaylistResponse> removePlaylistSong(
            @AuthenticationPrincipal MycoUserDetails user,
            @PathVariable Long playlistId,
            @PathVariable Long songId
    ) {
        playlistService.removeSong(user, playlistId, songId);
        return ResponseEntity.noContent().build();
    }


    @DeleteMapping("/{playlistId}")
    public ResponseEntity<PlaylistResponse> deletePlaylist(
            @AuthenticationPrincipal MycoUserDetails user,
            @PathVariable Long playlistId
    ) {
        playlistService.deletePlaylist(user, playlistId);
        return ResponseEntity.noContent().build();
    }
}
