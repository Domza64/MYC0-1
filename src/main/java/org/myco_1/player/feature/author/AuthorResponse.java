package org.myco_1.player.feature.author;

public record AuthorResponse(
        Long id,
        String name
) {
    public static AuthorResponse from(AuthorEntity authorEntity) {
        return new AuthorResponse(
                authorEntity.getId(),
                authorEntity.getName()
        );
    }
}
