using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.Auth;

public class MicrosoftAuthUrlResponseDto
{
    [JsonPropertyName("url")]
    public string Url { get; set; }
}
