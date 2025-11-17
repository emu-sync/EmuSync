using EmuSync.Agent.Dto.Game;
using EmuSync.Domain.Enums;
using EmuSync.Services.Managers.Interfaces;

namespace EmuSync.Agent.Controllers;

[ApiController]
[Route("[controller]")]
public class SyncSourceController(
    ILogger<SyncSourceController> logger,
    IValidationService validator,
    ISyncSourceManager manager,
    IGameFileWatchService fileWatchService
) : CustomControllerBase(logger, validator)
{
    private readonly ISyncSourceManager _manager = manager;
    private readonly IGameFileWatchService _fileWatchService = fileWatchService;

    [HttpGet]
    public async Task<IActionResult> GetList(CancellationToken cancellationToken = default)
    {
        List<SyncSourceEntity>? list = await _manager.GetListAsync(cancellationToken);

        list ??= [];

        List<SyncSourceSummaryDto> response = list.ConvertAll(x => x.ToSummaryDto());
        return Ok(response);
    }

    [HttpGet("Local")]
    public async Task<IActionResult> GetLocal(CancellationToken cancellationToken = default)
    {
        SyncSourceEntity? entity = await _manager.GetLocalAsync(cancellationToken);

        if (entity == null)
        {
            entity = await _manager.CreateLocalAsync(cancellationToken);
        }

        SyncSourceDto dto = entity.ToDto();

        return Ok(dto);
    }

    [HttpPut("Local")]
    public async Task<IActionResult> UpdateLocal([FromBody] UpdateSyncSourceDto requestBody, CancellationToken cancellationToken = default)
    {
        LogRequest($"{nameof(UpdateLocal)}", requestBody);

        List<string> bodyErrors = await Validator.ValidateAsync(requestBody, cancellationToken);
        if (bodyErrors.Count > 0) return BadRequestWithErrors(bodyErrors.ToArray());

        SyncSourceEntity entity = requestBody.ToEntity();
        await _manager.UpdateLocalAsync(entity, cancellationToken);

        return NoContent();
    }

    [HttpPost("Local/StorageProvider")]
    public async Task<IActionResult> SetLocalStorageProvider([FromBody] SetStorageProviderDto requestBody, CancellationToken cancellationToken = default)
    {
        LogRequest($"{nameof(SetLocalStorageProvider)}", requestBody);

        List<string> bodyErrors = await Validator.ValidateAsync(requestBody, cancellationToken);
        if (bodyErrors.Count > 0) return BadRequestWithErrors(bodyErrors.ToArray());

        StorageProvider storageProvider = (StorageProvider)requestBody.StorageProviderId;
        await _manager.SetLocalStorageProviderAsync(storageProvider, cancellationToken);

        return NoContent();
    }

    [HttpDelete("Local/StorageProvider")]
    public async Task<IActionResult> UnlinkLocalStorageProvider([FromQuery]bool force = false, CancellationToken cancellationToken = default)
    {
        LogRequest($"{nameof(UnlinkLocalStorageProvider)}?force={force}");

        SyncSourceEntity? entity = await _manager.GetLocalAsync(cancellationToken);

        if (entity == null)
        {
            return BadRequestWithErrors("No sync source exists");
        }

        if (entity.StorageProvider == null)
        {
            return BadRequestWithErrors("No storage provider has been set");
        }

        await _manager.UnlinkLocalStorageProviderAsync(entity, writeToExternalList: !force, cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] string id, CancellationToken cancellationToken = default)
    {
        LogRequest($"{nameof(Delete)}/{id}");

        SyncSourceEntity? entity = await _manager.GetLocalAsync(cancellationToken);

        bool exists = await _manager.DeleteAsync(id, cancellationToken);

        if (!exists)
        {
            return NotFoundWithErrors($"No sync source found with ID {id}");
        }

        if (entity?.Id == id)
        {
            _fileWatchService.RemoveAllWatchers();
        }

        return NoContent();
    }
}
