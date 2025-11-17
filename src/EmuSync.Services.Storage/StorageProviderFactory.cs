using EmuSync.Domain;
using EmuSync.Domain.Entities;
using EmuSync.Domain.Enums;
using EmuSync.Domain.Services.Interfaces;
using EmuSync.Services.Storage.Dropbox;
using EmuSync.Services.Storage.GoogleDrive;
using EmuSync.Services.Storage.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace EmuSync.Services.Storage;

public class StorageProviderFactory(
    ILocalDataAccessor localDataAccessor,
    IServiceProvider serviceProvider
) : IStorageProviderFactory
{
    private readonly ILocalDataAccessor _localDataAccessor = localDataAccessor;
    private readonly IServiceProvider _serviceProvider = serviceProvider;

    public IStorageProvider Create(StorageProvider provider)
    {
        var scope = _serviceProvider.CreateScope();

        return provider switch
        {
            StorageProvider.GoogleDrive => scope.ServiceProvider.GetRequiredService<GoogleDriveStorageProvider>(),
            StorageProvider.Dropbox => scope.ServiceProvider.GetRequiredService<DropboxStorageProvider>(),
            _ => throw new NotImplementedException("Unknown storage provider"),
        };
    }

    public async Task<IStorageProvider?> CreateAsync(CancellationToken cancellationToken = default)
    {
        string syncSourceFile = _localDataAccessor.GetLocalFilePath(DomainConstants.LocalDataSyncSourceFile);

        if (!File.Exists(syncSourceFile)) return null;

        SyncSourceEntity? syncSource = await _localDataAccessor.ReadFileContentsAsync<SyncSourceEntity?>(syncSourceFile, cancellationToken);

        if (syncSource == null) return null;

        var scope = _serviceProvider.CreateScope();

        return syncSource.StorageProvider switch
        {
            StorageProvider.GoogleDrive => scope.ServiceProvider.GetRequiredService<GoogleDriveStorageProvider>(),
            StorageProvider.Dropbox => scope.ServiceProvider.GetRequiredService<DropboxStorageProvider>(),
            _ => null,
        };
    }
}
