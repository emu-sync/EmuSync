namespace EmuSync.Services.LudusaviImporter.Interfaces;

public interface ILudusaviManifestImporter
{
    Task<GameDefinitions?> GetManifestAsync(CancellationToken cancellationToken = default);
}
