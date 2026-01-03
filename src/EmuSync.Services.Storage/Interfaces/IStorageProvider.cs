namespace EmuSync.Services.Storage.Interfaces;

public interface IStorageProvider
{
    /// <summary>
    /// Gets a file data by <paramref name="fileName"/>
    /// </summary>
    /// <typeparam name="TData"></typeparam>
    /// <param name="fileName"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<TData?> GetJsonFileAsync<TData>(string fileName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a zip file stream
    /// </summary>
    /// <param name="fileName"></param>
    /// <param name="onProgress"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<MemoryStream?> GetZipFileAsync(string fileName, Action<double>? onProgress = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a file by <paramref name="fileName"/>
    /// </summary>
    /// <typeparam name="TData"></typeparam>
    /// <param name="fileName"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task DeleteFileAsync(string fileName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates/creates a json file
    /// </summary>
    /// <param name="fileName"></param>
    /// <param name="data"></param>
    /// <param name="onProgress"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task UpsertJsonDataAsync(string fileName, object data, Action<double>? onProgress = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates/creates a zip file
    /// </summary>
    /// <param name="fileName"></param>
    /// <param name="stream"></param>
    /// <param name="onProgress"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task UpsertZipDataAsync(string fileName, MemoryStream stream, Action<double>? onProgress = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes any files associated with the provider
    /// </summary>
    void RemoveRelatedFiles();
}
