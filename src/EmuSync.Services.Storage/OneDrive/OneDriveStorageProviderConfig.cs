namespace EmuSync.Services.Storage.OneDrive;

public record class OneDriveStorageProviderConfig
{
    public const string Section = "OneDriveStorageProviderConfig";

    public string ClientId { get; set; }
    public string RedirectUri { get; set; }
}