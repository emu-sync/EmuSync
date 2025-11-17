using EmuSync.Agent.Services;
using EmuSync.Services.Managers.Interfaces;
using Microsoft.Extensions.Options;

namespace EmuSync.Agent.Background;

public record GameSyncWorkerConfig
{
    public const string Section = "GameSyncWorkerConfig";

    public TimeSpan LoopDelayTimeSpan { get; set; }
}

public class GameSyncWorker(
    ILogger<GameSyncWorker> logger,
    IOptions<GameSyncWorkerConfig> options,
    IGameFileWatchService fileWatchService,
    IServiceProvider serviceProvider,
    IGameSyncStatusCache gameSyncStatusCache
) : BackgroundService
{
    private readonly GameSyncWorkerConfig _options = options.Value;

    private readonly ILogger<GameSyncWorker> _logger = logger;
    private readonly IGameFileWatchService _fileWatchService = fileWatchService;
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private readonly IGameSyncStatusCache _gameSyncStatusCache = gameSyncStatusCache;
    private bool _isFirstLoad = true;

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                DateTime now = DateTime.UtcNow;

                var serviceScope = _serviceProvider.CreateScope();

                ILogger<GameSyncService> logger = serviceScope.ServiceProvider.GetRequiredService<ILogger<GameSyncService>>();
                IGameManager gameManager = serviceScope.ServiceProvider.GetRequiredService<IGameManager>();
                IGameSyncManager gameSyncManager = serviceScope.ServiceProvider.GetRequiredService<IGameSyncManager>();
                ISyncSourceManager syncSourceManager = serviceScope.ServiceProvider.GetRequiredService<ISyncSourceManager>();

                GameSyncService service = new(
                    logger,
                    _fileWatchService,
                    _gameSyncStatusCache,
                    gameManager,
                    gameSyncManager,
                    syncSourceManager
                );

                await service.ManageWatchersAsync(_isFirstLoad, cancellationToken);

                _isFirstLoad = false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error caught in GameSyncWorker");
            }
            finally
            {
                await Task.Delay(_options.LoopDelayTimeSpan, cancellationToken);
            }

        }

    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        try
        {
            _fileWatchService.RemoveAllWatchers();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while running StopAsync");
        }

        await base.StopAsync(cancellationToken);
    }
}