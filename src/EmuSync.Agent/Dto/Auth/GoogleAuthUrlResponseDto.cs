using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.Auth;

public class GoogleAuthUrlResponseDto
{
    [JsonPropertyName("url")]
    public string Url { get; set; }
}
