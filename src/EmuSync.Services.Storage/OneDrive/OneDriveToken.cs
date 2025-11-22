using System.Text.Json.Serialization;

namespace EmuSync.Services.Storage.OneDrive;

public record OneDriveToken
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }

    [JsonPropertyName("refresh_token")]
    public string RefreshToken { get; set; }

    [JsonPropertyName("token_type")]
    public string TokenType { get; set; }

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }

    [JsonPropertyName("ext_expires_in")]
    public int ExtExpiresIn { get; set; }

    [JsonPropertyName("scope")]
    public string Scope { get; set; }

    public DateTimeOffset ObtainedAt { get; set; }

    public bool IsExpired() => DateTimeOffset.UtcNow >= ObtainedAt.AddSeconds(ExpiresIn - 60);
}