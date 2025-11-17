using System.Collections.Concurrent;

namespace EmuSync.Agent.Services;

public class GameFileWatchService(
    ILogger<GameFileWatchService> logger
) : IGameFileWatchService
{
    private readonly ILogger<GameFileWatchService> _logger = logger;

    //key = id of game
    private readonly ConcurrentDictionary<string, FileWatchInfo> _watchers = new();

    private readonly ConcurrentDictionary<string, GameEntity> _syncTasks = new();

    public void ModifyOrRemoveWatcher(string syncSourceId, GameEntity game)
    {
        _watchers.TryGetValue(game.Id, out FileWatchInfo? fileWatchInfo);

        //if we don't already have a watcher - just follow the process of trying to add one
        if (fileWatchInfo == null)
        {
            AddWatcher(syncSourceId, game);
            return;
        }

        string? folderPath = GetLocalFolderPath(syncSourceId, game);

        //if the local path is now empty, remove the existing watcher
        if (string.IsNullOrEmpty(folderPath))
        {
            RemoveWatcher(game.Id);
            return;
        }

        bool folderPathsAreDifferent = fileWatchInfo.FilePath != folderPath;

        if (folderPathsAreDifferent)
        {
            RemoveWatcher(game.Id);
            AddWatcher(syncSourceId, game);
        }
    }

    public void RemoveWatcher(string gameId)
    {
        if (_watchers.TryRemove(gameId, out var tuple))
        {
            _logger.LogInformation("Removing watcher for {gameId}", gameId);

            tuple.Watcher.Dispose();
            tuple.TokenSource.Cancel();

            _syncTasks.TryRemove(gameId, out _);
        }
    }

    public void RemoveAllWatchers()
    {
        foreach (string key in _watchers.Keys)
        {
            RemoveWatcher(key);
        }
    }

    public List<string> GetFileWatcherKeys()
    {
        return _watchers.Keys.ToList();
    }

    public GameEntity? GetNextSyncTask()
    {
        if (_syncTasks.IsEmpty)
        {
            return null;
        }

        GameEntity game = _syncTasks.FirstOrDefault().Value;
        _syncTasks.TryRemove(game.Id, out _);

        return game;
    }

    private void AddWatcher(string syncSourceId, GameEntity game)
    {
        var scope = _logger.BeginScope("GameFileWatchService");

        string? folderPath = GetLocalFolderPath(syncSourceId, game);

        //don't add the watcher if no sync location has been set for this device
        if (string.IsNullOrEmpty(folderPath))
        {
            _logger.LogInformation("No sync location has been set for game {gameName} / {gameId}", game.Name, game.Id);
            return;
        }

        //don't add the watcher if the folder doesn't exist
        if (!Path.Exists(folderPath))
        {
            _logger.LogInformation("Sync location {syncLocation} doesn't exist game {gameName} / {gameId}", folderPath, game.Name, game.Id);
            return;
        }

        FileSystemWatcher watcher = new(folderPath)
        {
            IncludeSubdirectories = true,
            EnableRaisingEvents = true
        };

        FileWatchInfo fileWatchInfo = new()
        {
            Watcher = watcher,
            TokenSource = new CancellationTokenSource(),
            Game = game
        };

        watcher.Created += (s, e) => OnChanged(fileWatchInfo, e);
        watcher.Changed += (s, e) => OnChanged(fileWatchInfo, e);
        watcher.Deleted += (s, e) => OnChanged(fileWatchInfo, e);

        bool added = _watchers.TryAdd(game.Id, fileWatchInfo);

        if (added)
        {
            //also add a sync task to be checked immediately
            AddSyncTask(game);

            _logger.LogInformation("Added watcher for game {gameName} / {gameId} at location {syncLocation}", game.Name, game.Id, folderPath);
        }
        else
        {
            _logger.LogWarning("Failed to add watcher for game {gameName} / {gameId} at location {syncLocation} - already exists?", game.Name, game.Id, folderPath);
        }
    }

    private string? GetLocalFolderPath(string syncSourceId, GameEntity game)
    {
        string? folderPath = null;
        game.SyncSourceIdLocations?.TryGetValue(syncSourceId, out folderPath);
        return folderPath;
    }

    private void OnChanged(FileWatchInfo fileWatchInfo, FileSystemEventArgs e)
    {
        //we might get loads of updates at once, so just add a "task" which will get processed outside of this service
        if (_syncTasks.Any(x => x.Key == fileWatchInfo.Game.Id)) return;

        _logger.LogInformation("[{gameName} / {gameId}] {changeType}: {fullPath}", fileWatchInfo.Game.Name, fileWatchInfo.Game.Id, e.ChangeType, e.FullPath);

        AddSyncTask(fileWatchInfo.Game);
    }

    public void AddSyncTask(GameEntity game)
    {
        _logger.LogInformation("[{gameName} / {gameId}] sync task added", game.Name, game.Id);
        _syncTasks.AddOrUpdate(game.Id, game, (_, _) => game);
    }
}

public record FileWatchInfo
{
    public FileSystemWatcher Watcher { get; set; }
    public CancellationTokenSource TokenSource { get; set; }
    public GameEntity Game { get; set; }
    public string FilePath { get; set; }
}