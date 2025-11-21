using EmuSync.Domain;
using EmuSync.Domain.Enums;
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

public class SyncSourceManager(
    ILogger<SyncSourceManager> logger,
    ILocalDataAccessor localDataAccessor,
    IStorageProviderFactory storageProviderFactory
) : BaseManager(logger, localDataAccessor, storageProviderFactory), ISyncSourceManager
{
    public async Task<List<SyncSourceEntity>?> GetListAsync(CancellationToken cancellationToken = default)
    {
        var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);
        var file = await storageProvider.GetJsonFileAsync<SyncSourceListFile>(StorageConstants.FileName_SyncSourceList, cancellationToken: cancellationToken);

        return file?.Sources.ConvertAll(source => source.ToEntity());
    }

    public async Task<SyncSourceEntity?> GetAsync(string id, CancellationToken cancellationToken = default)
    {
        var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);
        var file = await storageProvider.GetJsonFileAsync<SyncSourceListFile>(StorageConstants.FileName_SyncSourceList, cancellationToken: cancellationToken);

        return file?.Sources.FirstOrDefault(x => x.Id == id)?.ToEntity();
    }

    public async Task<SyncSourceEntity?> GetLocalAsync(CancellationToken cancellationToken = default)
    {
        string filePath = GetLocalSyncSourceFilePath();
        if (!File.Exists(filePath)) return null;

        return await LocalDataAccessor.ReadFileContentsAsync<SyncSourceEntity>(filePath, cancellationToken);
    }

    public async Task<SyncSourceEntity> CreateLocalAsync(CancellationToken cancellationToken = default)
    {
        string id = IdHelper.Create();
        string computerName = Environment.MachineName;

        SyncSourceEntity syncSource = new()
        {
            Id = id,
            Name = computerName,
            OsPlatform = PlatformHelper.GetOsPlatform()
        };

        string filePath = GetLocalSyncSourceFilePath();
        await LocalDataAccessor.WriteFileContentsAsync(filePath, syncSource, cancellationToken);

        return syncSource;
    }

    public async Task<bool> UpdateLocalAsync(SyncSourceEntity entity, CancellationToken cancellationToken = default)
    {
        SyncSourceEntity? foundEntity = await GetLocalAsync(cancellationToken);

        if (foundEntity == null) return false;

        bool autoSyncFrequencyChanged = foundEntity.AutoSyncFrequency != entity.AutoSyncFrequency;

        foundEntity.Name = entity.Name;
        foundEntity.AutoSyncFrequency = entity.AutoSyncFrequency;

        string filePath = GetLocalSyncSourceFilePath();
        await LocalDataAccessor.WriteFileContentsAsync(filePath, foundEntity, cancellationToken);

        await WriteToExternalList(foundEntity, ListOperation.Upsert, cancellationToken);

        return autoSyncFrequencyChanged;
    }

    public async Task SetLocalStorageProviderAsync(StorageProvider storageProvider, CancellationToken cancellationToken = default)
    {
        SyncSourceEntity? syncSource = await GetLocalAsync(cancellationToken);

        if (syncSource == null) throw new NotImplementedException("Local sync source doesn't exist");

        syncSource.StorageProvider = storageProvider;

        //forces a connect to the provider
        GetStorageProviderAsync(storageProvider);

        //this will try and connect to the external provider and do the action we want
        await WriteToExternalList(syncSource, ListOperation.Upsert, cancellationToken);

        //keep it up to date locally
        string filePath = GetLocalSyncSourceFilePath();
        await LocalDataAccessor.WriteFileContentsAsync(filePath, syncSource, cancellationToken);
    }

    public async Task UnlinkLocalStorageProviderAsync(SyncSourceEntity syncSource, bool writeToExternalList, CancellationToken cancellationToken = default)
    {
        var storageProvider = await GetStorageProviderAsync(cancellationToken);

        syncSource.StorageProvider = null;

        //this will try and connect to the external provider and do the action we want
        if (writeToExternalList)
        {
            await WriteToExternalList(syncSource, ListOperation.Remove, cancellationToken);
        }

        storageProvider?.RemoveRelatedFiles();

        //keep it up to date locally
        string filePath = GetLocalSyncSourceFilePath();
        await LocalDataAccessor.WriteFileContentsAsync(filePath, syncSource, cancellationToken);
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);

        var foundEntity = await GetAsync(id, cancellationToken);
        if (foundEntity == null) return false;

        SyncSourceEntity? syncSource = await GetLocalAsync(cancellationToken);

        if (syncSource?.Id == id)
        {
            await UnlinkLocalStorageProviderAsync(foundEntity, writeToExternalList: true, cancellationToken);
        }
        else
        {
            await WriteToExternalList(foundEntity, ListOperation.Remove, cancellationToken);
        }

        return true;
    }

    private async Task WriteToExternalList(SyncSourceEntity entity, ListOperation operation, CancellationToken cancellationToken)
    {
        //if we haven't connected to a storage provider yet, just get out
        var storageProvider = await GetStorageProviderAsync(cancellationToken);
        if (storageProvider == null) return;

        string fileName = StorageConstants.FileName_SyncSourceList;

        SyncSourceListFile? file = null;

        file = await storageProvider.GetJsonFileAsync<SyncSourceListFile?>(fileName, cancellationToken: cancellationToken);

        file ??= new();
        file.Sources ??= [];

        switch (operation)
        {
            case ListOperation.Upsert:

                SyncSource newItem = SyncSource.FromEntity(entity);
                file.Sources.AddOrReplaceItem(newItem, x => x.Id == entity.Id);
                break;

            case ListOperation.Remove:
                file.Sources.RemoveBy(x => x.Id == entity.Id);
                break;
        }

        await storageProvider.UpsertJsonDataAsync(fileName, file, cancellationToken: cancellationToken);
    }

    private string GetLocalSyncSourceFilePath()
    {
        return LocalDataAccessor.GetLocalFilePath(DomainConstants.LocalDataSyncSourceFile);
    }
}
