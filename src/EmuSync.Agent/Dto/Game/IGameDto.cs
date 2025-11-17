using FluentValidation;

namespace EmuSync.Agent.Dto.Game;

/// <summary>
/// Common properties across the create and update DTOs to allow shared validation logic
/// </summary>
public interface IGameDto
{
    string Name { get; set; }
    bool AutoSync { get; set; }
    Dictionary<string, string>? SyncSourceIdLocations { get; set; }
}

/// <summary>
/// Shared validation logic between the Create and Update DTO
/// </summary>
public class GameDtoValidator : AbstractValidator<IGameDto>
{
    public GameDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(255);
    }
}