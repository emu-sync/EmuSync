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
    IServiceProvider serviceProvider
) : BackgroundService
{
    private readonly GameSyncWorkerConfig _options = options.Value;

    private readonly ILogger<GameSyncWorker> _logger = logger;
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private static DateTime _nextRunTime = DateTime.MinValue;

    public static DateTime NextRunTime => _nextRunTime;
    public static void ResetNextRunTime()
    {
        _nextRunTime = DateTime.MinValue;
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            DateTime now = DateTime.UtcNow;

            if (now > _nextRunTime)
            {
                TimeSpan delay = await TryGetLoopDelayAsync(cancellationToken);
                _nextRunTime = now.Add(delay);

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

    private async Task<TimeSpan> TryGetLoopDelayAsync(CancellationToken cancellationToken)
    {
        try
        {
            var serviceScope = _serviceProvider.CreateScope();
            var service = serviceScope.ServiceProvider.GetRequiredService<ISyncSourceManager>();

            var syncSource = await service.GetLocalAsync(cancellationToken);

            return syncSource?.AutoSyncFrequency ?? _options.LoopDelayTimeSpan;
        }
        catch (Exception ex)
        {
            return _options.LoopDelayTimeSpan;
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await base.StopAsync(cancellationToken);
    }
}