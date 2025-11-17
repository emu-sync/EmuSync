using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.Auth;

public class DropboxAuthUrlResponseDto
{
    [JsonPropertyName("url")]
    public string Url { get; set; }

    [JsonPropertyName("state")]
    public string State { get; set; }
}
