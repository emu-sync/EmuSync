namespace EmuSync.Services.Storage.GoogleDrive;

public record GoogleDriveCache
{
    public string? DataFolderId { get; set; }

    public Dictionary<string, string> FileNameIds { get; set; }
}