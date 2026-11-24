package org.myco_1.player.feature.album;

import org.jspecify.annotations.NullMarked;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

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
}
