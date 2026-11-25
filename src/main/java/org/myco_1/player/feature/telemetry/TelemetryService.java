package org.myco_1.player.feature.telemetry;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TelemetryService {
    private final SongPlayRecordRepository songPlayRecordRepository;

    @Transactional
    public void addPlayRecord(Long songId, Long userId) {
        songPlayRecordRepository.addPlayRecord(userId, songId);
    }
}
