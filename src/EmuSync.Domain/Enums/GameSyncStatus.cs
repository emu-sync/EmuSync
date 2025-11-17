namespace EmuSync.Domain.Enums;

public enum GameSyncStatus
{
    Unknown = 0,
    RequiresDownload = 1,
    RequiresUpload = 2,
    InSync = 3,
    UnsetDirectory = 4,
}