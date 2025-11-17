namespace EmuSync.Services.Storage.Dropbox;

public class DropboxToken
{
    public string AccessToken { get; set; }
    public string Uid { get; set; }
    public string State { get; set; }
    public string TokenType { get; set; }
    public string RefreshToken { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public List<string> ScopeList { get; set; }
}
