package org.myco_1.player.feature.song;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.feature.song.dto.SongResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SongService {
    private final SongRepository songRepository;

    public List<SongResponse> getSongs() {
        return songRepository.findAll()
                .stream()
                .map(SongResponse::fromEntity)
                .toList();
    }
}
