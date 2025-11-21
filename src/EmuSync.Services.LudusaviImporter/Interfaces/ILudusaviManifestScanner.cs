namespace EmuSync.Services.LudusaviImporter.Interfaces;

public interface ILudusaviManifestScanner
{
    double GetCompletionProgress();
    Task<LatestManifestScanResult> ScanForSaveFilesAsync(GameDefinitions gameDefinitions, CancellationToken cancellationToken = default);
}
