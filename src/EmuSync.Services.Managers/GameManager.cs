using EmuSync.Domain.Extensions;
using EmuSync.Domain.Helpers;
using EmuSync.Services.Managers.Abstracts;
using EmuSync.Services.Managers.Enums;
using EmuSync.Services.Managers.Interfaces;
using EmuSync.Services.Storage;
using EmuSync.Services.Storage.Interfaces;
using EmuSync.Services.Storage.Objects;
using Microsoft.Extensions.Logging;

namespace EmuSync.Services.Managers;

public class GameManager(
    ILogger<GameManager> logger,
    ILocalDataAccessor localDataAccessor,
    IStorageProviderFactory storageProviderFactory
) : BaseManager(logger, localDataAccessor, storageProviderFactory), IGameManager
{

    public async Task<List<GameEntity>?> GetListAsync(CancellationToken cancellationToken = default)
    {
        var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);
        var file = await storageProvider.GetJsonFileAsync<GameListFile>(StorageConstants.FileName_GameList, cancellationToken: cancellationToken);

        return file?.Games.ConvertAll(x => x.ToEntity());
    }

    public async Task<GameEntity?> GetAsync(string id, CancellationToken cancellationToken = default)
    {
        var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);

        var file = await storageProvider.GetJsonFileAsync<GameListFile>(StorageConstants.FileName_GameList, cancellationToken: cancellationToken);
        var game = file?.Games.FirstOrDefault(x => x.Id == id);

        if (game == null) return null;
        return game.ToEntity();
    }

    public async Task CreateAsync(GameEntity entity, CancellationToken cancellationToken = default)
    {
        entity.Id = IdHelper.Create();

        //add it to the games list
        await WriteToExternalList(entity, ListOperation.Upsert, cancellationToken);
    }

    public async Task<bool> UpdateAsync(GameEntity entity, CancellationToken cancellationToken = default)
    {
        var foundEntity = await GetAsync(entity.Id, cancellationToken);
        if (foundEntity == null) return false;

        foundEntity.Name = entity.Name;
        foundEntity.SyncSourceIdLocations = entity.SyncSourceIdLocations;
        foundEntity.AutoSync = entity.AutoSync;

        //add it to the games list
        await WriteToExternalList(foundEntity, ListOperation.Upsert, cancellationToken);

        return true;
    }

    public async Task<bool> UpdateMetaDataAsync(GameEntity entity, CancellationToken cancellationToken = default)
    {
        var foundEntity = await GetAsync(entity.Id, cancellationToken);
        if (foundEntity == null) return false;

        foundEntity.LastSyncedFrom = entity.LastSyncedFrom;
        foundEntity.LastSyncTimeUtc = entity.LastSyncTimeUtc;
        foundEntity.LatestWriteTimeUtc = entity.LatestWriteTimeUtc;
        foundEntity.StorageBytes = entity.StorageBytes;

        //add it to the games list
        await WriteToExternalList(foundEntity, ListOperation.Upsert, cancellationToken);

        return true;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);

        var foundEntity = await GetAsync(id, cancellationToken);
        if (foundEntity == null) return false;

        //remove it from the games list
        await WriteToExternalList(foundEntity, ListOperation.Remove, cancellationToken);

        return true;
    }

    private async Task WriteToExternalList(GameEntity entity, ListOperation operation, CancellationToken cancellationToken)
    {
        var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);

        string fileName = StorageConstants.FileName_GameList;

        var file = await storageProvider.GetJsonFileAsync<GameListFile?>(fileName, cancellationToken: cancellationToken);

        file ??= new();
        file.Games ??= [];

        switch (operation)
        {
            case ListOperation.Upsert:
                var newItem = GameMetaData.FromGame(entity);
                file.Games.AddOrReplaceItem(newItem, x => x.Id == entity.Id);
                break;

            case ListOperation.Remove:
                file.Games.RemoveBy(x => x.Id == entity.Id);
                break;
        }

        await storageProvider.UpsertJsonDataAsync(fileName, file, cancellationToken: cancellationToken);
    }
}
