package org.myco_1.player.feature.author;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.exception.ResourceNotFoundException;
import org.myco_1.player.feature.song.SongRepository;
import org.myco_1.player.feature.song.dto.SongResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {
    private final AuthorRepository authorRepository;
    private final SongRepository songRepository;

    public List<AuthorResponse> getAuthors() {
        return authorRepository.findAll()
                .stream()
                .map(AuthorResponse::from)
                .toList();
    }

    public AuthorResponse getAuthor(Long authorId) {
        return AuthorResponse.from(getAuthorEntity(authorId));
    }

    public List<SongResponse> getAuthorSongs(Long authorId) {
        getAuthorEntity(authorId); // Throws error if author doesn't exist

        return songRepository.findByAuthor(authorId)
                .stream()
                .map(SongResponse::from)
                .toList();
    }

    private AuthorEntity getAuthorEntity(Long authorId) {
        return authorRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("Author %s not found.".formatted(authorId)));
    }
}
