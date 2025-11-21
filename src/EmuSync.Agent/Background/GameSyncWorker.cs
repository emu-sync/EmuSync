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
    IServiceProvider serviceProvider
) : BackgroundService
{
    private readonly GameSyncWorkerConfig _options = options.Value;

    private readonly ILogger<GameSyncWorker> _logger = logger;
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private DateTime _nextRunTime = DateTime.MinValue;

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            DateTime now = DateTime.UtcNow;

            if (now > _nextRunTime)
            {
                _nextRunTime = now.Add(_options.LoopDelayTimeSpan);

                _logger.LogDebug("Checking for new game syncs. Next run time is {runTime}", _nextRunTime);

                try
                {

                    var serviceScope = _serviceProvider.CreateScope();
                    var service = serviceScope.ServiceProvider.GetRequiredService<IGameSyncService>();

                    await service.TryDetectGameChangesAsync(cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error caught in GameSyncWorker");
                }
            }

            await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
        }

    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await base.StopAsync(cancellationToken);
    }
}