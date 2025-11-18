using EmuSync.Agent.Dto.GameSync;
using EmuSync.Domain.Enums;
using EmuSync.Services.Managers.Interfaces;
using EmuSync.Services.Managers.Results;

namespace EmuSync.Agent.Controllers;

[ApiController]
[Route("[controller]")]
public class GameSyncController(
    ILogger<GameSyncController> logger,
    IValidationService validator,
    IGameSyncManager manager,
    IGameManager gameManager,
    ISyncSourceManager syncSourceManager,
    IGameSyncStatusCache gameSyncStatusCache
) : CustomControllerBase(logger, validator)
{
    private readonly IGameSyncManager _manager = manager;
    private readonly IGameManager _gameManager = gameManager;
    private readonly ISyncSourceManager _syncSourceManager = syncSourceManager;
    private readonly IGameSyncStatusCache _gameSyncStatusCache = gameSyncStatusCache;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSyncStatus([FromRoute] string id, CancellationToken cancellationToken = default)
    {
        SyncSourceEntity? syncSource = await _syncSourceManager.GetLocalAsync(cancellationToken);

        if (syncSource == null)
        {
            return BadRequest("No sync source has been set up");
        }

        GameEntity? game = await _gameManager.GetAsync(id, cancellationToken);

        if (game == null)
        {
            return NotFoundWithErrors($"No game found with ID {id}");
        }

        GetSyncTypeResult result = _manager.GetSyncType(syncSource.Id, game);

        GameSyncStatusDto dto = new()
        {
            LastSyncedFrom = game.LastSyncedFrom,
            LastSyncedAtUtc = game.LastSyncTimeUtc,
            LatestWriteTimeUtc = game.LatestWriteTimeUtc,
            LocalLatestWriteTimeUtc = result.DirectoryScanResult.LatestWriteTimeUtc,
            RequiresUpload = result.SyncStatus == GameSyncStatus.RequiresUpload,
            RequiresDownload = result.SyncStatus == GameSyncStatus.RequiresDownload,
            LocalFolderPathIsUnset = result.NoLocalFolderPath,
            LocalFolderPathExists = result.DirectoryScanResult.DirectoryExists,
            StorageBytes = game.StorageBytes
        };

        _gameSyncStatusCache.AddOrUpdate(game.Id, result.SyncStatus);

        return Ok(dto);
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> SyncNow([FromRoute] string id, CancellationToken cancellationToken = default)
    {
        LogRequest($"{nameof(SyncNow)}/{id}");

        SyncSourceEntity? syncSource = await _syncSourceManager.GetLocalAsync(cancellationToken);

        if (syncSource == null)
        {
            return BadRequest("No sync source has been set up");
        }

        GameEntity? game = await _gameManager.GetAsync(id, cancellationToken);

        if (game == null)
        {
            return NotFoundWithErrors($"No game found with ID {id}");
        }

        await _manager.SyncGameAsync(syncSource.Id, game, cancellationToken);

        _gameSyncStatusCache.AddOrUpdate(id, GameSyncStatus.InSync);

        return Ok();
    }

    [HttpPost("{id}/ForceUpload")]
    public async Task<IActionResult> ForceUpload([FromRoute] string id, CancellationToken cancellationToken = default)
    {
        LogRequest($"{nameof(ForceUpload)}/{id}");

        SyncSourceEntity? syncSource = await _syncSourceManager.GetLocalAsync(cancellationToken);

        if (syncSource == null)
        {
            return BadRequest("No sync source has been set up");
        }

        GameEntity? game = await _gameManager.GetAsync(id, cancellationToken);

        if (game == null)
        {
            return NotFoundWithErrors($"No game found with ID {id}");
        }

        await _manager.ForceUploadGameAsync(syncSource.Id, game, cancellationToken);

        _gameSyncStatusCache.AddOrUpdate(id, GameSyncStatus.InSync);

        return Ok();
    }

    [HttpPost("{id}/ForceDownload")]
    public async Task<IActionResult> ForceDownload([FromRoute] string id, CancellationToken cancellationToken = default)
    {
        LogRequest($"{nameof(ForceDownload)}/{id}");

        SyncSourceEntity? syncSource = await _syncSourceManager.GetLocalAsync(cancellationToken);

        if (syncSource == null)
        {
            return BadRequest("No sync source has been set up");
        }

        GameEntity? game = await _gameManager.GetAsync(id, cancellationToken);

        if (game == null)
        {
            return NotFoundWithErrors($"No game found with ID {id}");
        }

        await _manager.ForceDownloadGameAsync(syncSource.Id, game, cancellationToken);

        _gameSyncStatusCache.AddOrUpdate(id, GameSyncStatus.InSync);

        return Ok();
    }
}
