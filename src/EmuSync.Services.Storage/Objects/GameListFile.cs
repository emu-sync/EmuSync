using EmuSync.Domain.Entities;
using System.Text.Json.Serialization;

namespace EmuSync.Services.Storage.Objects;

public record GameListFile
{
    [JsonPropertyName("games")]
    public List<GameMetaData> Games { get; set; }
}