package org.myco_1.player.feature.song;

import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SongRepository extends JpaRepository<SongEntity, Long> {
    List<SongEntity> findByFolderId(@Nullable Long folderId);

    @Query(value = """
            SELECT s.*
            FROM songs s
            JOIN authors_songs aus ON s.id = aus.song_id
            WHERE aus.author_id = :authorId
            """, nativeQuery = true)
    List<SongEntity> findByAuthor(Long authorId);
}
