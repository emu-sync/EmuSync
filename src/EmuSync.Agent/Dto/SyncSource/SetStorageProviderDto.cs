using EmuSync.Domain.Enums;
using FluentValidation;
using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.SyncSource;

public record SetStorageProviderDto
{
    [JsonPropertyName("storageProviderId")]
    public int StorageProviderId { get; set; }
}

public class SetStorageProviderDtoValidator : AbstractValidator<SetStorageProviderDto>
{
    public SetStorageProviderDtoValidator()
    {
        RuleFor(x => x.StorageProviderId).IsValidEnumValue<SetStorageProviderDto, StorageProvider>("An invalid storage provider was provided");
    }
}