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
    IServiceProvider serviceProvider
) : BackgroundService
{
    private readonly GameSyncWorkerConfig _options = options.Value;

    private readonly ILogger<GameSyncWorker> _logger = logger;
    private readonly IGameFileWatchService _fileWatchService = fileWatchService;
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private bool _isFirstLoad = true;

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                DateTime now = DateTime.UtcNow;

                var serviceScope = _serviceProvider.CreateScope();
                var service = serviceScope.ServiceProvider.GetRequiredService<IGameSyncService>();

                //only create the sync tasks on first load, otherwise we're just managing the file watchers and sync statuses
                bool createSyncTasksIfAutoSync = _isFirstLoad;

                await service.ManageWatchersAsync(createSyncTasksIfAutoSync, games: null, cancellationToken);

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