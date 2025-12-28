using EmuSync.Agent.Dto.LocalSyncLog;
using EmuSync.Domain.Services.Interfaces;

namespace EmuSync.Agent.Controllers;

[ApiController]
[Route("[controller]")]
public class LocalSyncLogController(
    ILogger<LocalSyncLogController> logger,
    IValidationService validator,
    ILocalSyncLog localSyncLog
) : CustomControllerBase(logger, validator)
{
    private readonly ILocalSyncLog _localSyncLog = localSyncLog;

    [HttpGet]
    public async Task<IActionResult> GetAllLogs(CancellationToken cancellationToken = default)
    {
        List<LocalSyncLogEntity> localSyncLogs = await _localSyncLog.GetAllLogsAsync(cancellationToken);

        List<LocalSyncLogDto> response = localSyncLogs.ConvertAll(log => log.ToDto());

        return Ok(response);
    }

    [HttpGet("Game/{gameId}")]
    public async Task<IActionResult> GetLogsForGame(string gameId, CancellationToken cancellationToken = default)
    {
        List<LocalSyncLogEntity> localSyncLogs = await _localSyncLog.GetAllLogsForGameAsync(gameId, cancellationToken);

        List<LocalSyncLogDto> response = localSyncLogs.ConvertAll(log => log.ToDto());

        return Ok(response);
    }
}
