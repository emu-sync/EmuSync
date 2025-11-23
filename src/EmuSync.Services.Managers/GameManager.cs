using Dropbox.Api.Users;
using EmuSync.Domain;
using EmuSync.Domain.Extensions;
using EmuSync.Domain.Helpers;
using EmuSync.Services.Managers.Abstracts;
using EmuSync.Services.Managers.Enums;
using EmuSync.Services.Managers.Interfaces;
using EmuSync.Services.Storage;
using EmuSync.Services.Storage.Interfaces;
using EmuSync.Services.Storage.Objects;
using Microsoft.Extensions.Logging;
using static Dropbox.Api.Files.ListRevisionsMode;

namespace EmuSync.Services.Managers;

public class GameManager(
    ILogger<GameManager> logger,
    ILocalDataAccessor localDataAccessor,
    IStorageProviderFactory storageProviderFactory
) : BaseManager(logger, localDataAccessor, storageProviderFactory), IGameManager
{
    private static readonly SemaphoreSlim _lock = new(1, 1);

    public async Task<List<GameEntity>?> GetListAsync(CancellationToken cancellationToken = default)
    {
        await _lock.WaitAsync(cancellationToken);

        try
        {
            var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);

            var file = await storageProvider.GetJsonFileAsync<GameListFile>(
                StorageConstants.FileName_GameList,
                cancellationToken: cancellationToken
            );

            return file?.Games.ConvertAll(x => x.ToEntity());
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<GameEntity?> GetAsync(string id, CancellationToken cancellationToken = default)
    {
        await _lock.WaitAsync(cancellationToken);

        try
        {
            var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);

            var file = await storageProvider.GetJsonFileAsync<GameListFile>(StorageConstants.FileName_GameList, cancellationToken: cancellationToken);
            var game = file?.Games.FirstOrDefault(x => x.Id == id);

            if (game == null) return null;
            return game.ToEntity();
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task CreateAsync(GameEntity entity, CancellationToken cancellationToken = default)
    {
        entity.Id = IdHelper.Create();

        //add it to the games list
        await WriteToExternalList(entity, ListOperation.Upsert, cancellationToken);

        Logger.LogInformation("Game {name} was created", entity.Name);
    }

    public async Task<GameEntity?> UpdateAsync(GameEntity entity, CancellationToken cancellationToken = default)
    {
        var foundEntity = await GetAsync(entity.Id, cancellationToken);
        if (foundEntity == null) return null;

        foundEntity.Name = entity.Name;
        foundEntity.SyncSourceIdLocations = entity.SyncSourceIdLocations;
        foundEntity.SyncSourceIdLocations = null;

        if (entity.SyncSourceIdLocations != null)
        {
            //sanitise user inputs and remove any trailing slashes

            foundEntity.SyncSourceIdLocations = entity
                .SyncSourceIdLocations
                .ToDictionary(
                    x => x.Key,
                    x =>
                    {
                        var v = x.Value?.Trim() ?? string.Empty;
                        return v.TrimEnd('/', '\\');
                    });
        }

        foundEntity.AutoSync = entity.AutoSync;

        //add it to the games list
        await WriteToExternalList(foundEntity, ListOperation.Upsert, cancellationToken);

        Logger.LogInformation("Game {name} was updated", entity.Name);

        return foundEntity;
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

        Logger.LogInformation("The metadata for {name} was updated", entity.Name);

        return true;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);

        var foundEntity = await GetAsync(id, cancellationToken);
        if (foundEntity == null) return false;

        string fileName = string.Format(StorageConstants.FileName_GameZip, id);
        await storageProvider.DeleteFileAsync(fileName, cancellationToken);

        //remove it from the games list
        await WriteToExternalList(foundEntity, ListOperation.Remove, cancellationToken);

        Logger.LogInformation("Game {name} was deleted", foundEntity.Name);

        return true;
    }

    private async Task WriteToExternalList(GameEntity entity, ListOperation operation, CancellationToken cancellationToken)
    {
        var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);

        string fileName = StorageConstants.FileName_GameList;

        await _lock.WaitAsync(cancellationToken);

        try
        {
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
        finally
        {
            _lock.Release();
        }
    }
}
