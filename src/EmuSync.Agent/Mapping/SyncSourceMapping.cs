using EmuSync.Agent.Dto.Game;

namespace EmuSync.Agent.Mapping;

public static class SyncSourceMapping
{
    /// <summary>
    /// Maps a <see cref="SyncSourceEntity"/> to a <see cref="SyncSourceDto"/>
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public static SyncSourceDto ToDto(this SyncSourceEntity entity)
    {
        return new()
        {
            Id = entity.Id,
            Name = entity.Name,
            StorageProviderId = (int?)entity.StorageProvider,
            PlatformId = (int)(entity.OsPlatform),
            AutoSyncFrequencyMins = entity.AutoSyncFrequency.HasValue ? entity.AutoSyncFrequency.Value.Minutes : 2,
        };
    }

    /// <summary>
    /// Maps a <see cref="SyncSourceEntity"/> to a <see cref="SyncSourceSummaryDto"/>
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public static SyncSourceSummaryDto ToSummaryDto(this SyncSourceEntity entity)
    {
        return new()
        {
            Id = entity.Id,
            Name = entity.Name,
            StorageProviderId = (int?)entity.StorageProvider,
            PlatformId = (int)(entity.OsPlatform)
        };
    }

    /// <summary>
    /// Maps a <see cref="UpdateSyncSourceDto"/> to a <see cref="SyncSourceEntity"/>
    /// </summary>
    /// <param name="dto"></param>
    /// <returns></returns>
    public static SyncSourceEntity ToEntity(this ISyncSourceDto dto)
    {
        string id = default!;

        //if (dto is UpdateSyncSourceDto updateDto)
        //{
        //    id = updateDto.Id;
        //}

        return new()
        {
            Id = id,
            Name = dto.Name,
            AutoSyncFrequency = dto.AutoSyncFrequencyMins.HasValue ? TimeSpan.FromMinutes(dto.AutoSyncFrequencyMins.Value) : null
        };
    }
}
