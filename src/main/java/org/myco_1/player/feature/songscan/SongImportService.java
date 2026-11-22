package org.myco_1.player.feature.songscan;

import lombok.extern.slf4j.Slf4j;
import org.myco_1.player.feature.song.SongEntity;
import org.myco_1.player.feature.song.SongRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
@Slf4j
public class SongImportService {
    private final SongRepository songRepository;
    private final Path musicDirectory;

    public SongImportService(
            SongRepository songRepository,
            @Value("${app.music.directory}") String directory
    ) {
        this.songRepository = songRepository;
        this.musicDirectory = Path.of(directory);
    }

    @Async
    protected void startImport() {
        List<SongEntity> songs = new ArrayList<>();

        List<File> files;
        try {
            files = getMusicFiles();
        } catch (IOException ex) {
            log.error("Error scanning music library", ex);
            throw new RuntimeException("Error reading files. TODO: throw some appropriate error and implement global error handler.");
        }

        log.debug("Processing {} files", files.size());
        for (File file : files) {
            String relativePath = musicDirectory.relativize(file.toPath()).toString();
            songs.add(new SongEntity(
                    relativePath,
                    file.getName(),
                    file.length(),
                    null
            ));
        }

        songRepository.deleteAll(); // :)
        songRepository.saveAll(songs);
    }

    private List<File> getMusicFiles() throws IOException {
        try (Stream<Path> files = Files.walk(musicDirectory)) {
            return files
                    .filter(Files::isRegularFile)
                    .map(Path::toFile)
                    .toList();
        }
    }
}
