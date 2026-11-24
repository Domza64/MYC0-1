package org.myco_1.player.feature.folder;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.feature.song.dto.SongResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/folders", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class FolderController {
    private final FolderService folderService;

    @GetMapping({"/", "/{parentId}"})
    public ResponseEntity<List<FolderResponse>> getFolders(
            @PathVariable(required = false) Long parentId
    ) {
        List<FolderResponse> data = folderService.getFolders(parentId);
        return ResponseEntity.ok(data);
    }

    @GetMapping({"/songs/", "/songs/{folderId}"})
    public ResponseEntity<List<SongResponse>> getSongs(
            @PathVariable(required = false) Long folderId
    ) {
        List<SongResponse> data = folderService.getSongs(folderId);
        return ResponseEntity.ok(data);
    }
}
