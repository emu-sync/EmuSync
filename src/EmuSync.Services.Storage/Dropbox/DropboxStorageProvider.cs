using Dropbox.Api;
using Dropbox.Api.Files;
using EmuSync.Services.Storage.Interfaces;
using Microsoft.Extensions.Options;
using System.Text;
using System.Text.Json;

namespace EmuSync.Services.Storage.Dropbox;

public class DropboxStorageProvider(
    IOptions<DropboxStorageProviderConfig> options,
    DropboxAuthHandler authHandler
) : IStorageProvider, IDisposable
{
    private readonly DropboxStorageProviderConfig _options = options.Value;
    private readonly DropboxAuthHandler _authHandler = authHandler;
    private DropboxClient _dropboxClient;

    public async Task<TData?> GetJsonFileAsync<TData>(string fileName, CancellationToken cancellationToken = default)
    {
        string fullFilePath = GetFullFilePath(fileName);

        try
        {
            return await GetJsonFileContentsAsync<TData>(fullFilePath, cancellationToken);
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<MemoryStream?> GetZipFileAsync(string fileName, CancellationToken cancellationToken = default)
    {
        string fullFilePath = GetFullFilePath(fileName);
        return await GetZipFileContentsAsync(fullFilePath, cancellationToken);
    }

    public async Task DeleteFileAsync(string fileName, CancellationToken cancellationToken = default)
    {
        string fullFilePath = GetFullFilePath(fileName);
        var client = await GetDropboxClientAsync(cancellationToken);

        await client.Files.DeleteV2Async(fullFilePath);
    }

    public async Task UpsertJsonDataAsync(string fileName, object data, CancellationToken cancellationToken = default)
    {
        string fullFilePath = GetFullFilePath(fileName);

        string jsonContent = JsonSerializer.Serialize(data, new JsonSerializerOptions
        {
            WriteIndented = false
        });

        using var stream = new MemoryStream(Encoding.UTF8.GetBytes(jsonContent));

        await UpsertMemoryStreamAsync(fullFilePath, stream, cancellationToken);
    }

    public async Task UpsertZipDataAsync(string fileName, MemoryStream stream, CancellationToken cancellationToken = default)
    {
        string fullFilePath = GetFullFilePath(fileName);
        await UpsertMemoryStreamAsync(fullFilePath, stream, cancellationToken);
    }

    public void RemoveRelatedFiles()
    {
        _authHandler.RemoveToken();
    }

    /// <summary>
    /// Creates or updates a zip file
    /// </summary>
    /// <param name="fileName"></param>
    /// <param name="stream"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<FileMetadata> UpsertMemoryStreamAsync(
        string fileName,
        MemoryStream stream,
        CancellationToken cancellationToken = default
    )
    {
        var client = await GetDropboxClientAsync(cancellationToken);

        return await client.Files.UploadAsync(
            fileName,
            WriteMode.Overwrite.Instance,
            body: stream
        );
    }

    /// <summary>
    /// Gets a JSON file contents
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="filePath"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<T?> GetJsonFileContentsAsync<T>(string filePath, CancellationToken cancellationToken = default)
    {
        var client = await GetDropboxClientAsync(cancellationToken);

        string json;

        try
        {
            using var response = await client.Files.DownloadAsync(filePath);
            json = await response.GetContentAsStringAsync();
        }
        catch (Exception)
        {
            return default;
        }

        return JsonSerializer.Deserialize<T>(json)!;
    }

    /// <summary>
    /// Gets a zip file contents
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="filePath"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<MemoryStream> GetZipFileContentsAsync(string filePath, CancellationToken cancellationToken = default)
    {
        var client = await GetDropboxClientAsync(cancellationToken);
        using var response = await client.Files.DownloadAsync(filePath);

        var data = await response.GetContentAsByteArrayAsync();
        return new MemoryStream(data);
    }

    /// <summary>
    /// Connects to the drive service
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<DropboxClient> GetDropboxClientAsync(CancellationToken cancellationToken = default)
    {
        if (_dropboxClient != null) return _dropboxClient;

        var token = await _authHandler.GetTokenAsync(cancellationToken);

        if (token == null)
        {
            throw new InvalidOperationException("No dropbox token is present on the device");
        }

        //dropbox refresh tokens don't expire
        DropboxClient client = new(token.RefreshToken, appKey: _options.AppKey);

        _dropboxClient = client;
        return _dropboxClient;
    }

    private string GetFullFilePath(string fileName)
    {
        return "/" + fileName;
    }

    #region Dispose

    private bool _disposedValue;

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposedValue)
        {
            if (disposing)
            {
                _dropboxClient?.Dispose();
            }

            // TODO: free unmanaged resources (unmanaged objects) and override finalizer
            // TODO: set large fields to null
            _disposedValue = true;
        }
    }

    // // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
    // ~DropboxStorageProvider()
    // {
    //     // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
    //     Dispose(disposing: false);
    // }

    public void Dispose()
    {
        // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }

    #endregion
}
