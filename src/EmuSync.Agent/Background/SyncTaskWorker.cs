using EmuSync.Agent.Services;
using EmuSync.Services.Managers.Interfaces;
using Microsoft.Extensions.Options;

namespace EmuSync.Agent.Background;

public record SyncTaskWorkerConfig
{
    public const string Section = "SyncTaskWorkerConfig";
    public TimeSpan LoopDelayTimeSpan { get; set; }
}

public class SyncTaskWorker(
    ILogger<SyncTaskWorker> logger,
    IOptions<SyncTaskWorkerConfig> options,
    IGameFileWatchService fileWatchService,
    IServiceProvider serviceProvider,
    IGameSyncStatusCache gameSyncStatusCache
) : BackgroundService
{
    private readonly SyncTaskWorkerConfig _options = options.Value;

    private readonly ILogger<SyncTaskWorker> _logger = logger;
    private readonly IGameFileWatchService _fileWatchService = fileWatchService;
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private readonly IGameSyncStatusCache _gameSyncStatusCache = gameSyncStatusCache;

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        //wait on first load to give the GameSyncWorker a chance to complete first
        await Task.Delay(TimeSpan.FromSeconds(30), cancellationToken);

        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                var serviceScope = _serviceProvider.CreateScope();

                ILogger<SyncTaskService> logger = serviceScope.ServiceProvider.GetRequiredService<ILogger<SyncTaskService>>();
                IGameSyncManager gameSyncManager = serviceScope.ServiceProvider.GetRequiredService<IGameSyncManager>();
                ISyncSourceManager syncSourceManager = serviceScope.ServiceProvider.GetRequiredService<ISyncSourceManager>();

                SyncTaskService service = new(
                    logger,
                    _fileWatchService,
                    _gameSyncStatusCache,
                    gameSyncManager,
                    syncSourceManager
                );

                await service.ProcessSyncTasks(cancellationToken);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error caught in SyncTaskWorker");
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

