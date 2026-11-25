package org.myco_1.player.feature.songscan;

import lombok.extern.slf4j.Slf4j;
import org.myco_1.player.feature.album.AlbumEntity;
import org.myco_1.player.feature.album.AlbumRepository;
import org.myco_1.player.feature.author.AuthorEntity;
import org.myco_1.player.feature.author.AuthorRepository;
import org.myco_1.player.feature.folder.FolderRepository;
import org.myco_1.player.feature.song.SongEntity;
import org.myco_1.player.feature.song.SongRepository;
import org.myco_1.player.feature.songscan.dto.SongInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.*;
import java.util.stream.Stream;

@Service
@Slf4j
public class SongImportService {
    private final SongRepository songRepository;
    private final Path musicDirectory;
    private final SongParserService songParserService;
    private final AuthorRepository authorRepository;
    private final AlbumRepository albumRepository;
    private final FolderRepository folderRepository;

    public SongImportService(
            SongRepository songRepository,
            @Value("${app.music.directory}") String directory,
            SongParserService songParserService, AuthorRepository authorRepository, AlbumRepository albumRepository, FolderRepository folderRepository) {
        this.songRepository = songRepository;
        this.musicDirectory = Path.of(directory);
        this.songParserService = songParserService;
        this.authorRepository = authorRepository;
        this.albumRepository = albumRepository;
        this.folderRepository = folderRepository;
    }

    @Async
    @Transactional
    // Of course, this is just mock for testing. Real import needs to be much more complicated, compare what exists, what needs to be updated or created...
    protected void startImport() {
        Instant now = Instant.now();
        List<SongEntity> songs = new ArrayList<>();
        Set<String> authors = new HashSet<>();
        Set<String> albums = new HashSet<>();
        List<File> files;
        try {
            files = getMusicFiles();
        } catch (IOException ex) {
            // When import status is saved to db, in that case mark it as failed
            log.error("Error scanning music library", ex);
            return;
        }

        log.info("Processing {} files", files.size());
        for (File file : files) {
            SongInfo songInfo = songParserService.parse(file.toPath()).orElse(null);
            String relativePath = musicDirectory.relativize(file.toPath()).toString();

            if (songInfo != null) {
                authors.addAll(songInfo.artists());
                albums.addAll(songInfo.albums());
            }

            songs.add(new SongEntity(
                    relativePath,
                    file.getName(),
                    file.length(),
                    now,
                    null,
                    null,
                    songInfo
            ));
        }

        songRepository.deleteAll(); // :)
        authorRepository.deleteAll();
        albumRepository.deleteAll();
        folderRepository.deleteAll();

        authorRepository.saveAll(authors.stream().map(AuthorEntity::new).toList());
        albumRepository.saveAll(albums.stream().map(AlbumEntity::new).toList());
        songRepository.saveAll(songs);

        log.info("Import for {} files finished", files.size());
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
