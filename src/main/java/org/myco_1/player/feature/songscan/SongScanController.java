package org.myco_1.player.feature.songscan;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.feature.song.dto.SongResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "scan", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class SongScanController {
    private final SongScanService songScanService;

    @PostMapping("")
    public ResponseEntity<List<SongResponse>> scanLibrary() {
        songScanService.scanLocalLibrary();
        return ResponseEntity.accepted().build();
    }
}
