using FluentValidation;
using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.Game;

public record UpdateGameDto : IGameDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("autoSync")]
    public bool AutoSync { get; set; }

    [JsonPropertyName("syncSourceIdLocations")]
    public Dictionary<string, string>? SyncSourceIdLocations { get; set; }
}

public class UpdateGameDtoValidator : AbstractValidator<UpdateGameDto>
{
    public UpdateGameDtoValidator()
    {
        Include(new GameDtoValidator());

        RuleFor(x => x.Id).NotEmpty();
    }
}