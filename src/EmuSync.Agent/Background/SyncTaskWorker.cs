namespace EmuSync.Agent.Background;

public class SyncTaskWorker(
    ILogger<SyncTaskWorker> logger,
    IServiceProvider serviceProvider,
    ISyncTasks syncTasks
) : BackgroundService
{
    private readonly ILogger<SyncTaskWorker> _logger = logger;
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private readonly ISyncTasks _syncTasks = syncTasks;

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {

            try
            {
                if (_syncTasks.HasTasks())
                {
                    await TryProcessTasksAsync(cancellationToken);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error caught in SyncTaskWorker");
            }
            finally
            {
                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }


        }

    }

    private async Task TryProcessTasksAsync(CancellationToken cancellationToken)
    {
        try
        {
            var serviceScope = _serviceProvider.CreateScope();
            ISyncTaskProcessor service = serviceScope.ServiceProvider.GetRequiredService<ISyncTaskProcessor>();

            GameEntity? syncTask = _syncTasks.GetNext();

            while (syncTask != null && !cancellationToken.IsCancellationRequested)
            {

                await service.ProcessSyncTaskAsync(syncTask, cancellationToken);
                syncTask = _syncTasks.GetNext();
            }

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error caught in SyncTaskWorker");
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        try
        {
            _syncTasks.Clear();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while running StopAsync");
        }

        await base.StopAsync(cancellationToken);
    }
}

