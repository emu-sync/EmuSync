using EmuSync.Agent.Dto.Game;
using EmuSync.Services.LudusaviImporter;

namespace EmuSync.Agent.Mapping;

public static class GameMapping
{
    /// <summary>
    /// Maps a <see cref="GameEntity"/> to a <see cref="GameDto"/>
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public static GameDto ToDto(this GameEntity entity)
    {
        return new()
        {
            Id = entity.Id,
            Name = entity.Name,
            AutoSync = entity.AutoSync,
            SyncSourceIdLocations = entity.SyncSourceIdLocations,
            LastSyncedFrom = entity.LastSyncedFrom,
            LastSyncTimeUtc = entity.LastSyncTimeUtc,
            StorageBytes = entity.StorageBytes,
        };
    }

    /// <summary>
    /// Maps a <see cref="FoundGame"/> to a <see cref="GameSuggestionDto"/>
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public static GameSuggestionDto ToDto(this FoundGame game)
    {
        return new()
        {
            Name = game.Name,
            SuggestedFolderPaths = game.SuggestedFolderPaths
        };
    }

    /// <summary>
    /// Maps a <see cref="GameEntity"/> to a <see cref="GameSummaryDto"/>
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public static GameSummaryDto ToSummaryDto(this GameEntity entity)
    {
        return new()
        {
            Id = entity.Id,
            Name = entity.Name,
            AutoSync = entity.AutoSync,
            LastSyncedFrom = entity.LastSyncedFrom,
            LastSyncTimeUtc = entity.LastSyncTimeUtc,
            StorageBytes = entity.StorageBytes,
        };
    }

    /// <summary>
    /// Maps a <see cref="IGameDto"/> to a <see cref="GameEntity"/>
    /// </summary>
    /// <param name="dto"></param>
    /// <returns></returns>
    public static GameEntity ToEntity(this IGameDto dto)
    {
        string id = default!;

        if (dto is UpdateGameDto updateDto)
        {
            id = updateDto.Id;
        }

        return new()
        {
            Id = id,
            Name = dto.Name,
            AutoSync = dto.AutoSync,
            SyncSourceIdLocations = dto.SyncSourceIdLocations
        };
    }
}
