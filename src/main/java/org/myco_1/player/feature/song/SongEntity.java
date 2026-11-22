package org.myco_1.player.feature.song;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jspecify.annotations.Nullable;

@Entity
@Table(name = "songs")
@Getter
@NoArgsConstructor
public class SongEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private Long fileSize;

    @Nullable
    private Long folderId;

    public SongEntity(String filePath, String fileName, Long fileSize, @Nullable Long folderId) {
        this.filePath = filePath;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.folderId = folderId;
    }
}
