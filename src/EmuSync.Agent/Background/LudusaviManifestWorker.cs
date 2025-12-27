using EmuSync.Services.LudusaviImporter;
using EmuSync.Services.LudusaviImporter.Interfaces;

namespace EmuSync.Agent.Background;

public class LudusaviManifestWorker(
    ILogger<LudusaviManifestWorker> logger,
    ILudusaviManifestImporter manifestImporter,
    ILudusaviManifestScanner manifestScanner
) : BackgroundService
{
    private readonly ILogger<LudusaviManifestWorker> _logger = logger;
    //private readonly IServiceProvider _serviceProvider = serviceProvider;
    private readonly ILudusaviManifestImporter _manifestImporter = manifestImporter;
    private readonly ILudusaviManifestScanner _manifestScanner = manifestScanner;
    private static DateTime _nextRunTime = DateTime.MinValue;
    private static DateTime _lastScanTime = DateTime.MinValue;
    private static bool _scanInProgress = false;
    private static int _countOfGamesFound = 0;

    public static DateTime NextRunTime => _nextRunTime;
    public static DateTime LastScanTime => _lastScanTime;
    public static bool ScanInProgress => _scanInProgress;
    public static int CountOfGamesFound => _countOfGamesFound;

    public static void ResetNextRunTime()
    {
        _nextRunTime = DateTime.MinValue;
        _scanInProgress = true;
        _countOfGamesFound = 0;
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            DateTime now = DateTime.UtcNow;

            if (now > _nextRunTime)
            {
                _scanInProgress = true;
                TimeSpan delay = TimeSpan.FromHours(6);
                _nextRunTime = now.Add(delay);

                _logger.LogDebug("Checking for new Ludusavi manifest. Next run time is {runTime}", _nextRunTime);

                try
                {
                    GameDefinitions? gameDefinitions = await _manifestImporter.GetManifestAsync(cancellationToken);

                    if (gameDefinitions != null)
                    {
                        var result = await _manifestScanner.ScanForSaveFilesAsync(gameDefinitions, cancellationToken);

                        _countOfGamesFound = result.FoundGames.Count;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error caught in LudusaviManifestWorker");
                }
                finally
                {
                    _lastScanTime = DateTime.UtcNow;
                    _scanInProgress = false;
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