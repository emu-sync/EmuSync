using EmuSync.Domain.Helpers;
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
    int? MaximumLocalGameBackups { get; set; }
    List<string>? IgnoredFilePaths { get; set; }
}

/// <summary>
/// Shared validation logic between the Create and Update DTO
/// </summary>
public class GameDtoValidator : AbstractValidator<IGameDto>
{
    private const int MaxIgnoredFilePaths = 500;

    public GameDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(255);
        RuleFor(x => x.MaximumLocalGameBackups).GreaterThan(-1).When(x => x.MaximumLocalGameBackups != null);

        RuleFor(x => x.IgnoredFilePaths)
            .Must(x => x!.Count <= MaxIgnoredFilePaths)
            .WithMessage($"A maximum of {MaxIgnoredFilePaths} ignored file paths is allowed")
            .When(x => x.IgnoredFilePaths != null);

        RuleForEach(x => x.IgnoredFilePaths)
            .NotEmpty()
            .Must(BeSafeRelativePath)
            .WithMessage("Ignored file paths must be relative and cannot contain '..' segments")
            .When(x => x.IgnoredFilePaths != null);
    }

    private static bool BeSafeRelativePath(string? path)
    {
        if (string.IsNullOrWhiteSpace(path)) return false;

        string normalized = IgnoredFileMatcher.Normalize(path);

        if (normalized.Length == 0) return false;
        if (Path.IsPathRooted(normalized)) return false;
        if (normalized.Contains(':')) return false;

        return !normalized.Split('/').Any(segment => segment == "..");
    }
}