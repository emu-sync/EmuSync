namespace EmuSync.Services.Storage.Dropbox;

public record class DropboxStorageProviderConfig
{
    public const string Section = "DropboxStorageProviderConfig";

    public string AppKey { get; set; }
    public string RedirectUri { get; set; }
}