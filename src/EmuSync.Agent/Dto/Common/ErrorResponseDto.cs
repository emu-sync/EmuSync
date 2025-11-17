using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.Common;

public record ErrorResponseDto
{
    [JsonPropertyName("status")]
    public int Status { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("errors")]
    public List<string>? Errors { get; set; }
}