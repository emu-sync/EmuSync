using EmuSync.Domain.Enums;
using EmuSync.Services.Storage.Interfaces;
using Microsoft.Extensions.Logging;

namespace EmuSync.Services.Managers.Abstracts;

public abstract class BaseManager(
    ILogger logger,
    ILocalDataAccessor localDataAccessor,
    IStorageProviderFactory storageProviderFactory
)
{
    protected readonly ILogger Logger = logger;
    protected readonly ILocalDataAccessor LocalDataAccessor = localDataAccessor;
    protected readonly IStorageProviderFactory _storageProviderFactory = storageProviderFactory;

    private IStorageProvider? _storageProvider;

    protected async Task<IStorageProvider> GetRequiredStorageProviderAsync(CancellationToken cancellationToken)
    {
        if (_storageProvider != null)
        {
            return _storageProvider;
        }

        var sp = await _storageProviderFactory.CreateAsync(cancellationToken)
            ?? throw new NotImplementedException("No storage provider has been configured");

        _storageProvider = sp;
        return sp;
    }

    protected async Task<IStorageProvider?> GetStorageProviderAsync(CancellationToken cancellationToken)
    {
        if (_storageProvider != null)
        {
            return _storageProvider;
        }

        var sp = await _storageProviderFactory.CreateAsync(cancellationToken);

        _storageProvider = sp;
        return sp;
    }

    protected IStorageProvider GetStorageProviderAsync(StorageProvider provider)
    {
        if (_storageProvider != null)
        {
            return _storageProvider;
        }

        var sp = _storageProviderFactory.Create(provider);

        _storageProvider = sp;
        return sp;
    }
}
