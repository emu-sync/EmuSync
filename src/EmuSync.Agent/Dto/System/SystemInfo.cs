using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.System;

public record SystemInfoDto
{
    [JsonPropertyName("version")]
    public string Version { get; set; }
}