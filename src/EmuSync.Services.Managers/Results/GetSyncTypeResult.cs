using EmuSync.Domain.Enums;
using EmuSync.Domain.Results;

namespace EmuSync.Services.Managers.Results;

public record GetSyncTypeResult
{
    public GameSyncStatus SyncStatus { get; set; }
    public string FolderPath { get; set; }
    public DirectoryScanResult DirectoryScanResult { get; set; }

    public bool NoLocalFolderPath => string.IsNullOrEmpty(FolderPath);
}
