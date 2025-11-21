using EmuSync.Domain.Enums;

namespace EmuSync.Services.Managers.Interfaces;

public interface ISyncSourceManager
{
    /// <summary>
    /// Gets a list of <see cref="SyncSourceEntity"/>
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<SyncSourceEntity>?> GetListAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a <see cref="SyncSourceEntity"/>
    /// </summary>
    /// <param name="id"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<SyncSourceEntity?> GetAsync(string id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the local <see cref="SyncSourceEntity"/>
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<SyncSourceEntity?> GetLocalAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a local <see cref="SyncSourceEntity"/>
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<SyncSourceEntity> CreateLocalAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates a local <see cref="SyncSourceEntity"/>
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> UpdateLocalAsync(SyncSourceEntity entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sets the <paramref name="storageProvider"/> on the local <see cref="SyncSourceEntity"/>, connecting the storage provider
    /// </summary>
    /// <param name="storageProvider"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task SetLocalStorageProviderAsync(StorageProvider storageProvider, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes <see cref="StorageProvider"/> on the local <see cref="SyncSourceEntity"/>
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task UnlinkLocalStorageProviderAsync(SyncSourceEntity entity, bool writeToExternalList, CancellationToken cancellationToken = default);

    /// <summary>
    /// Delete a <see cref="SyncSourceEntity"/>
    /// </summary>
    /// <param name="id"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
}
