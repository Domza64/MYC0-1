package org.myco_1.player.feature.author;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AuthorRepository extends JpaRepository<AuthorEntity, Long> {

    @Query(value = """
        SELECT *
        FROM authors
        WHERE name ILIKE '%' || :query || '%'
        ORDER BY
            CASE
                WHEN name ILIKE :query || '%' THEN 0
                ELSE 1
            END
        LIMIT :limit
        """, nativeQuery = true)
    List<AuthorEntity> autocomplete(String query, int limit);
}
