package org.myco_1.player.feature.song;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.feature.song.dto.SongResponse;
import org.myco_1.player.security.MycoUserDetails;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/songs", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class SongController {
    private final SongService songService;

    @GetMapping("")
    public ResponseEntity<List<SongResponse>> getSongs(Pageable pageable) {
        List<SongResponse> data = songService.getSongs(pageable);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/history")
    public ResponseEntity<List<SongResponse>> getPlayHistory(
            @AuthenticationPrincipal MycoUserDetails user,
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<SongResponse> data = songService.getPlayHistory(user.getUserId(), limit);
        return ResponseEntity.ok(data);
    }
}
