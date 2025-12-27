using FluentValidation;

namespace EmuSync.Agent.Dto.SyncSource;

/// <summary>
/// Common properties across the create and update DTOs to allow shared validation logic
/// </summary>
public interface ISyncSourceDto
{
    string Name { get; set; }
    int? AutoSyncFrequencyMins { get; set; }
}

/// <summary>
/// Shared validation logic between the Create and Update DTO
/// </summary>
public class SyncSourceDtoValidator : AbstractValidator<ISyncSourceDto>
{
    public SyncSourceDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.AutoSyncFrequencyMins).GreaterThan(0).When(x => x.AutoSyncFrequencyMins != null);
    }
}