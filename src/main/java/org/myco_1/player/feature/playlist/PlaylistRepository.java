package org.myco_1.player.feature.playlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PlaylistRepository extends JpaRepository<PlaylistEntity, Long> {
    List<PlaylistEntity> findAllByUserId(Long userId);

    @Modifying
    @Query(value = """
        INSERT INTO playlists_songs (playlist_id, song_id, position)
        SELECT
            :playlistId,
            s.id,
            COALESCE(
                (SELECT MAX(position)
                 FROM playlists_songs
                 WHERE playlist_id = :playlistId),
                -1
            ) + ROW_NUMBER() OVER (ORDER BY s.id)
        FROM songs s
        WHERE s.id IN (:songIds)
        ON CONFLICT (playlist_id, song_id) DO NOTHING
        RETURNING song_id AS "songId"
        """, nativeQuery = true)
    List<InsertedSongView> addSongsToPlaylist(Long playlistId, List<Long> songIds);

    @Modifying
    @Query(value = """
        DELETE FROM playlists_songs
            WHERE playlist_id = :playlistId
            AND song_id = :songId
    """, nativeQuery = true)
    Long removeSong(Long playlistId, Long songId);
}
