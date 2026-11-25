package org.myco_1.player.feature.album;

import org.jspecify.annotations.NullMarked;
import org.myco_1.player.feature.album.dto.SimpleAlbumView;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AlbumRepository extends JpaRepository<AlbumEntity, Long> {

    @Override
    @NullMarked
    @EntityGraph(attributePaths = "authors")
    List<AlbumEntity> findAll();

    @Override
    @NullMarked
    @EntityGraph(attributePaths = "authors")
    Optional<AlbumEntity> findById(Long id);

    @Query(value = """
        SELECT *
        FROM albums
        WHERE title ILIKE '%' || :query || '%'
        ORDER BY
            CASE
                WHEN title ILIKE :query || '%' THEN 0
                ELSE 1
            END
        LIMIT :limit
        """, nativeQuery = true)
    List<SimpleAlbumView> autocomplete(String query, int limit);
}
