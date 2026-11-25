package org.myco_1.player.feature.playlist;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.exception.NotAllowedException;
import org.myco_1.player.exception.ResourceNotFoundException;
import org.myco_1.player.feature.playlist.dto.AddSongsRequest;
import org.myco_1.player.feature.playlist.dto.AddSongsResponse;
import org.myco_1.player.feature.playlist.dto.PlaylistCreateRequest;
import org.myco_1.player.feature.playlist.dto.PlaylistUpdateRequest;
import org.myco_1.player.feature.song.SongRepository;
import org.myco_1.player.feature.song.dto.SongResponse;
import org.myco_1.player.feature.user.UserEntity;
import org.myco_1.player.feature.user.UserService;
import org.myco_1.player.security.MycoUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final UserService userService;
    private final SongRepository songRepository;

    public List<PlaylistResponse> getPlaylists(MycoUserDetails user) {
        return playlistRepository.findAllByUserId(user.getUserId())
                .stream()
                .map(PlaylistResponse::from)
                .toList();
    }

    public PlaylistResponse createPlaylist(MycoUserDetails user, PlaylistCreateRequest request) {
        UserEntity userEntity = userService.getUser(user.getUserId());
        PlaylistEntity newPlaylist = playlistRepository.save(new PlaylistEntity(
                request.name(),
                request.description(),
                request.shared(),
                userEntity
        ));

        return PlaylistResponse.from(newPlaylist);
    }

    public List<SongResponse> getSongs(MycoUserDetails user, Long playlistId) {
        PlaylistEntity playlist = getPlaylistEntity(playlistId);
        checkPlaylistAccess(user, playlist);

        return songRepository.findByPlaylist(playlistId)
                .stream()
                .map(SongResponse::from)
                .toList();
    }

    @Transactional
    public AddSongsResponse addSongs(MycoUserDetails user, Long playlistId, AddSongsRequest request) {
        checkPlaylistAccess(user, getPlaylistEntity(playlistId));

        List<InsertedSongView> ids = playlistRepository.addSongsToPlaylist(playlistId, request.songIds());

        return new AddSongsResponse(ids.size());
    }

    public PlaylistResponse getPlaylist(MycoUserDetails user, Long playlistId) {
        PlaylistEntity playlist = getPlaylistEntity(playlistId);
        checkPlaylistAccess(user, playlist);

        return PlaylistResponse.from(playlist);
    }

    public PlaylistResponse updatePlaylist(MycoUserDetails user, Long playlistId, PlaylistUpdateRequest request) {
        PlaylistEntity playlist = getPlaylistEntity(playlistId);
        checkPlaylistAccess(user, playlist);

        if (request.name() != null) playlist.setName(request.name());
        if (request.description() != null) playlist.setDescription(request.description());
        if (request.shared() != null) playlist.setShared(request.shared());
        if (request.atLeastOneFieldNotNull()) playlist.setUpdatedAt(Instant.now());

        return PlaylistResponse.from(playlistRepository.save(playlist));
    }

    @Transactional
    public void removeSong(MycoUserDetails user, Long playlistId, Long songId) {
        checkPlaylistAccess(user, getPlaylistEntity(playlistId));

        Long removed = playlistRepository.removeSong(playlistId, songId);
        if (removed == 0) {
            throw new ResourceNotFoundException("Song %s not in playlist %s".formatted(songId, playlistId));
        }
    }

    public void deletePlaylist(MycoUserDetails user, Long playlistId) {
        PlaylistEntity playlist = getPlaylistEntity(playlistId);
        checkPlaylistAccess(user, playlist);

        playlistRepository.deleteById(playlistId);
    }

    private PlaylistEntity getPlaylistEntity(Long playlistId) {
        return playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist %s not found".formatted(playlistId)));
    }

    private void checkPlaylistAccess(MycoUserDetails user, PlaylistEntity playlist) {
        if (!playlist.isShared() && !Objects.equals(playlist.getUser().getId(), user.getUserId())) {
            throw new NotAllowedException("You are not allowed to access this playlist.");
        }
    }
}
