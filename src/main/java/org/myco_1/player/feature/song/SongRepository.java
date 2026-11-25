package org.myco_1.player.feature.song;

import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface SongRepository extends JpaRepository<SongEntity, Long> {
    List<SongEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<SongEntity> findByFolderId(@Nullable Long folderId);

    @Query(value = """
            SELECT s.*
            FROM songs s
            JOIN authors_songs aus ON s.id = aus.song_id
            WHERE aus.author_id = :authorId
            """, nativeQuery = true)
    List<SongEntity> findByAuthor(Long authorId);

    @Query(value = """
            SELECT s.*
            FROM songs s
            JOIN albums_songs als ON s.id = als.song_id
            WHERE als.album_id = :albumId
            """, nativeQuery = true)
    List<SongEntity> findByAlbum(Long albumId);

    @Query(value = """
            SELECT s.*
            FROM songs s
            JOIN playlists_songs pls ON s.id = pls.song_id
            WHERE pls.playlist_id = :playlistId
            """, nativeQuery = true)
    List<SongEntity> findByPlaylist(Long playlistId);

    @Query(value = """
            SELECT s.*
            FROM songs s
            JOIN song_play_record spr on s.id = spr.song_id
            WHERE spr.user_id = :userId
            ORDER BY created_at DESC
            LIMIT :limit
    """, nativeQuery = true)
    Collection<SongEntity> findByPlayHistory(Long userId, int limit);
}
