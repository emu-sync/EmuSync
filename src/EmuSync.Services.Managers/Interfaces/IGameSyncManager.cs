using EmuSync.Domain.Enums;
using EmuSync.Services.Managers.Results;

namespace EmuSync.Services.Managers.Interfaces;

public interface IGameSyncManager
{
    /// <summary>
    /// Determines the sync type for the game at the given sync source
    /// </summary>
    /// <param name="syncSourceId"></param>
    /// <param name="game"></param>
    /// <returns></returns>
    GetSyncTypeResult GetSyncType(string syncSourceId, GameEntity game);

    /// <summary>
    /// Uploads the game, or downloads the new one
    /// </summary>
    /// <param name="syncSourceId"></param>
    /// <param name="game"></param>
    /// <param name="isAutoSync"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<GameSyncStatus> SyncGameAsync(string syncSourceId, GameEntity game, bool isAutoSync, CancellationToken cancellationToken = default);

    /// <summary>
    /// Downloads the game files regardless of if that's the suggested option
    /// </summary>
    /// <param name="syncSourceId"></param>
    /// <param name="game"></param>
    /// <param name="isAutoSync"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task ForceDownloadGameAsync(string syncSourceId, GameEntity game, bool isAutoSync, CancellationToken cancellationToken = default);

    /// <summary>
    /// Uploads the game files regardless of if that's the suggested option
    /// </summary>
    /// <param name="syncSourceId"></param>
    /// <param name="game"></param>
    /// <param name="isAutoSync"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task ForceUploadGameAsync(string syncSourceId, GameEntity game, bool isAutoSync, CancellationToken cancellationToken = default);
}
