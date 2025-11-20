using EmuSync.Agent.Dto.Game;
using EmuSync.Domain.Extensions;
using EmuSync.Services.Managers.Interfaces;

namespace EmuSync.Agent.Controllers;

[ApiController]
[Route("[controller]")]
public class GameController(
    ILogger<GameController> logger,
    IValidationService validator,
    IGameManager manager,
    IGameFileWatchService fileWatchService,
    ISyncSourceManager syncSourceManager,
    IGameSyncStatusCache gameSyncStatusCache,
    IGameSyncService gameSyncService,
    IApiCache apiCache
) : CustomControllerBase(logger, validator)
{
    private readonly IGameManager _manager = manager;
    private readonly IGameFileWatchService _fileWatchService = fileWatchService;
    private readonly ISyncSourceManager _syncSourceManager = syncSourceManager;
    private readonly IGameSyncStatusCache _gameSyncStatusCache = gameSyncStatusCache;
    private readonly IGameSyncService _gameSyncService = gameSyncService;
    private readonly IApiCache _apiCache = apiCache;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery]bool forceReload = false, CancellationToken cancellationToken = default)
    {
        List<GameEntity>? list = _apiCache.Games.Value;

        if (list == null || forceReload)
        {
            list = await _manager.GetListAsync(cancellationToken);
            if (list != null) _apiCache.Games.Set(list);
        }

        //if we have games, just reprocess all the file watchers that might be attached / re-evaluate the sync statuses
        if (list != null && list.Count > 0)
        {
            try
            {
                await _gameSyncService.ManageWatchersAsync(
                    createSyncTasksIfAutoSync: false, 
                    list, 
                    checkForExternalSource: false,
                    cancellationToken
                );
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Failed to manage watchers from GameController");
            }

        }

        list ??= [];

        List<GameSummaryDto> response = list.ConvertAll(x => x.ToSummaryDto())
            .OrderBy(x => x.Name)
            .ToList();

        response.ForEach(game =>
        {
            var status = _gameSyncStatusCache.Get(game.Id);
            game.SyncStatusId = (int)status;
        });

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken cancellationToken = default)
    {
        GameEntity? entity = _apiCache.GetGame(id);
        entity ??= await _manager.GetAsync(id, cancellationToken);

        if (entity == null)
        {
            return NotFoundWithErrors($"No game found with ID {id}");
        }

        //even if we fetch, just update the watcher - we might have an outdated on this device
        await TryUpdateFileWatchAsync(entity, cancellationToken);

        GameDto response = entity.ToDto();
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGameDto requestBody, CancellationToken cancellationToken = default)
    {
        LogRequest($"{nameof(Create)}", requestBody);

        List<string> bodyErrors = await Validator.ValidateAsync(requestBody, cancellationToken);
        if (bodyErrors.Count > 0) return BadRequestWithErrors(bodyErrors.ToArray());

        var entity = requestBody.ToEntity();
        await _manager.CreateAsync(entity, cancellationToken);

        await TryUpdateFileWatchAsync(entity, cancellationToken);

        _apiCache.Games.Value?.AddOrReplaceItem(entity, x => x.Id == entity.Id);

        var response = entity.ToSummaryDto();
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] string id, [FromBody] UpdateGameDto requestBody, CancellationToken cancellationToken = default)
    {
        LogRequest($"{nameof(Update)}/{id}", requestBody);

        List<string> bodyErrors = await Validator.ValidateAsync(requestBody, cancellationToken);
        List<string> idErrors = Validator.ValidateIdsMatch(id, requestBody.Id);
        List<string> errors = bodyErrors.Concat(idErrors).ToList();

        if (errors.Count > 0) return BadRequestWithErrors(errors.ToArray());

        var entity = requestBody.ToEntity();
        var updatedEntity = await _manager.UpdateAsync(entity, cancellationToken);

        if (updatedEntity == null)
        {
            return NotFoundWithErrors($"No game found with ID {id}");
        }

        await TryUpdateFileWatchAsync(entity, cancellationToken);

        _apiCache.Games.Value?.AddOrReplaceItem(updatedEntity, x => x.Id == id);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] string id, CancellationToken cancellationToken = default)
    {
        LogRequest($"{nameof(Delete)}/{id}");

        bool exists = await _manager.DeleteAsync(id, cancellationToken);

        if (!exists)
        {
            return NotFoundWithErrors($"No game found with ID {id}");
        }

        TryRemoveFileWatch(id);

        _apiCache.Games.Value?.RemoveBy(x => x.Id == id);

        return NoContent();
    }

    private async Task TryUpdateFileWatchAsync(GameEntity game, CancellationToken cancellationToken)
    {

        try
        {
            var syncSource = await _syncSourceManager.GetLocalAsync(cancellationToken);

            if (syncSource == null)
            {
                Logger.LogWarning("No sync source configured - cannot update file watch for game {gameId}", game.Id);
                return;
            }


            if (game.AutoSync)
            {
                _fileWatchService.ModifyOrRemoveWatcher(syncSource.Id, game);
            }
            else
            {
                TryRemoveFileWatch(game.Id);
            }

        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error while updating file watch for game {gameId}", game.Id);
        }
    }

    private void TryRemoveFileWatch(string gameId)
    {
        try
        {
            _fileWatchService.RemoveWatcher(gameId);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error while removing file watch for game {gameId}", gameId);
        }
    }
}
