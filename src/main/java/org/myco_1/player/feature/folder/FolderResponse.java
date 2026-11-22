package org.myco_1.player.feature.folder;

public record FolderResponse(
        Long id,
        String name
) {
    public static FolderResponse from(FolderEntity folderEntity) {
        return new FolderResponse(
                folderEntity.getId(),
                folderEntity.getName()
        );
    }
}
