package org.myco_1.player.feature.author;

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
@RequestMapping(path = "api/authors", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class AuthorController {
    private final AuthorService authorService;

    @GetMapping("")
    public ResponseEntity<List<AuthorResponse>> getAuthors() {
        List<AuthorResponse> data = authorService.getAuthors();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/{authorId}/songs")
    public ResponseEntity<List<SongResponse>> getAuthorSongs(
            @PathVariable Long authorId
    ) {
        List<SongResponse> data = authorService.getAuthorSongs(authorId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/{authorId}")
    public ResponseEntity<AuthorResponse> getAuthor(
            @PathVariable Long authorId
    ) {
        AuthorResponse data = authorService.getAuthor(authorId);
        return ResponseEntity.ok(data);
    }
}
