package org.myco_1.player.feature.folder;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.myco_1.player.feature.song.SongRepository;
import org.myco_1.player.feature.song.dto.SongResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FolderService {
    private final FolderRepository folderRepository;
    private final SongRepository songRepository;

    /**
     * Retrieves folders by their parent ID.
     *
     * @param parentId the ID of the parent folder, or {@code null} to retrieve folders in the root folder
     * @return the list of folders belonging to the specified parent
     */
    public List<FolderResponse> getFolders(@Nullable Long parentId) {
        return folderRepository.findByParentId(parentId)
                .stream()
                .map(FolderResponse::from)
                .toList();
    }

    /**
     * Retrieves songs from folder by its ID.
     *
     * @param folderId the ID of the folder, or {@code null} to retrieve songs in the root folder
     * @return the list of songs belonging to the specified folder
     */
    public List<SongResponse> getSongs(@Nullable Long folderId) {
        return songRepository.findByFolderId(folderId)
                .stream()
                .map(SongResponse::from)
                .toList();
    }
}
