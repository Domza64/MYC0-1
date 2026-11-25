package org.myco_1.player.feature.telemetry;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.feature.song.dto.SongResponse;
import org.myco_1.player.security.MycoUserDetails;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/telemetry", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class TelemetryController {

    private final TelemetryService telemetryService;

    @PostMapping("/play-song/{songId}")
    public ResponseEntity<List<SongResponse>> getSongs(
            @AuthenticationPrincipal MycoUserDetails currentUser,
            @PathVariable Long songId
    ) {
        telemetryService.addPlayRecord(songId, currentUser.getUserId());
        return ResponseEntity.accepted().build();
    }
}
