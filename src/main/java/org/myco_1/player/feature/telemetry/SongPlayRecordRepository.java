package org.myco_1.player.feature.telemetry;

import org.myco_1.player.feature.song.SongEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface SongPlayRecordRepository extends JpaRepository<SongEntity, Long> {

    @Modifying
    @Query(value = """
            INSERT INTO song_play_record (user_id, song_id, created_at)
            VALUES (:userId, :songId, NOW())
            """, nativeQuery = true)
    void addPlayRecord(Long userId, Long songId);
}
