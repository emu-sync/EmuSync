namespace EmuSync.Agent.Services;

public class ApiCache : IApiCache
{
    public CacheSlot<List<GameEntity>> Games { get; } = new(TimeSpan.FromMinutes(1));
    public GameEntity? GetGame(string id) => Games.Value?.FirstOrDefault(x => x.Id == id);

    public void UpdateGame(GameEntity game)
    {
        Games.TryUpdate(list =>
        {
            var existing = list.FirstOrDefault(x => x.Id == game.Id);
            if (existing == null) return;

            existing.LastSyncedFrom = game.LastSyncedFrom;
            existing.LastSyncTimeUtc = game.LastSyncTimeUtc;
            existing.LatestWriteTimeUtc = game.LatestWriteTimeUtc;
            existing.StorageBytes = game.StorageBytes;
        });
    }

    public CacheSlot<List<SyncSourceEntity>> SyncSources { get; } = new(TimeSpan.FromMinutes(1));
}

public class CacheSlot<T>(TimeSpan defaultTTL)
{
    private readonly TimeSpan DefaultTTL = defaultTTL;
    private record CacheItem(T Value, DateTime ExpiresAt);

    private CacheItem? _item;

    public T? Value
    {
        get
        {
            if (_item == null) return default;
            if (_item.ExpiresAt < DateTime.UtcNow) return default;
            return _item.Value;
        }
    }
    public bool TryUpdate(Action<T> updateAction)
    {
        var item = _item;
        if (item == null) return false;
        if (item.ExpiresAt < DateTime.UtcNow) return false;

        updateAction(item.Value);
        return true;
    }

    public void Set(T value, TimeSpan? ttl = null)
    {
        var expires = DateTime.UtcNow.Add(ttl ?? DefaultTTL);
        Interlocked.Exchange(ref _item, new CacheItem(value, expires));
    }

    public void Clear()
    {
        Interlocked.Exchange(ref _item, null);
    }
}