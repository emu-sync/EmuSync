namespace EmuSync.Services.Storage.GoogleDrive;

public record class GoogleDriveStorageProviderConfig
{
    public const string Section = "GoogleDriveStorageProviderConfig";

    public string ClientId { get; set; }
    public string RedirectUri { get; set; }
}