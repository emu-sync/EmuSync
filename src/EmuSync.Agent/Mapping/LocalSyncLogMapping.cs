using EmuSync.Agent.Dto.LocalSyncLog;

namespace EmuSync.Agent.Mapping;

public static class LocalSyncLogMapping
{
    /// <summary>
    /// Maps a <see cref="LocalSyncLogEntity"/> to a <see cref="LocalSyncLogDto"/>
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public static LocalSyncLogDto ToDto(this LocalSyncLogEntity entity)
    {
        return new()
        {
            Id = entity.Id,
            GameId = entity.GameId,
            IsAutoSync = entity.IsAutoSync,
            SyncTimeUtc = entity.SyncTimeUtc,
            SyncType = entity.SyncType
        };
    }
}