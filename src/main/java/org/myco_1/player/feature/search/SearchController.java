package org.myco_1.player.feature.search;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/search", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    @GetMapping("")
    public ResponseEntity<SearchResponse> getSongs(
            @RequestParam String query
    ) {
        SearchResponse data = searchService.search(query);
        return ResponseEntity.ok(data);
    }
}
