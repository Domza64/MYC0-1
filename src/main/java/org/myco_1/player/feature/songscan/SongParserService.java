package org.myco_1.player.feature.songscan;

import lombok.extern.slf4j.Slf4j;
import org.apache.tika.io.TikaInputStream;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.metadata.TikaCoreProperties;
import org.apache.tika.metadata.XMPDM;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.myco_1.player.feature.songscan.dto.SongInfo;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class SongParserService {
    private final AutoDetectParser parser;

    public SongParserService() {
        this.parser = new AutoDetectParser();
    }

    public final Optional<SongInfo> parse(Path file) {
        try {
            Metadata metadata = new Metadata();

            try (TikaInputStream stream = TikaInputStream.get(file)) {
                parser.parse(
                        stream,
                        new BodyContentHandler(-1),
                        metadata,
                        new ParseContext()
                );
            }

            return Optional.of(mapMetadataToSongInfo(metadata));

        } catch (Exception e) {
            log.warn("Unable to parse file: {}", file, e);
            return Optional.empty();
        }
    }

    public SongInfo mapMetadataToSongInfo(Metadata metadata) {
        String title = metadata.get(TikaCoreProperties.TITLE);

        List<String> authors = getValues(
                metadata, XMPDM.ARTIST.getName()
        );

        List<String> albums = getValues(
                metadata, XMPDM.ALBUM.getName()
        );

        List<String> genres = getValues(
                metadata, XMPDM.GENRE.getName()
        );

        Integer duration = parseInteger(
                metadata.get(XMPDM.DURATION)
        );

        Integer year = parseInteger(
                metadata.get(XMPDM.RELEASE_DATE)
        );

        return new SongInfo(
                title,
                genres,
                year,
                duration,
                authors,
                albums
        );
    }

    private List<String> getValues(Metadata metadata, String key) {
        return Arrays.stream(metadata.getValues(key))
                .filter(value -> value != null && !value.isBlank())
                .distinct()
                .toList();
    }

    private Integer parseInteger(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            return (int) Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
