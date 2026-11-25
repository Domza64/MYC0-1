package org.myco_1.player.feature.song;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.feature.song.dto.SongResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SongService {
    private final SongRepository songRepository;

    public List<SongResponse> getSongs(Pageable pageable) {
        return songRepository.findAllByOrderByCreatedAtDesc(pageable)
                .stream()
                .map(SongResponse::from)
                .toList();
    }

    public List<SongResponse> getPlayHistory(Long userId, int limit) {
        return songRepository.findByPlayHistory(userId, limit)
                .stream()
                .map(SongResponse::from)
                .toList();
    }
}
