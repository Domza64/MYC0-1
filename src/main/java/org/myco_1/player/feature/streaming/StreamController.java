package org.myco_1.player.feature.streaming;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/music")
public class StreamController {
    private final Path musicDirectory;

    public StreamController(
            @Value("${app.music.directory}") String directory
    ) {
        this.musicDirectory = Path.of(directory).toAbsolutePath().normalize();
    }

    // Temp for testing, validate path, prevent path traversals, validate media files, throw appropriate errors...
    @GetMapping("/{*path}")
    public ResponseEntity<Resource> getFile(
            @PathVariable String path
    ) {
        String relativePath = path.replaceFirst("^/", "");
        Path file = musicDirectory.resolve(relativePath).normalize();

        try {
            Resource resource = new UrlResource(file.toUri());

            String contentType = Files.probeContentType(file);
            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .contentLength(Files.size(file))
                    .body(resource);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}