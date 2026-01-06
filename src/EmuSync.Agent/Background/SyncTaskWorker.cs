using EmuSync.Domain;
using EmuSync.Domain.Services.Interfaces;

namespace EmuSync.Agent.Background;

public class SyncTaskWorker(
    ILogger<SyncTaskWorker> logger,
    IServiceProvider serviceProvider,
    ISyncTasks syncTasks,
    ILocalDataAccessor localDataAccessor
) : BackgroundService
{
    private readonly ILogger<SyncTaskWorker> _logger = logger;
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private readonly ISyncTasks _syncTasks = syncTasks;
    private readonly ILocalDataAccessor _localDataAccessor = localDataAccessor;

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        //keep temporary zip folder tidy
        DeleteTemporaryZipFolder();

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

    private void DeleteTemporaryZipFolder()
    {
        try
        {
            string path = _localDataAccessor.GetLocalFilePath(DomainConstants.LocalDataGameTempZipsFolder);

            if (Directory.Exists(path))
            {
                Directory.Delete(path, true);
            }

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete temp zip folder on startup");
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

