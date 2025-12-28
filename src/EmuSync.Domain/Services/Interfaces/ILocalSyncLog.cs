using EmuSync.Domain.Entities;
using EmuSync.Domain.Enums;

namespace EmuSync.Domain.Services.Interfaces;

public interface ILocalSyncLog
{
    Task<List<LocalSyncLogEntity>> GetAllLogsAsync(CancellationToken cancellationToken = default);
    Task<List<LocalSyncLogEntity>> GetAllLogsForGameAsync(string gameId, CancellationToken cancellationToken = default);
    Task WriteLogAsync(LocalSyncLogEntity localSyncLog, CancellationToken cancellationToken = default);
    Task WriteLogAsync(string gameId, SyncType syncType, bool isAutoSync, CancellationToken cancellationToken = default);
}