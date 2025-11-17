using FluentValidation;
using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.SyncSource;

public record UpdateSyncSourceDto : ISyncSourceDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; }
}

public class UpdateSyncSourceDtoValidator : AbstractValidator<UpdateSyncSourceDto>
{
    public UpdateSyncSourceDtoValidator()
    {
        Include(new SyncSourceDtoValidator());
    }
}