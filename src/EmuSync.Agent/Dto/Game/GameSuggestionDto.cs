using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.Game;

public record GameSuggestionDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("suggestedFolderPaths")]
    public List<string> SuggestedFolderPaths { get; set; }
}