package org.myco_1.player.feature.album;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.myco_1.player.feature.author.AuthorEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "albums")
@Getter
@NoArgsConstructor
public class AlbumEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String cover;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "authors_albums",
            joinColumns = @JoinColumn(name = "album_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    private List<AuthorEntity> authors = new ArrayList<>();
}
