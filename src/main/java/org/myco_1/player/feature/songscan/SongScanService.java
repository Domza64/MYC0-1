package org.myco_1.player.feature.songscan;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SongScanService {
    private final SongImportService songImportService;

    public void scanLocalLibrary() {
        songImportService.startImport();
    }
}
