using EmuSync.Domain.Results;

namespace EmuSync.Domain.Services.Interfaces;

public interface ILocalDataAccessor
{
    /// <summary>
    /// Opens a file and deserialises the JSON
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="filePath"></param>
    /// <param name="cancellationToken"></param>
    Task<T> ReadFileContentsAsync<T>(string filePath, CancellationToken cancellationToken = default);


    /// <summary>
    /// Opens a file and deserialises the JSON if it exists
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="filePath"></param>
    /// <param name="cancellationToken"></param>
    Task<T?> ReadFileContentsOrDefaultAsync<T>(string filePath, CancellationToken cancellationToken = default);

    /// <summary>
    /// Writes to file
    /// </summary>
    /// <param name="filePath"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task WriteFileContentsAsync(string filePath, object data, CancellationToken cancellationToken = default);


    /// <summary>
    /// Removes a file
    /// </summary>
    /// <param name="filePath"></param>
    void RemoveFile(string filePath);

    /// <summary>
    /// Gets a file from the local folder
    /// </summary>
    /// <returns></returns>
    string GetLocalFilePath(string fileName);

    /// <summary>
    /// Scans a directory to determine info about all the files and folders
    /// </summary>
    /// <param name="path"></param>
    /// <returns></returns>
    DirectoryScanResult ScanDirectory(string? path);
}