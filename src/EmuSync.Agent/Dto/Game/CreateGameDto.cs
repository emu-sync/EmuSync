using FluentValidation;
using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.Game;

public record CreateGameDto : IGameDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("autoSync")]
    public bool AutoSync { get; set; }

    [JsonPropertyName("syncSourceIdLocations")]
    public Dictionary<string, string>? SyncSourceIdLocations { get; set; }
}

public class CreateGameDtoValidator : AbstractValidator<CreateGameDto>
{
    public CreateGameDtoValidator()
    {
        Include(new GameDtoValidator());
    }
}