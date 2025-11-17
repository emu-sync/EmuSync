using EmuSync.Domain.Enums;

namespace EmuSync.Services.Storage.Interfaces;

public interface IStorageProviderFactory
{
    public IStorageProvider Create(StorageProvider provider);
    public Task<IStorageProvider?> CreateAsync(CancellationToken cancellationToken = default);
}
