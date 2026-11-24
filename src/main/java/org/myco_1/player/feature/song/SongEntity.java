package org.myco_1.player.feature.song;

import jakarta.persistence.*;
import lombok.*;
import org.jspecify.annotations.Nullable;
import org.myco_1.player.feature.songscan.dto.SongInfo;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "songs")
@Getter
@NoArgsConstructor
public class SongEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nullable
    private String title;

    @Nullable
    private List<String> genres;

    @Nullable
    private Integer year;

    @Nullable
    private String image;

    @Nullable
    private Integer duration;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private Long fileSize;

    @Nullable
    private Long folderId;

    public SongEntity(String filePath, String fileName, Long fileSize, @Nullable String image, @Nullable Long folderId, @Nullable SongInfo songInfo) {
        this.filePath = filePath;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.folderId = folderId;
        if (songInfo != null) {
            this.title = songInfo.title();
            this.genres = songInfo.genres();
            this.year = songInfo.year();
            this.image = image;
            this.duration = songInfo.duration();
        } else {
            this.genres = new ArrayList<>();
        }
    }
}
