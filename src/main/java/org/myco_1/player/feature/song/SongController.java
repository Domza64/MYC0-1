package org.myco_1.player.feature.song;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.feature.song.dto.SongResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "song", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class SongController {
    private final SongService songService;

    @GetMapping("")
    public ResponseEntity<List<SongResponse>> getSongs() {
        List<SongResponse> data = songService.getSongs();
        return ResponseEntity.ok(data);
    }
}
